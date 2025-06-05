import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faClipboardCheck, 
  faUsers, 
  faBuilding, 
  faChalkboardTeacher,
  faGraduationCap,
  faUserCheck,
  faPlus,
  faSignOutAlt,
  faSpinner,
  faClock,
  faCalendarAlt,
  faBook
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useGetClasses, usePostClasses } from '../../generated/api/classes/classes';
import { useGetSubjects } from '../../generated/api/subjects/subjects';
import { useGetCareers } from '../../generated/api/careers/careers';
import { useAllCareersAndSubjects } from '../../hooks/useAllCareersAndSubjects';
import { usePopup } from '../../hooks/usePopup';
import ClassApprovalSection from './components/ClassApprovalSection';
import { ClassResponseDto, CreateClassDto, CreateScheduleDto } from '../../generated/model';
import styles from './AdminDashboard.module.css';

type DashboardSection = 'overview' | 'class-approval' | 'student-management' | 'classroom-assignment' | 'teacher-management' | 'create-class';

interface ClassFormData {
  subjectId: number;
  clave: string;
  period: number;
  description: string;
  startTime: string;
  endTime: string;
  selectedDays: number[];
  responsibleStudentId?: string;
  responsibleControlNumber?: string;
  responsiblePhone?: string;
}

// Días de la semana con sus IDs
const DAYS_OF_WEEK = [
  { id: 1, name: 'Lunes', shortName: 'L' },
  { id: 2, name: 'Martes', shortName: 'M' },
  { id: 3, name: 'Miércoles', shortName: 'X' },
  { id: 4, name: 'Jueves', shortName: 'J' },
  { id: 5, name: 'Viernes', shortName: 'V' },
  { id: 6, name: 'Sábado', shortName: 'S' },
  { id: 7, name: 'Domingo', shortName: 'D' },
];

// Años académicos disponibles para cursos de verano
const ACADEMIC_YEARS = [2024, 2025, 2026, 2027, 2028];

const AdminDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Estado para la sección activa
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  
  // Estado para el filtro de periodo en el overview
  const [overviewPeriod, setOverviewPeriod] = useState<number>(0);
  
  // Estado para el formulario de crear clases
  const [formData, setFormData] = useState<ClassFormData>({
    subjectId: 0,
    clave: '',
    period: 0,
    description: '',
    startTime: '',
    endTime: '',
    selectedDays: [],
    responsibleStudentId: '',
    responsibleControlNumber: '',
    responsiblePhone: '',
  });

  // Estado para filtro de carrera
  const [selectedCareerId, setSelectedCareerId] = useState<number>(0);
  
  // Estado para búsqueda de materias por nombre
  const [searchSubjectName, setSearchSubjectName] = useState<string>('');
  // Estado para el valor actual del input de búsqueda de materia (actualización inmediata)
  const [currentSearchInput, setCurrentSearchInput] = useState<string>('');

  // Estado para el temporizador del debounce de búsqueda de materias
  const [searchDebounceTimeout, setSearchDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  // Hooks para crear clases
  const { popup, showError, showSuccess, hidePopup } = usePopup();
  const createClassMutation = usePostClasses();
  
  // Obtener carreras para el filtro
  const { data: careersResponse, isLoading: careersLoading } = useGetCareers({
    pageSize: 1000 // Obtener todas las carreras disponibles
  });
  const careersData = careersResponse?.data?.data || [];
  
  // Obtener materias filtradas por carrera seleccionada
  const subjectParams = {
    pageSize: 1000,
    ...(selectedCareerId > 0 && { careerId: selectedCareerId }),
    ...(searchSubjectName.trim() && { name: searchSubjectName.trim() })
  };
  
  const { data: subjectsResponse, isLoading: subjectsLoading } = useGetSubjects(subjectParams);
  const subjectsData = subjectsResponse?.data?.data || [];

  // Efecto para actualizar la clave automáticamente cuando se selecciona una materia
  useEffect(() => {
    if (formData.subjectId > 0) {
      const selectedSubject = subjectsData.find(
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

  // Efecto para limpiar timeouts al desmontar el componente
  useEffect(() => {
    return () => {
      if (searchDebounceTimeout) {
        clearTimeout(searchDebounceTimeout);
      }
    };
  }, [searchDebounceTimeout]);

  // Obtener datos para el overview
  const { data: classesData, isLoading: classesLoading } = useGetClasses({
    page: 1,
    pageSize: 100,
    ...(overviewPeriod > 0 && { period: overviewPeriod })
  });

  const classes: ClassResponseDto[] = classesData?.data?.data || [];

  // Calcular estadísticas
  const stats = {
    totalClasses: classes.length,
    pendingClasses: classes.filter((c: ClassResponseDto) => c.status === 'pendiente').length,
    activeClasses: classes.filter((c: ClassResponseDto) => c.status === 'active').length,
    enrolledStudents: classes.reduce((acc: number, c: ClassResponseDto) => acc + (c.enrrolled || 0), 0),
  };

  const handleLogout = () => {
    logout();
  };

  const handleCreateClass = () => {
    setActiveSection('create-class');
  };

  // Funciones para el formulario de crear clases
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'subjectId' || name === 'period' ? parseInt(value) : value,
    }));
  };

  const handleCareerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const careerId = parseInt(e.target.value);
    setSelectedCareerId(careerId);
    // Resetear la materia seleccionada y búsqueda cuando cambie la carrera
    setFormData(prev => ({
      ...prev,
      subjectId: 0,
      clave: '',
    }));
    setSearchSubjectName('');
  };

  const handleSearchSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchValue = e.target.value;
    setCurrentSearchInput(newSearchValue); // Actualiza el input inmediatamente
    
    if (searchDebounceTimeout) {
      clearTimeout(searchDebounceTimeout);
    }

    const newTimeout = setTimeout(() => {
      setSearchSubjectName(newSearchValue); // Esto dispara la búsqueda/filtrado
      // Resetear materia seleccionada cuando se busque
      setFormData(prev => ({
        ...prev,
        subjectId: 0,
        clave: '',
      }));
    }, 500); // Espera 500ms antes de actualizar

    setSearchDebounceTimeout(newTimeout);
  };

  const handleDayToggle = (dayId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(dayId)
        ? prev.selectedDays.filter(id => id !== dayId)
        : [...prev.selectedDays, dayId],
    }));
  };

  const validateClassForm = (): boolean => {
    if (subjectsData.length === 0) {
      showError(
        'Sin materias disponibles',
        'No se encontraron materias. Intenta ajustar los filtros de búsqueda.'
      );
      return false;
    }

    if (!formData.subjectId || !formData.clave || !formData.period || !formData.startTime || !formData.endTime) {
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

    if (formData.startTime >= formData.endTime) {
      showError(
        'Horario inválido',
        'La hora de inicio debe ser menor que la hora de fin.'
      );
      return false;
    }

    return true;
  };

  const handleSubmitClass = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateClassForm()) {
      return;
    }

    try {
      const schedule: CreateScheduleDto[] = formData.selectedDays.map(dayId => ({
        dayId,
        startTime: formData.startTime,
        endTime: formData.endTime,
      }));

      const classData: CreateClassDto = {
        subjectId: formData.subjectId,
        clave: formData.clave,
        period: formData.period,
        description: formData.description,
        schedule,
      };

      // Si se especificó un estudiante responsable
      if (formData.responsibleStudentId) {
        classData.responsibleStudent = {
          studentId: parseInt(formData.responsibleStudentId),
          controlNumber: formData.responsibleControlNumber || '',
          studentPhone: formData.responsiblePhone || '',
        };
      }

      await createClassMutation.mutateAsync({
        data: classData,
      });

      showSuccess(
        '¡Clase creada exitosamente!',
        'La clase ha sido creada y está disponible para inscripciones.'
      );

      // Limpiar el formulario
      setSelectedCareerId(0);
      setSearchSubjectName('');
      setFormData({
        subjectId: 0,
        clave: '',
        period: 0,
        description: '',
        startTime: '',
        endTime: '',
        selectedDays: [],
        responsibleStudentId: '',
        responsibleControlNumber: '',
        responsiblePhone: '',
      });

    } catch (error: any) {
      console.error('Error al crear clase:', error);
      const errorMessage = error?.response?.data?.message || 'Error inesperado. Por favor, intenta nuevamente.';
      showError('Error al crear clase', errorMessage);
    }
  };

  const menuItems = [
    {
      id: 'overview' as DashboardSection,
      title: 'Resumen General',
      icon: faChartLine,
      description: 'Vista general del sistema'
    },
    {
      id: 'class-approval' as DashboardSection,
      title: 'Aprobar Clases',
      icon: faClipboardCheck,
      description: 'Aprobar o rechazar clases creadas por estudiantes',
      badge: stats.pendingClasses
    },
    {
      id: 'student-management' as DashboardSection,
      title: 'Gestión de Estudiantes',
      icon: faUsers,
      description: 'Ver y gestionar estudiantes por clase'
    },
    {
      id: 'classroom-assignment' as DashboardSection,
      title: 'Asignar Salones',
      icon: faBuilding,
      description: 'Asignar aulas a las clases'
    },
    {
      id: 'teacher-management' as DashboardSection,
      title: 'Gestión de Profesores',
      icon: faChalkboardTeacher,
      description: 'Asignar profesores y aprobar solicitudes'
    },
    {
      id: 'create-class' as DashboardSection,
      title: 'Crear Clases',
      icon: faPlus,
      description: 'Agregar nuevas clases al sistema'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className={styles.overviewSection}>
            <h2>Resumen General del Sistema</h2>
            
            {/* Filtro por periodo */}
            <div className={styles.overviewFilters}>
              <div className={styles.filterGroup}>
                <label htmlFor="overviewPeriodFilter" className={styles.filterLabel}>
                  Filtrar por Año Académico:
                </label>
                <select
                  id="overviewPeriodFilter"
                  value={overviewPeriod}
                  onChange={(e) => setOverviewPeriod(parseInt(e.target.value))}
                  className={styles.filterSelect}
                >
                  <option value={0}>Todos los años</option>
                  {ACADEMIC_YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FontAwesomeIcon icon={faGraduationCap} />
                </div>
                <div className={styles.statContent}>
                  <h3>{stats.totalClasses}</h3>
                  <p>Total de Clases</p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FontAwesomeIcon icon={faClipboardCheck} />
                </div>
                <div className={styles.statContent}>
                  <h3>{stats.pendingClasses}</h3>
                  <p>Clases Pendientes</p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FontAwesomeIcon icon={faUserCheck} />
                </div>
                <div className={styles.statContent}>
                  <h3>{stats.activeClasses}</h3>
                  <p>Clases Activas</p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <div className={styles.statContent}>
                  <h3>{stats.enrolledStudents}</h3>
                  <p>Inscripciones Totales</p>
                </div>
              </div>
            </div>

            <div className={styles.quickActions}>
              <h3>Acciones Rápidas</h3>
              <div className={styles.actionButtons}>
                <button 
                  onClick={handleCreateClass}
                  className={styles.actionButton}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Crear Nueva Clase
                </button>

                <button 
                  onClick={() => setActiveSection('class-approval')}
                  className={styles.actionButton}
                  disabled={stats.pendingClasses === 0}
                >
                  <FontAwesomeIcon icon={faClipboardCheck} />
                  Revisar Clases Pendientes
                  {stats.pendingClasses > 0 && (
                    <span className={styles.badge}>{stats.pendingClasses}</span>
                  )}
                </button>

                <button 
                  onClick={() => setActiveSection('student-management')}
                  className={styles.actionButton}
                >
                  <FontAwesomeIcon icon={faUsers} />
                  Gestionar Estudiantes
                </button>

                <button 
                  onClick={() => setActiveSection('classroom-assignment')}
                  className={styles.actionButton}
                >
                  <FontAwesomeIcon icon={faBuilding} />
                  Asignar Salones
                </button>

                <button 
                  onClick={() => setActiveSection('teacher-management')}
                  className={styles.actionButton}
                >
                  <FontAwesomeIcon icon={faChalkboardTeacher} />
                  Gestionar Profesores
                </button>
              </div>
            </div>
          </div>
        );

      case 'class-approval':
        return <ClassApprovalSection />;

      case 'student-management':
        return (
          <div className={styles.sectionPlaceholder}>
            <h2>Gestión de Estudiantes</h2>
            <p>Funcionalidad en desarrollo...</p>
          </div>
        );

      case 'classroom-assignment':
        return (
          <div className={styles.sectionPlaceholder}>
            <h2>Asignar Salones</h2>
            <p>Funcionalidad en desarrollo...</p>
          </div>
        );

      case 'teacher-management':
        return (
          <div className={styles.sectionPlaceholder}>
            <h2>Gestión de Profesores</h2>
            <p>Funcionalidad en desarrollo...</p>
          </div>
        );

      case 'create-class':
        return (
          <div className={styles.createClassSection}>
            <div className={styles.createClassHeader}>
              <h2>
                <FontAwesomeIcon icon={faPlus} />
                Crear Nueva Clase
              </h2>
              <p>Agrega una nueva clase al sistema como administrador</p>
            </div>

            {subjectsLoading ? (
              <div className={styles.loadingContainer}>
                <FontAwesomeIcon icon={faSpinner} spin />
                <p>Cargando materias...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitClass} className={styles.createClassForm}>
                {/* Información del administrador */}
                <div className={styles.adminInfo}>
                  <h3 className={styles.sectionTitle}>
                    <FontAwesomeIcon icon={faGraduationCap} />
                    Información del Administrador
                  </h3>
                  <div className={styles.adminDetails}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Administrador:</span>
                      <span className={styles.detailValue}>{user?.name}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Rol:</span>
                      <span className={styles.detailValue}>
                        {(user as any)?.role === 'admin' ? 'Administrador' : 'Personal'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Filtro por carrera */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    <FontAwesomeIcon icon={faGraduationCap} />
                    Filtrar por Carrera
                  </h3>
                  <p className={styles.sectionDescription}>
                    Selecciona una carrera para filtrar las materias disponibles
                  </p>
                  <div className={styles.formGroup}>
                    <label htmlFor="careerId" className={styles.formLabel}>
                      Carrera
                    </label>
                    <select
                      id="careerId"
                      name="careerId"
                      value={selectedCareerId}
                      onChange={handleCareerChange}
                      className={styles.formSelect}
                      disabled={careersLoading}
                    >
                      <option value={0}>Todas las carreras</option>
                      {careersData.map((career: any) => (
                        <option key={career.id_career} value={career.id_career}>
                          {career.name}
                        </option>
                      ))}
                    </select>
                    {careersLoading && (
                      <div className={styles.loadingText}>
                        <FontAwesomeIcon icon={faSpinner} spin />
                        Cargando carreras...
                      </div>
                    )}
                  </div>
                </div>

                {/* Selección de materia */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    <FontAwesomeIcon icon={faBook} />
                    Información de la Materia
                  </h3>
                  {selectedCareerId > 0 && (
                    <p className={styles.sectionDescription}>
                      Materias disponibles para la carrera seleccionada ({subjectsData.length} encontradas)
                    </p>
                  )}
                  {selectedCareerId === 0 && subjectsData.length > 0 && (
                    <p className={styles.sectionDescription}>
                      Todas las materias disponibles ({subjectsData.length} encontradas)
                    </p>
                  )}
                  
                  {/* Campo de búsqueda opcional */}
                  <div className={styles.formGroup}>
                    <label htmlFor="searchSubject" className={styles.formLabel}>
                      Buscar materia por nombre (opcional)
                    </label>
                    <input
                      type="text"
                      id="searchSubject"
                      name="searchSubject"
                      value={currentSearchInput}
                      onChange={handleSearchSubjectChange}
                      className={styles.formInput}
                      placeholder="Escribe para buscar por nombre de materia..."
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="subjectId" className={styles.formLabel}>
                        Materia *
                      </label>
                      <select
                        id="subjectId"
                        name="subjectId"
                        value={formData.subjectId}
                        onChange={handleInputChange}
                        className={styles.formSelect}
                        required
                        disabled={subjectsLoading}
                      >
                        <option value={0}>
                          {subjectsLoading 
                            ? 'Cargando materias...' 
                            : subjectsData.length === 0
                              ? 'No se encontraron materias'
                              : 'Selecciona una materia'
                          }
                        </option>
                        {subjectsData.map((subject: any) => (
                          <option key={subject.id_subject} value={subject.id_subject}>
                            {subject.name} - {subject.clave}
                          </option>
                        ))}
                      </select>
                      {subjectsLoading && (
                        <div className={styles.loadingText}>
                          <FontAwesomeIcon icon={faSpinner} spin />
                          Cargando materias...
                        </div>
                      )}
                      {!subjectsLoading && subjectsData.length === 0 && (
                        <div className={styles.noDataText}>
                          {searchSubjectName.trim() 
                            ? `No se encontraron materias que contengan "${searchSubjectName}"`
                            : selectedCareerId > 0 
                              ? 'No hay materias disponibles para esta carrera'
                              : 'No hay materias disponibles'
                          }
                        </div>
                      )}
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="clave" className={styles.formLabel}>
                        Clave *
                      </label>
                      <input
                        type="text"
                        id="clave"
                        name="clave"
                        value={formData.clave}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        placeholder="Clave de la materia"
                        required
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="period" className={styles.formLabel}>
                        Año Académico *
                      </label>
                      <select
                        id="period"
                        name="period"
                        value={formData.period}
                        onChange={handleInputChange}
                        className={styles.formSelect}
                        required
                      >
                        <option value={0}>Selecciona un año</option>
                        {ACADEMIC_YEARS.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Horarios */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    <FontAwesomeIcon icon={faClock} />
                    Horarios
                  </h3>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="startTime" className={styles.formLabel}>
                        Hora de Inicio *
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
                        Hora de Fin *
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
                </div>

                {/* Días de la semana */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    Días de la Semana *
                  </h3>
                  <div className={styles.daysGrid}>
                    {DAYS_OF_WEEK.map(day => (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => handleDayToggle(day.id)}
                        className={`${styles.dayButton} ${
                          formData.selectedDays.includes(day.id) ? styles.dayButtonActive : ''
                        }`}
                      >
                        <span className={styles.dayShort}>{day.shortName}</span>
                        <span className={styles.dayName}>{day.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Estudiante responsable (opcional) */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    <FontAwesomeIcon icon={faUsers} />
                    Estudiante Responsable (Opcional)
                  </h3>
                  <p className={styles.sectionDescription}>
                    Puedes asignar un estudiante responsable de la clase
                  </p>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="responsibleStudentId" className={styles.formLabel}>
                        ID del Estudiante
                      </label>
                      <input
                        type="number"
                        id="responsibleStudentId"
                        name="responsibleStudentId"
                        value={formData.responsibleStudentId}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        placeholder="ID del estudiante"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="responsibleControlNumber" className={styles.formLabel}>
                        Número de Control
                      </label>
                      <input
                        type="text"
                        id="responsibleControlNumber"
                        name="responsibleControlNumber"
                        value={formData.responsibleControlNumber}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        placeholder="Número de control"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="responsiblePhone" className={styles.formLabel}>
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        id="responsiblePhone"
                        name="responsiblePhone"
                        value={formData.responsiblePhone}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        placeholder="Teléfono del estudiante"
                      />
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div className={styles.formSection}>
                  <div className={styles.formGroup}>
                    <label htmlFor="description" className={styles.formLabel}>
                      Descripción
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className={styles.formTextarea}
                      placeholder="Descripción opcional de la clase"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Botones */}
                <div className={styles.formActions}>
                  <button
                    type="button"
                    onClick={() => setActiveSection('overview')}
                    className={styles.cancelButton}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={createClassMutation.isPending}
                    className={styles.submitButton}
                  >
                    {createClassMutation.isPending ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin />
                        Creando...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faPlus} />
                        Crear Clase
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Popup de errores/éxito */}
            {popup.isOpen && (
              <div className={styles.popupOverlay} onClick={hidePopup}>
                <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
                  <h3>{popup.title}</h3>
                  <p>{popup.message}</p>
                  <button onClick={hidePopup} className={styles.popupButton}>
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (classesLoading) {
    return (
      <div className={styles.loadingContainer}>
        <FontAwesomeIcon icon={faChartLine} spin />
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.adminDashboard}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <h1>Panel de Administración</h1>
        <p>Gestiona clases, estudiantes, profesores y recursos del sistema</p>
      </div>

      <div className={styles.dashboardContent}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <nav className={styles.sidebarNav}>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`${styles.navItem} ${activeSection === item.id ? styles.active : ''}`}
              >
                <div className={styles.navIcon}>
                  <FontAwesomeIcon icon={item.icon} />
                  {item.badge && item.badge > 0 && (
                    <span className={styles.navBadge}>{item.badge}</span>
                  )}
                </div>
                <div className={styles.navContent}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </button>
            ))}
          </nav>
          
          <div className={styles.sidebarFooter}>
            <button 
              onClick={handleLogout}
              className={styles.logoutButton}
              title="Cerrar sesión y volver al inicio"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              <div>
                <h4>Cerrar Sesión</h4>
                <p>Salir del panel de administración</p>
              </div>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 