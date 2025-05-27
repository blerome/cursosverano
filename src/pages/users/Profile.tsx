import React, { useState, useEffect } from 'react';
import { useGetAuthProfile } from '../../generated/api/auth/auth';
import { useGetUsersRoles } from '../../generated/api/users/users';
import { useGetCareers } from '../../generated/api/careers/careers';
import { usePostStudents } from '../../generated/api/students/students';
import { useGetStudents } from '../../generated/api/students/students';
import { useMsal } from '@azure/msal-react';
import { usePopup } from '../../hooks/usePopup';
import ErrorPopup from '../../components/UI/ErrorPopup';
import styles from './Profile.module.css';

interface StudentFormData {
  phone: string;
  controlNumber: string;
  careerId: number;
  countryCode: string;
}

interface ApiError {
  message: string;
  error: string;
  statusCode: number;
}

// Lista de códigos de país más comunes
const COUNTRY_CODES = [
  { code: '+52', country: 'México', flag: '🇲🇽' },
  { code: '+1', country: 'Estados Unidos', flag: '🇺🇸' },
  { code: '+1', country: 'Canadá', flag: '🇨🇦' },
  { code: '+34', country: 'España', flag: '🇪🇸' },
  { code: '+33', country: 'Francia', flag: '🇫🇷' },
  { code: '+49', country: 'Alemania', flag: '🇩🇪' },
  { code: '+44', country: 'Reino Unido', flag: '🇬🇧' },
  { code: '+39', country: 'Italia', flag: '🇮🇹' },
  { code: '+55', country: 'Brasil', flag: '🇧🇷' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴' },
  { code: '+51', country: 'Perú', flag: '🇵🇪' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
];

const Profile: React.FC = () => {
  const { accounts } = useMsal();
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
  } = useGetAuthProfile();
  const { data: rolesData, isLoading: rolesLoading } = useGetUsersRoles();
  const { data: careersData, isLoading: careersLoading } = useGetCareers();

  const userData = profileData?.data;

  // Ahora usamos el nuevo endpoint con userId
  const {
    data: studentsData,
    isLoading: studentsLoading,
    error: studentsError,
  } = useGetStudents(
    { userId: userData?.id_user || 0 },
    {
      query: {
        enabled: !!userData?.id_user, // Solo ejecutar si tenemos el userId
        retry: false, // No reintentar automáticamente en caso de error
      },
    },
  );

  const createStudentMutation = usePostStudents();

  // Hook personalizado para popups
  const { popup, showError, showSuccess, showWarning, hidePopup } = usePopup();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<StudentFormData>({
    phone: '',
    controlNumber: '',
    careerId: 0,
    countryCode: '+52',
  });

  // Obtener el controlNumber guardado del localStorage (si existe)
  const savedControlNumber = localStorage.getItem(
    `student_control_${userData?.id_user}`,
  );

  // Verificar si el usuario ya es estudiante basado SOLO en si tiene datos de estudiante
  // Si hay error 404, significa que no es estudiante
  const isAlreadyStudent = !!(studentsData?.data && !studentsError);

  // Con el nuevo endpoint, los datos del estudiante vienen directamente filtrados por userId
  const currentStudentData = studentsData?.data;

  // useEffect para debug y manejo de errores
  useEffect(() => {
    if (studentsError && process.env.NODE_ENV === 'development') {
      console.log('Error al obtener datos de estudiante:', studentsError);
      console.log(
        'Esto es normal si el usuario no está registrado como estudiante',
      );
    }
  }, [studentsError]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'careerId' ? parseInt(value) : value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.phone || !formData.controlNumber || !formData.careerId) {
      showError(
        'Campos requeridos',
        'Por favor, completa todos los campos obligatorios.',
      );
      return false;
    }

    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      showError(
        'Teléfono inválido',
        'El teléfono debe contener solo números y tener entre 10 y 15 dígitos.',
      );
      return false;
    }

    const controlNumberRegex = /^[A-Z]?\d{8}$/;
    if (!controlNumberRegex.test(formData.controlNumber)) {
      showError(
        'Número de control inválido',
        'El número de control debe tener 8 dígitos, opcionalmente precedido por una letra.',
      );
      return false;
    }

    return true;
  };

  const parseApiError = (error: any): string => {
    try {
      // Si el error tiene una estructura específica del backend
      if (error?.response?.data) {
        const apiError = error.response.data as ApiError;
        return apiError.message || 'Error desconocido del servidor';
      }

      // Si es un error de red o genérico
      if (error?.message) {
        return error.message;
      }

      return 'Error inesperado. Por favor, intenta nuevamente.';
    } catch {
      return 'Error inesperado. Por favor, intenta nuevamente.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData?.id_user) {
      showError(
        'Error de sesión',
        'No se pudo obtener la información del usuario. Por favor, inicia sesión nuevamente.',
      );
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      const fullPhoneNumber = `${formData.countryCode}${formData.phone}`;

      await createStudentMutation.mutateAsync({
        data: {
          id_career: formData.careerId,
          control_number: formData.controlNumber,
          phone: fullPhoneNumber,
          id_role: 2,
          id_user: userData.id_user,
        },
      });

      // Guardar el número de control en localStorage para futuras consultas
      localStorage.setItem(
        `student_control_${userData.id_user}`,
        formData.controlNumber,
      );

      showSuccess(
        '¡Registro exitoso!',
        'Te has registrado como estudiante correctamente. Ahora puedes acceder a todas las funciones estudiantiles.',
      );

      setIsEditing(false);
      setFormData({
        phone: '',
        controlNumber: '',
        careerId: 0,
        countryCode: '+52',
      });

      // Recargar datos del perfil para actualizar el estado
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error('Error al crear perfil de estudiante:', error);
      const errorMessage = parseApiError(error);
      showError('Error en el registro', errorMessage);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      phone: '',
      controlNumber: '',
      careerId: 0,
      countryCode: '+52',
    });
  };

  const handleStartEditing = () => {
    if (isAlreadyStudent) {
      showWarning(
        'Ya eres estudiante',
        'Tu cuenta ya está registrada como estudiante. No es necesario registrarse nuevamente.',
      );
      return;
    }
    setIsEditing(true);
  };

  // Estados de carga y error
  if (!accounts || accounts.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <h2>Sesión requerida</h2>
        <p>Debes iniciar sesión para acceder a tu perfil.</p>
      </div>
    );
  }

  if (profileLoading || rolesLoading || careersLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error al cargar el perfil</h2>
        <p>
          No se pudo cargar la información del perfil. Por favor, intenta
          nuevamente más tarde.
        </p>
      </div>
    );
  }

  const studentRole = rolesData?.data?.find((role: any) => role.id_role === 2);
  const careers = careersData?.data.data || [];

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {userData?.name?.charAt(0) || 'U'}
          </div>
          <h1 className={styles.profileTitle}>Mi Perfil</h1>
        </div>

        <div className={styles.profileInfo}>
          {/* Información básica (solo lectura) */}
          <div className={styles.infoSection}>
            <h3 className={styles.sectionTitle}>Información Personal</h3>

            <div className={styles.infoRow}>
              <label className={styles.label}>Nombre:</label>
              <span className={styles.value}>
                {userData?.name || 'No disponible'}
              </span>
            </div>

            <div className={styles.infoRow}>
              <label className={styles.label}>Apellido Paterno:</label>
              <span className={styles.value}>
                {userData?.paternal_surname || 'No disponible'}
              </span>
            </div>

            <div className={styles.infoRow}>
              <label className={styles.label}>Apellido Materno:</label>
              <span className={styles.value}>
                {userData?.maternal_surname || 'No disponible'}
              </span>
            </div>

            <div className={styles.infoRow}>
              <label className={styles.label}>Email:</label>
              <span className={styles.value}>
                {userData?.email || 'No disponible'}
              </span>
            </div>
          </div>

          {/* Información del estudiante (si ya está registrado) */}
          {isAlreadyStudent && currentStudentData && (
            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>Información de Estudiante</h3>

              <div className={styles.infoRow}>
                <label className={styles.label}>Número de Control:</label>
                <span className={styles.value}>
                  {currentStudentData.control_number || 'No disponible'}
                </span>
              </div>

              <div className={styles.infoRow}>
                <label className={styles.label}>Teléfono:</label>
                <span className={styles.value}>
                  {currentStudentData.phone || 'No disponible'}
                </span>
              </div>

              <div className={styles.infoRow}>
                <label className={styles.label}>Carrera:</label>
                <span className={styles.value}>
                  {currentStudentData.career || 'No disponible'}
                </span>
              </div>
            </div>
          )}

          {/* Sección de debug temporal - REMOVER EN PRODUCCIÓN */}
          {/* {process.env.NODE_ENV === 'development' && (
            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>Debug Info (Solo desarrollo)</h3>
              <div className={styles.infoRow}>
                <label className={styles.label}>Es estudiante:</label>
                <span className={styles.value}>{isAlreadyStudent ? 'Sí' : 'No'}</span>
              </div>
              <div className={styles.infoRow}>
                <label className={styles.label}>Datos de estudiante encontrados:</label>
                <span className={styles.value}>{currentStudentData ? 'Sí' : 'No'}</span>
              </div>
              <div className={styles.infoRow}>
                <label className={styles.label}>ID Usuario actual:</label>
                <span className={styles.value}>{userData?.id_user || 'No disponible'}</span>
              </div>
              <div className={styles.infoRow}>
                <label className={styles.label}>Cargando estudiantes:</label>
                <span className={styles.value}>{studentsLoading ? 'Sí' : 'No'}</span>
              </div>
              <div className={styles.infoRow}>
                <label className={styles.label}>Error estudiantes:</label>
                <span className={styles.value}>{studentsError ? 'Sí (404 es normal)' : 'No'}</span>
              </div>
              {studentsError && (
                <div className={styles.infoRow}>
                  <label className={styles.label}>Detalle del error:</label>
                  <span className={styles.value}>
                    {JSON.stringify(studentsError, null, 2)}
                  </span>
                </div>
              )}
              {currentStudentData && (
                <div className={styles.infoRow}>
                  <label className={styles.label}>Datos del estudiante:</label>
                  <span className={styles.value}>
                    {JSON.stringify(currentStudentData, null, 2)}
                  </span>
                </div>
              )}
            </div>
          )} */}

          {/* Sección de registro como estudiante */}
          <div className={styles.infoSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Estado de Estudiante</h3>
              {!isAlreadyStudent && !isEditing && (
                <button
                  className={styles.editButton}
                  onClick={handleStartEditing}
                >
                  Registrarse como Estudiante
                </button>
              )}
            </div>

            {isAlreadyStudent ? (
              <div className={styles.studentInfo}>
                <div className={styles.studentStatus}>
                  <span className={styles.statusBadge}>
                    ✅ Estudiante Registrado
                  </span>
                  <p className={styles.infoText}>
                    Tu cuenta está registrada como estudiante. Puedes acceder a
                    todas las funciones estudiantiles como inscripción a cursos,
                    consulta de horarios y más.
                  </p>
                </div>
              </div>
            ) : isEditing ? (
              <form onSubmit={handleSubmit} className={styles.studentForm}>
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Teléfono:</label>
                  <div className={styles.phoneInputContainer}>
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      className={styles.countryCodeSelect}
                    >
                      {COUNTRY_CODES.map((country, index) => (
                        <option
                          key={`${country.code}-${index}`}
                          value={country.code}
                        >
                          {country.flag} {country.code} {country.country}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={styles.phoneInput}
                      placeholder="9981234567"
                      pattern="[0-9]{10,15}"
                      title="Solo números, 10-15 dígitos"
                      required
                    />
                  </div>
                  <small className={styles.phoneHelp}>
                    Ejemplo: {formData.countryCode}9981234567
                  </small>
                </div>

                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Número de Control:</label>
                  <input
                    type="text"
                    name="controlNumber"
                    value={formData.controlNumber}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Ej: L20530228 o 20530228"
                    pattern="[A-Z]?[0-9]{8}"
                    title="8 dígitos, opcionalmente precedido por una letra"
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Carrera:</label>
                  <select
                    name="careerId"
                    value={formData.careerId}
                    onChange={handleInputChange}
                    className={styles.formSelect}
                    required
                  >
                    <option value={0}>Selecciona una carrera</option>
                    {careers.map((career: any) => (
                      <option key={career.id_career} value={career.id_career}>
                        {career.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formActions}>
                  <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={createStudentMutation.isPending}
                  >
                    {createStudentMutation.isPending
                      ? 'Registrando...'
                      : 'Registrar como Estudiante'}
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={handleCancel}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className={styles.studentInfo}>
                <p className={styles.infoText}>
                  {studentRole
                    ? `Regístrate como ${studentRole.name} para acceder a funciones como inscripción a cursos, consulta de horarios y más.`
                    : 'Regístrate como estudiante para acceder a todas las funciones estudiantiles.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popup de errores/mensajes */}
      <ErrorPopup
        isOpen={popup.isOpen}
        onClose={hidePopup}
        title={popup.title}
        message={popup.message}
        type={popup.type}
        autoClose={popup.type === 'success'}
        autoCloseDelay={3000}
      />
    </div>
  );
};

export default Profile;
