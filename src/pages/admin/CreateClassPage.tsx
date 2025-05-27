import React, { useState, useEffect } from 'react';
import { useGetAuthProfile } from '../../generated/api/auth/auth';
import { useGetStudents } from '../../generated/api/students/students';
import { useAllCareersAndSubjects } from '../../hooks/useAllCareersAndSubjects';
import { usePostClasses } from '../../generated/api/classes/classes';
import { usePopup } from '../../hooks/usePopup';
import ErrorPopup from '../../components/UI/ErrorPopup';
import { CreateClassDto, CreateScheduleDto } from '../../generated/model';
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
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
  } = useGetAuthProfile();

  const userData = profileData?.data;

  // Obtener datos del estudiante actual
  const {
    data: studentsData,
    isLoading: studentsLoading,
    error: studentsError,
  } = useGetStudents(
    { userId: userData?.id_user || 0 },
    {
      query: {
        enabled: !!userData?.id_user,
        retry: false,
      },
    },
  );

  const currentStudentData = studentsData?.data;

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
        description: formData.description || undefined,
        responsibleStudent: {
          studentId: currentStudentData.id_student,
          controlNumber: currentStudentData.control_number || '',
          studentPhone: currentStudentData.phone || '',
        },
        schedule,
      };

      await createClassMutation.mutateAsync({ data: classData });

      showSuccess(
        '¡Clase creada exitosamente!',
        'La clase ha sido creada y tú eres el jefe de grupo. Los estudiantes ya pueden inscribirse.'
      );

      // Limpiar formulario
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

  // Estados de carga y error
  if (profileLoading || studentsLoading || subjectsLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>
          {profileLoading && 'Cargando información del usuario...'}
          {studentsLoading && 'Cargando información del estudiante...'}
          {subjectsLoading && 'Cargando materias disponibles...'}
        </p>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error de autenticación</h2>
        <p>No se pudo cargar la información del usuario.</p>
      </div>
    );
  }

  if (studentsError || !currentStudentData) {
    return (
      <div className={styles.errorContainer}>
        <h2>Acceso restringido</h2>
        <p>Debes estar registrado como estudiante para crear clases.</p>
        <p>Ve a tu perfil y regístrate como estudiante primero.</p>
      </div>
    );
  }

  const subjects = subjectsData || [];

  return (
    <div className={styles.createClassContainer}>
      <div className={styles.createClassCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Crear Nueva Clase</h1>
          <p className={styles.subtitle}>
            Como jefe de grupo, puedes crear una nueva clase para que otros estudiantes se inscriban
          </p>
        </div>

        <div className={styles.studentInfo}>
          <h3>Información del Jefe de Grupo</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Nombre:</label>
              <span>{userData?.name} {userData?.paternal_surname}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Número de Control:</label>
              <span>{currentStudentData.control_number}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Teléfono:</label>
              <span>{currentStudentData.phone}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Carrera:</label>
              <span>{currentStudentData.career}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.classForm}>
          <div className={styles.formSection}>
            <h3>Información de la Clase</h3>
            
            <div className={styles.formRow}>
              <label className={styles.formLabel}>Materia: *</label>
              <select
                name="subjectId"
                value={formData.subjectId}
                onChange={handleInputChange}
                className={styles.formSelect}
                required
              >
                <option value={0}>Selecciona una materia</option>
                {subjects.map((subject: any) => (
                  <option key={subject.id_subject} value={subject.id_subject}>
                    {subject.clave} - {subject.name} ({subject.credits} créditos)
                  </option>
                ))}
              </select>
              <small className={styles.helpText}>
                Mostrando {subjects.length} materias disponibles para tu carrera: {currentStudentData.career}
              </small>
            </div>

            <div className={styles.formRow}>
              <label className={styles.formLabel}>Clave de la Clase: *</label>
              <input
                type="text"
                name="clave"
                value={formData.clave}
                onChange={handleInputChange}
                className={styles.formInput}
                placeholder="Se genera automáticamente"
                required
                readOnly
              />
              <small className={styles.helpText}>
                La clave se genera automáticamente al seleccionar una materia
              </small>
            </div>

            <div className={styles.formRow}>
              <label className={styles.formLabel}>Descripción:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={styles.formTextarea}
                placeholder="Descripción opcional de la clase..."
                rows={3}
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Horario</h3>
            
            <div className={styles.timeRow}>
              <div className={styles.timeGroup}>
                <label className={styles.formLabel}>Hora de Inicio: *</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>
              
              <div className={styles.timeGroup}>
                <label className={styles.formLabel}>Hora de Fin: *</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>
            </div>

            <div className={styles.daysSection}>
              <label className={styles.formLabel}>Días de la Semana: *</label>
              <div className={styles.daysGrid}>
                {DAYS_OF_WEEK.map(day => (
                  <button
                    key={day.id}
                    type="button"
                    className={`${styles.dayButton} ${
                      formData.selectedDays.includes(day.id) ? styles.selected : ''
                    }`}
                    onClick={() => handleDayToggle(day.id)}
                  >
                    <span className={styles.dayShort}>{day.shortName}</span>
                    <span className={styles.dayFull}>{day.name}</span>
                  </button>
                ))}
              </div>
              <small className={styles.helpText}>
                Selecciona los días en que se impartirá la clase
              </small>
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={createClassMutation.isPending || subjectsLoading}
            >
              {createClassMutation.isPending ? 'Creando Clase...' : 'Crear Clase'}
            </button>
          </div>
        </form>
      </div>

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