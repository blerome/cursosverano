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

  const { data: classesData, isLoading, error } = useGetClasses({
    page: 1,
    pageSize: 1000,
  });
  
  const manageableClasses = classesData?.data?.data || [];

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

      {manageableClasses.length > 0 ? (
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
      ) : (
        <p className={styles.noClassesMessage}>
          No hay clases creadas en el sistema.
        </p>
      )}
    </div>
  );
};

export default StudentManagementSection; 