import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useGetUsersRoles } from '../../generated/api/users/users';
import { useGetCareers } from '../../generated/api/careers/careers';
import { useGetStudents, usePostStudents } from '../../generated/api/students/students';
import { usePopup } from '../../hooks/usePopup';
import ErrorPopup from '../../components/UI/ErrorPopup';
import styles from './Profile.module.css';
import { ROLES } from '../../common';

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
  const { user, userType, isAuthenticated } = useAuth();
  const { data: rolesData, isLoading: rolesLoading } = useGetUsersRoles();
  const { data: careersData, isLoading: careersLoading } = useGetCareers();

  // Solo obtener datos adicionales si el usuario es estudiante pero no tiene studentData
  const needsStudentData = userType === 'student' && user?.type === 'student' && !user.studentData;
  const {
    data: studentsData,
    isLoading: studentsLoading,
    error: studentsError,
  } = useGetStudents(
    { userId: user?.type === 'student' ? user.id_user : 0 },
    {
      query: {
        enabled: needsStudentData,
        retry: false,
      },
    },
  );

  const createStudentMutation = usePostStudents();
  const { popup, showError, showSuccess, showWarning, hidePopup } = usePopup();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<StudentFormData>({
    phone: '',
    controlNumber: '',
    careerId: 0,
    countryCode: '+52',
  });

  // Verificar si el usuario ya es estudiante
  const isAlreadyStudent = userType === 'student' && user?.type === 'student' && !!user.studentData;
  const currentStudentData = user?.type === 'student' ? user.studentData : null;

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
      if (error?.response?.data) {
        const apiError = error.response.data as ApiError;
        return apiError.message || 'Error desconocido del servidor';
      }
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

    if (!user || user.type !== 'student') {
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
          id_role: ROLES.STUDENT.id,
          id_user: user.id_user,
        },
      });

      // Guardar el número de control en localStorage para futuras consultas
      localStorage.setItem(
        `student_control_${user.id_user}`,
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
  if (!isAuthenticated) {
    return (
      <div className={styles.errorContainer}>
        <h2>Sesión requerida</h2>
        <p>Debes iniciar sesión para acceder a tu perfil.</p>
      </div>
    );
  }

  if (rolesLoading || careersLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (!user) {
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
            {user.name?.charAt(0) || 'U'}
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
                {user.name || 'No disponible'}
              </span>
            </div>

            <div className={styles.infoRow}>
              <label className={styles.label}>Apellido Paterno:</label>
              <span className={styles.value}>
                {user.type === 'student' ? user.paternal_surname : 'No disponible'}
              </span>
            </div>

            <div className={styles.infoRow}>
              <label className={styles.label}>Apellido Materno:</label>
              <span className={styles.value}>
                {user.type === 'student' ? user.maternal_surname : 'No disponible'}
              </span>
            </div>

            <div className={styles.infoRow}>
              <label className={styles.label}>Email:</label>
              <span className={styles.value}>
                {user.email || 'No disponible'}
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
                  <div className={styles.phoneInput}>
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      className={styles.countrySelect}
                    >
                      <option value="+52">+52 (México)</option>
                      <option value="+1">+1 (US/Canada)</option>
                    </select>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="9982123456"
                      pattern="[0-9]{10,15}"
                      title="Solo números, entre 10 y 15 dígitos"
                      required
                    />
                  </div>
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
