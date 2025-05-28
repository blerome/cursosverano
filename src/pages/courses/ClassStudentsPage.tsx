import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers,
  faArrowLeft,
  faUserGraduate,
  faCrown,
  faPhone,
  faIdCard,
  faGraduationCap,
  faExclamationTriangle,
  faInfoCircle,
  faSpinner,
  faSearch,
  faFilter,
  faEnvelope,
  faSortAlphaDown,
  faSortAlphaUp
} from '@fortawesome/free-solid-svg-icons';
import { useClassStudents, useStudentFilters, useFormatters, usePopup } from '../../hooks';
import ErrorPopup from '../../components/UI/ErrorPopup';
import type { GetStudentByClassResponseDto } from '../../generated/model';
import styles from './ClassStudentsPage.module.css';

const ClassStudentsPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { popup, hidePopup } = usePopup();
  const { formatPhoneNumber } = useFormatters();

  const classIdNumber = parseInt(classId || '0', 10);

  // Obtener estudiantes de la clase
  const {
    allStudents,
    isLoading: studentsLoading,
    error: studentsError,
    refetch: refetchStudents,
    totalStudents,
    leadersCount,
  } = useClassStudents(classIdNumber);

  // Filtros y búsqueda
  const {
    searchTerm,
    setSearchTerm,
    sortBy,
    sortOrder,
    showLeadersOnly,
    setShowLeadersOnly,
    filteredStudents,
    handleSort,
    filteredCount,
  } = useStudentFilters(allStudents);

  if (studentsLoading) {
    return (
      <div className={styles.loadingContainer}>
        <FontAwesomeIcon icon={faSpinner} className={styles.spinner} spin />
        <p>Cargando información de la clase...</p>
      </div>
    );
  }

  if (studentsError) {
    return (
      <div className={styles.errorContainer}>
        <FontAwesomeIcon icon={faExclamationTriangle} className={styles.errorIcon} />
        <h2>Error al cargar información</h2>
        <p>No se pudo cargar la información de los estudiantes.</p>
        <button onClick={() => refetchStudents()} className={styles.retryButton}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.classStudentsContainer}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerTop}>
            <button 
              onClick={() => navigate('/my-courses')} 
              className={styles.backButton}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Volver a Mis Cursos
            </button>
          </div>
          
          <div className={styles.classInfo}>
            <h1 className={styles.pageTitle}>
              <FontAwesomeIcon icon={faUsers} />
              Estudiantes de la Clase
            </h1>
            
            <div className={styles.classDetails}>
              <h2 className={styles.className}>Clase #{classId}</h2>
              <div className={styles.classMetadata}>
                <span className={styles.classCapacity}>
                  {totalStudents} estudiantes inscritos
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className={styles.statsSection}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{totalStudents}</div>
            <div className={styles.statLabel}>Total Estudiantes</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{leadersCount}</div>
            <div className={styles.statLabel}>Jefes de Grupo</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{filteredCount}</div>
            <div className={styles.statLabel}>Mostrando</div>
          </div>
        </div>
      </div>

      {/* Controles de búsqueda y filtros */}
      <div className={styles.controlsSection}>
        <div className={styles.searchContainer}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nombre, número de control o carrera..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filtersContainer}>
          <button
            onClick={() => setShowLeadersOnly(!showLeadersOnly)}
            className={`${styles.filterButton} ${showLeadersOnly ? styles.active : ''}`}
          >
            <FontAwesomeIcon icon={faFilter} />
            Solo Jefes de Grupo
          </button>

          <div className={styles.sortButtons}>
            <button
              onClick={() => handleSort('name')}
              className={`${styles.sortButton} ${sortBy === 'name' ? styles.active : ''}`}
            >
              <FontAwesomeIcon icon={sortBy === 'name' && sortOrder === 'desc' ? faSortAlphaUp : faSortAlphaDown} />
              Nombre
            </button>
            <button
              onClick={() => handleSort('control')}
              className={`${styles.sortButton} ${sortBy === 'control' ? styles.active : ''}`}
            >
              <FontAwesomeIcon icon={sortBy === 'control' && sortOrder === 'desc' ? faSortAlphaUp : faSortAlphaDown} />
              Control
            </button>
            <button
              onClick={() => handleSort('career')}
              className={`${styles.sortButton} ${sortBy === 'career' ? styles.active : ''}`}
            >
              <FontAwesomeIcon icon={sortBy === 'career' && sortOrder === 'desc' ? faSortAlphaUp : faSortAlphaDown} />
              Carrera
            </button>
          </div>
        </div>
      </div>

      {/* Lista de estudiantes */}
      <div className={styles.studentsSection}>
        {filteredCount === 0 ? (
          <div className={styles.emptyState}>
            <FontAwesomeIcon icon={faInfoCircle} className={styles.emptyIcon} />
            <h3>No se encontraron estudiantes</h3>
            <p>
              {searchTerm || showLeadersOnly 
                ? 'Intenta ajustar los filtros de búsqueda.'
                : 'Aún no hay estudiantes inscritos en esta clase.'
              }
            </p>
          </div>
        ) : (
          <div className={styles.studentsGrid}>
            {filteredStudents.map((studentClass: GetStudentByClassResponseDto) => (
              <div key={studentClass.id_student_class} className={styles.studentCard}>
                <div className={styles.studentHeader}>
                  <div className={styles.studentAvatar}>
                    <FontAwesomeIcon 
                      icon={studentClass.group_leader ? faCrown : faUserGraduate} 
                      className={studentClass.group_leader ? styles.leaderIcon : styles.studentIcon}
                    />
                  </div>
                  
                  <div className={styles.studentName}>
                    <h3>
                      {studentClass.student.user.name} {studentClass.student.user.paternal_surname}
                    </h3>
                    {studentClass.group_leader && (
                      <span className={styles.leaderBadge}>
                        <FontAwesomeIcon icon={faCrown} />
                        Jefe de Grupo
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.studentDetails}>
                  <div className={styles.studentDetail}>
                    <FontAwesomeIcon icon={faIdCard} className={styles.detailIcon} />
                    <div className={styles.detailContent}>
                      <span className={styles.detailLabel}>Número de Control</span>
                      <span className={styles.detailValue}>{studentClass.student.control_number}</span>
                    </div>
                  </div>

                  <div className={styles.studentDetail}>
                    <FontAwesomeIcon icon={faGraduationCap} className={styles.detailIcon} />
                    <div className={styles.detailContent}>
                      <span className={styles.detailLabel}>Carrera</span>
                      <span className={styles.detailValue}>
                        {studentClass.student.career?.name || 'No disponible'}
                      </span>
                    </div>
                  </div>

                  <div className={styles.studentDetail}>
                    <FontAwesomeIcon icon={faPhone} className={styles.detailIcon} />
                    <div className={styles.detailContent}>
                      <span className={styles.detailLabel}>Teléfono</span>
                      <span className={styles.detailValue}>
                        {formatPhoneNumber(studentClass.student.phone)}
                      </span>
                    </div>
                  </div>

                  <div className={styles.studentDetail}>
                    <FontAwesomeIcon icon={faEnvelope} className={styles.detailIcon} />
                    <div className={styles.detailContent}>
                      <span className={styles.detailLabel}>Email</span>
                      <span className={styles.detailValue}>
                        {studentClass.student.user.email || 'No disponible'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acciones rápidas */}
                <div className={styles.studentActions}>
                  {studentClass.student.phone && (
                    <a 
                      href={`tel:${studentClass.student.phone}`}
                      className={styles.actionButton}
                      title="Llamar"
                    >
                      <FontAwesomeIcon icon={faPhone} />
                    </a>
                  )}
                  {studentClass.student.user.email && (
                    <a 
                      href={`mailto:${studentClass.student.user.email}`}
                      className={styles.actionButton}
                      title="Enviar email"
                    >
                      <FontAwesomeIcon icon={faEnvelope} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ErrorPopup
        isOpen={popup.isOpen}
        onClose={hidePopup}
        title={popup.title}
        message={popup.message}
        type={popup.type}
      />
    </div>
  );
};

export default ClassStudentsPage; 