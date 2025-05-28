import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap,
  faUsers,
  faCalendarAlt,
  faBook,
  faUserGraduate,
  faIdCard,
  faExclamationTriangle,
  faSpinner,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useStudentAuth, useStudentClasses, useFormatters, usePopup } from '../../hooks';
import ErrorPopup from '../../components/UI/ErrorPopup';
import type { GetClassesStudent200Item } from '../../generated/model';
import styles from './MyCoursesPage.module.css';

const MyCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const { popup, hidePopup } = usePopup();
  const { getStatusInfo } = useFormatters();

  // Autenticación del estudiante
  const {
    userData,
    currentStudentData,
    isLoading: authLoading,
    hasProfileError,
    hasStudentError,
    isAuthenticated,
  } = useStudentAuth();

  // Clases del estudiante
  const {
    studentClasses,
    isLoading: classesLoading,
    error: classesError,
    refetch: refetchClasses,
    hasClasses,
    classesCount,
  } = useStudentClasses(currentStudentData?.id_student);

  const handleViewClassmates = (classId: number) => {
    navigate(`/my-courses/class/${classId}/students`);
  };

  // Estados de carga y error
  if (authLoading) {
    return (
      <div className={styles.loadingContainer}>
        <FontAwesomeIcon icon={faSpinner} className={styles.spinner} spin />
        <p>Cargando información del estudiante...</p>
      </div>
    );
  }

  if (hasProfileError) {
    return (
      <div className={styles.errorContainer}>
        <FontAwesomeIcon icon={faExclamationTriangle} className={styles.errorIcon} />
        <h2>Error de autenticación</h2>
        <p>No se pudo cargar la información del usuario.</p>
      </div>
    );
  }

  if (hasStudentError) {
    return (
      <div className={styles.errorContainer}>
        <FontAwesomeIcon icon={faExclamationTriangle} className={styles.errorIcon} />
        <h2>Acceso restringido</h2>
        <p>Debes estar registrado como estudiante para ver tus cursos.</p>
        <p>Ve a tu perfil y regístrate como estudiante primero.</p>
      </div>
    );
  }

  return (
    <div className={styles.myCoursesContainer}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>
            <FontAwesomeIcon icon={faGraduationCap} />
            Mis Cursos
          </h1>
          <p className={styles.pageSubtitle}>
            Gestiona tus clases inscritas y conecta con tus compañeros
          </p>
        </div>
        
        <div className={styles.studentInfo}>
          <div className={styles.studentCard}>
            <h3>Información del Estudiante</h3>
            <div className={styles.studentDetails}>
              <div className={styles.studentDetail}>
                <FontAwesomeIcon icon={faUserGraduate} />
                <span>{userData?.name} {userData?.paternal_surname} {userData?.maternal_surname}</span>
              </div>
              <div className={styles.studentDetail}>
                <FontAwesomeIcon icon={faIdCard} />
                <span>Control: {currentStudentData?.control_number}</span>
              </div>
              <div className={styles.studentDetail}>
                <FontAwesomeIcon icon={faGraduationCap} />
                <span>{currentStudentData?.career}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className={styles.mainContent}>
        {classesLoading ? (
          <div className={styles.loadingSection}>
            <FontAwesomeIcon icon={faSpinner} className={styles.spinner} spin />
            <p>Cargando tus cursos...</p>
          </div>
        ) : classesError ? (
          <div className={styles.errorSection}>
            <FontAwesomeIcon icon={faExclamationTriangle} className={styles.errorIcon} />
            <h3>Error al cargar cursos</h3>
            <p>No se pudieron cargar tus cursos. Intenta nuevamente.</p>
            <button onClick={() => refetchClasses()} className={styles.retryButton}>
              Reintentar
            </button>
          </div>
        ) : !hasClasses ? (
          <div className={styles.emptyState}>
            <FontAwesomeIcon icon={faBook} className={styles.emptyIcon} />
            <h3>No tienes cursos inscritos</h3>
            <p>Aún no te has inscrito a ningún curso. Explora los cursos disponibles y únete a uno.</p>
            <a href="/classes" className={styles.exploreButton}>
              <FontAwesomeIcon icon={faCalendarAlt} />
              Explorar Cursos
            </a>
          </div>
        ) : (
          <div className={styles.coursesSection}>
            <div className={styles.sectionHeader}>
              <h2>Tus Cursos Inscritos ({classesCount})</h2>
              <p>Haz clic en "Ver Compañeros" para conectar con tus compañeros de clase</p>
            </div>

            <div className={styles.coursesList}>
              {studentClasses.map((course: GetClassesStudent200Item) => {
                const statusInfo = getStatusInfo(course.status);

                return (
                  <div key={course.id_class} className={styles.courseCard}>
                    {/* Header del curso */}
                    <div className={styles.courseHeader}>
                      <div className={styles.courseInfo}>
                        <div className={styles.courseTitle}>
                          <h3>{course.Subjects?.name || 'Nombre no disponible'}</h3>
                          <span className={styles.courseCode}>
                            {course.Subjects?.clave || 'N/A'}
                          </span>
                        </div>
                        
                        <div className={styles.courseDetails}>
                          <div className={styles.courseDetail}>
                            <FontAwesomeIcon icon={faBook} />
                            <span>{course.Subjects?.credits || 'N/A'} créditos</span>
                          </div>
                          <div className={styles.courseDetail}>
                            <FontAwesomeIcon icon={faUsers} />
                            <span>{course.max_students} estudiantes máx.</span>
                          </div>
                          <div className={`${styles.statusBadge} ${styles[statusInfo.className]}`}>
                            <FontAwesomeIcon icon={statusInfo.icon} />
                            <span>{statusInfo.text}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Descripción del curso */}
                    {course.description && (
                      <div className={styles.courseDescription}>
                        <p>{course.description}</p>
                      </div>
                    )}

                    {/* Botón para ver compañeros */}
                    <div className={styles.courseActions}>
                      <button
                        onClick={() => handleViewClassmates(course.id_class)}
                        className={styles.viewClassmatesButton}
                      >
                        <FontAwesomeIcon icon={faUsers} />
                        Ver Compañeros de Clase
                        <FontAwesomeIcon icon={faArrowRight} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
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

export default MyCoursesPage; 