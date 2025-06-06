import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBook, faGraduationCap, faArrowRight, faSpinner, faExclamationTriangle, faClock, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { useGetClasses } from '../../../generated/api/classes/classes';
import type { ClassResponseDto } from '../../../generated/model';
import styles from './StudentManagementSection.module.css';

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'pendiente':
      return { text: 'Pendiente', icon: faClock, style: styles.pending };
    case 'active':
      return { text: 'Activa', icon: faCheckCircle, style: styles.active };
    case 'aprobado':
      return { text: 'Aprobada', icon: faCheckCircle, style: styles.approved };
    case 'rechazado':
      return { text: 'Rechazada', icon: faTimesCircle, style: styles.rejected };
    case 'cancelled':
      return { text: 'Cancelada', icon: faTimesCircle, style: styles.cancelled };
    default:
      return { text: status, icon: faClock, style: styles.pending };
  }
};

const StudentManagementSection: React.FC = () => {
  const navigate = useNavigate();

  // Filtros y paginación
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'pendiente' | 'aprobado' | 'rechazado'>('all');
  const classesPerPage = 9;

  // Construir los parámetros para el backend
  const params: any = {
    page: currentPage,
    pageSize: classesPerPage,
  };
  if (filterStatus !== 'all') params.status = filterStatus;
  if (debouncedSearch.trim()) params.subjectName = debouncedSearch.trim();

  const { data: classesData, isLoading, error } = useGetClasses(params);
  const manageableClasses = classesData?.data?.data || [];
  const meta = classesData?.data?.meta || { total: 0, page: 1, pageSize: classesPerPage, totalPages: 1 };

  // Reiniciar página si cambia el total de páginas (por ejemplo, tras eliminar una clase)
  React.useEffect(() => {
    if (currentPage > meta.totalPages) {
      setCurrentPage(1);
    }
  }, [meta.totalPages]);

  // Debounce para el texto de búsqueda
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Opciones de estado para el filtro
  const statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'aprobado', label: 'Aprobada' },
    { value: 'rechazado', label: 'Rechazada' },
  ];

  const handleManageStudentsClick = (classDetails: ClassResponseDto) => {
    navigate(`/admin/class-students/${classDetails.id_class}`, {
      state: { classDetails },
    });
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        <p>Cargando clases para gestión...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <FontAwesomeIcon icon={faExclamationTriangle} size="2x" />
        <p>Error al cargar las clases.</p>
      </div>
    );
  }

  return (
    <div className={styles.sectionContainer}>
      <h2>Gestión de Estudiantes por Clase</h2>
      <p className={styles.sectionDescription}>
        Selecciona una clase para ver, inscribir o eliminar a sus estudiantes.
      </p>

      {/* Filtros */}
      <div className={styles.filtersContainer}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Buscar por nombre de materia..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <FontAwesomeIcon icon={faBook} className={styles.searchIcon} />
        </div>
        <div className={styles.filterBox}>
          <FontAwesomeIcon icon={faUsers} className={styles.filterIcon} />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
            className={styles.filterSelect}
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {manageableClasses.length > 0 ? (
        <>
          <div className={styles.classesGrid}>
            {manageableClasses.map((classItem: ClassResponseDto) => {
              const statusInfo = getStatusInfo(classItem.status);
              return (
                <div key={classItem.id_class} className={styles.classCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.headerTitle}>
                      <FontAwesomeIcon icon={faGraduationCap} className={styles.headerIcon} />
                      <h3>{classItem.Subjects?.name || 'Materia sin nombre'}</h3>
                    </div>
                    <span className={`${styles.statusBadge} ${statusInfo.style}`}>
                      <FontAwesomeIcon icon={statusInfo.icon} />
                      {statusInfo.text}
                    </span>
                  </div>
                  <div className={styles.cardBody}>
                    <p>
                      <FontAwesomeIcon icon={faBook} /> 
                      <strong>Clave:</strong> {classItem.Subjects?.clave || 'N/A'}
                    </p>
                    <p>
                      <FontAwesomeIcon icon={faUsers} />
                      <strong>Inscritos:</strong> {classItem.enrrolled} / {classItem.max_students}
                    </p>
                  </div>
                  <div className={styles.cardFooter}>
                    <button 
                      onClick={() => handleManageStudentsClick(classItem)}
                      className={styles.manageButton}
                    >
                      Gestionar Estudiantes
                      <FontAwesomeIcon icon={faArrowRight} className={styles.buttonIcon} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Controles de paginación */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ marginRight: 12, padding: '8px 16px', borderRadius: 8, border: '1px solid #b3d6f6', background: currentPage === 1 ? '#f0f0f0' : '#e3f2fd', color: '#1976d2', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              Anterior
            </button>
            <span style={{ alignSelf: 'center', fontWeight: 600, color: '#1976d2' }}>
              Página {meta.page} de {meta.totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === (meta.totalPages || 1)}
              style={{ marginLeft: 12, padding: '8px 16px', borderRadius: 8, border: '1px solid #b3d6f6', background: currentPage === (meta.totalPages || 1) ? '#f0f0f0' : '#e3f2fd', color: '#1976d2', cursor: currentPage === (meta.totalPages || 1) ? 'not-allowed' : 'pointer' }}
            >
              Siguiente
            </button>
          </div>
        </>
      ) : (
        <p className={styles.noClassesMessage}>
          No hay clases creadas en el sistema.
        </p>
      )}
    </div>
  );
};

export default StudentManagementSection; 