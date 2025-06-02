import React, { useState, useEffect } from 'react';
import { useAllCareersAndSubjects } from '../../hooks/useAllCareersAndSubjects';
import { usePostClasses } from '../../generated/api/classes/classes';
import { useAuth } from '../../contexts/AuthContext';
import { useStudentAuth } from '../../hooks/useStudentAuth';
import { usePopup } from '../../hooks/usePopup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faCalendarAlt, 
  faClock, 
  faUsers, 
  faGraduationCap,
  faChalkboardTeacher,
  faInfoCircle,
  faSave,
  faSpinner,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import ErrorPopup from '../../components/UI/ErrorPopup';
import type { CreateClassDto, CreateScheduleDto } from '../../generated/model';
import styles from './CreateClassPage.module.css';

interface ClassFormData {
  subjectId: number;
  clave: string;
  description: string;
  startTime: string;
  endTime: string;
  selectedDays: number[];
}

interface ApiError {
  message: string;
  error: string;
  statusCode: number;
}

// Días de la semana con sus IDs (asumiendo que 1=Lunes, 2=Martes, etc.)
const DAYS_OF_WEEK = [
  { id: 1, name: 'Lunes', shortName: 'L' },
  { id: 2, name: 'Martes', shortName: 'M' },
  { id: 3, name: 'Miércoles', shortName: 'X' },
  { id: 4, name: 'Jueves', shortName: 'J' },
  { id: 5, name: 'Viernes', shortName: 'V' },
  { id: 6, name: 'Sábado', shortName: 'S' },
  { id: 7, name: 'Domingo', shortName: 'D' },
];

const CreateClassPage: React.FC = () => {
  const { user, userType, isAuthenticated } = useAuth();
  const [selectedCareerId, setSelectedCareerId] = useState<number>(0);

  // Hook específico de estudiante para validación de perfil
  const {
    isStudent,
    studentData,
    userData,
    hasStudentProfile,
  } = useStudentAuth();

  // Verificar que el usuario esté autenticado
  if (!isAuthenticated) {
    return (
      <div className={styles.errorContainer}>
        <FontAwesomeIcon icon={faExclamationTriangle} className={styles.errorIcon} />
        <h2>Acceso restringido</h2>
        <p>Debes iniciar sesión para crear clases.</p>
      </div>
    );
  }

  // Verificar que sea un estudiante
  if (!isStudent) {
    return (
      <div className={styles.errorContainer}>
        <FontAwesomeIcon icon={faExclamationTriangle} className={styles.errorIcon} />
        <h2>Acceso restringido</h2>
        <p>Solo los estudiantes registrados pueden crear clases.</p>
        <p>Ve a tu perfil y regístrate como estudiante primero.</p>
      </div>
    );
  }

  // Verificar que el perfil de estudiante esté completo
  if (!hasStudentProfile || !studentData) {
    return (
      <div className={styles.errorContainer}>
        <FontAwesomeIcon icon={faExclamationTriangle} className={styles.errorIcon} />
        <h2>Perfil incompleto</h2>
        <p>No se pudieron cargar los datos del estudiante.</p>
        <p>Ve a tu <a href="/profile" style={{ color: '#667eea', textDecoration: 'underline' }}>perfil</a> y asegúrate de completar tu registro como estudiante.</p>
      </div>
    );
  }

  const currentStudentData = studentData;

  // Obtener materias filtradas por la carrera del estudiante
  const {
    subjects: subjectsData,
    isLoading: subjectsLoading,
  } = useAllCareersAndSubjects(currentStudentData?.id_career);

  const createClassMutation = usePostClasses();
  const { popup, showError, showSuccess, hidePopup } = usePopup();

  const [formData, setFormData] = useState<ClassFormData>({
    subjectId: 0,
    clave: '',
    description: '',
    startTime: '',
    endTime: '',
    selectedDays: [],
  });

  // Generar clave automática cuando se selecciona una materia
  useEffect(() => {
    if (formData.subjectId > 0) {
      const selectedSubject = subjectsData?.find(
        (subject: any) => subject.id_subject === formData.subjectId
      );
      if (selectedSubject) {
        setFormData(prev => ({
          ...prev,
          clave: selectedSubject.clave,
        }));
      }
    }
  }, [formData.subjectId, subjectsData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'subjectId' ? parseInt(value) : value,
    }));
  };

  const handleDayToggle = (dayId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(dayId)
        ? prev.selectedDays.filter(id => id !== dayId)
        : [...prev.selectedDays, dayId],
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.subjectId || !formData.clave || !formData.startTime || !formData.endTime) {
      showError(
        'Campos requeridos',
        'Por favor, completa todos los campos obligatorios.'
      );
      return false;
    }

    if (formData.selectedDays.length === 0) {
      showError(
        'Días requeridos',
        'Debes seleccionar al menos un día de la semana.'
      );
      return false;
    }

    // Validar que la hora de inicio sea menor que la de fin
    if (formData.startTime >= formData.endTime) {
      showError(
        'Horario inválido',
        'La hora de inicio debe ser menor que la hora de fin.'
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

    if (!currentStudentData) {
      showError(
        'Error de estudiante',
        'No se encontraron datos de estudiante. Debes estar registrado como estudiante para crear una clase.'
      );
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      // Crear el array de horarios para cada día seleccionado
      const schedule: CreateScheduleDto[] = formData.selectedDays.map(dayId => ({
        dayId,
        startTime: formData.startTime,
        endTime: formData.endTime,
      }));

      const classData: CreateClassDto = {
        subjectId: formData.subjectId,
        clave: formData.clave,
        description: formData.description,
        responsibleStudent: {
          studentId: currentStudentData.id_student,
          controlNumber: currentStudentData.control_number || '',
          studentPhone: currentStudentData.phone || '',
        },
        schedule,
      };

      await createClassMutation.mutateAsync({
        data: classData,
      });

      showSuccess(
        '¡Clase creada exitosamente!',
        'Tu clase ha sido enviada para revisión del administrador. Recibirás una notificación cuando sea aprobada.'
      );

      // Limpiar el formulario
      setFormData({
        subjectId: 0,
        clave: '',
        description: '',
        startTime: '',
        endTime: '',
        selectedDays: [],
      });

    } catch (error: any) {
      console.error('Error al crear clase:', error);
      const errorMessage = parseApiError(error);
      showError('Error al crear clase', errorMessage);
    }
  };

  // Estados de carga
  if (subjectsLoading) {
    return (
      <div className={styles.loadingContainer}>
        <FontAwesomeIcon icon={faSpinner} spin />
        <p>Cargando datos del formulario...</p>
      </div>
    );
  }

  return (
    <div className={styles.createClassContainer}>
      <div className={styles.createClassCard}>
        <div className={styles.createClassHeader}>
          <FontAwesomeIcon icon={faPlus} className={styles.headerIcon} />
          <h1 className={styles.createClassTitle}>Crear Nueva Clase</h1>
          <p className={styles.createClassSubtitle}>
            Propón una nueva clase para el curso de verano
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.createClassForm}>
          {/* Información del estudiante */}
          <div className={styles.studentInfo}>
            <h3 className={styles.sectionTitle}>
              <FontAwesomeIcon icon={faGraduationCap} />
              Información del Estudiante
            </h3>
            <div className={styles.studentDetails}>
              <div className={styles.studentDetailItem}>
                <span className={styles.detailLabel}>Estudiante:</span>
                <span className={styles.detailValue}>
                  {userData?.name} {userData?.paternal_surname}
                </span>
              </div>
              <div className={styles.studentDetailItem}>
                <span className={styles.detailLabel}>Número de Control:</span>
                <span className={styles.detailValue}>
                  {currentStudentData?.control_number || 'No disponible'}
                </span>
              </div>
              <div className={styles.studentDetailItem}>
                <span className={styles.detailLabel}>Carrera:</span>
                <span className={styles.detailValue}>
                  {currentStudentData?.career || 'No disponible'}
                </span>
              </div>
            </div>
          </div>

          {/* Selección de materia */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <FontAwesomeIcon icon={faChalkboardTeacher} />
              Información de la Clase
            </h3>
            
            <div className={styles.formGroup}>
              <label htmlFor="subjectId" className={styles.formLabel}>
                Materia <span className={styles.required}>*</span>
              </label>
              <select
                id="subjectId"
                name="subjectId"
                value={formData.subjectId}
                onChange={handleInputChange}
                className={styles.formSelect}
                required
              >
                <option value={0}>Selecciona una materia</option>
                {subjectsData?.map((subject: any) => (
                  <option key={subject.id_subject} value={subject.id_subject}>
                    {subject.clave} - {subject.name}
                  </option>
                ))}
              </select>
              {subjectsData && subjectsData.length > 0 && (
                <small className={styles.formHint}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  {subjectsData.length} materias disponibles para tu carrera
                </small>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="clave" className={styles.formLabel}>
                Clave de la Clase <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="clave"
                name="clave"
                value={formData.clave}
                onChange={handleInputChange}
                className={styles.formInput}
                placeholder="Se genera automáticamente"
                readOnly
                required
              />
              <small className={styles.formHint}>
                <FontAwesomeIcon icon={faInfoCircle} />
                La clave se genera automáticamente basada en la materia seleccionada
              </small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.formLabel}>
                Motivo
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={styles.formTextarea}
                placeholder="Motivo de apertura de la clase..."
                rows={4}
              />
            </div>
          </div>

          {/* Horarios */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <FontAwesomeIcon icon={faClock} />
              Horarios Sugeridos
            </h3>
            
            <div className={styles.timeInputs}>
              <div className={styles.formGroup}>
                <label htmlFor="startTime" className={styles.formLabel}>
                  Hora de Inicio <span className={styles.required}>*</span>
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="endTime" className={styles.formLabel}>
                  Hora de Fin <span className={styles.required}>*</span>
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Días de la Semana <span className={styles.required}>*</span>
              </label>
              <div className={styles.daysSelector}>
                {DAYS_OF_WEEK.map(day => (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => handleDayToggle(day.id)}
                    className={`${styles.dayButton} ${
                      formData.selectedDays.includes(day.id) ? styles.daySelected : ''
                    }`}
                  >
                    <span className={styles.dayShort}>{day.shortName}</span>
                    <span className={styles.dayFull}>{day.name}</span>
                  </button>
                ))}
              </div>
              <small className={styles.formHint}>
                <FontAwesomeIcon icon={faInfoCircle} />
                Selecciona uno o más días para la clase
              </small>
            </div>
          </div>

          {/* Botones de acción */}
          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={createClassMutation.isPending}
            >
              {createClassMutation.isPending ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Creando clase...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} />
                  Crear Clase
                </>
              )}
            </button>
          </div>
        </form>
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

export default CreateClassPage; 