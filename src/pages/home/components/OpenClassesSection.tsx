import React, { useState } from 'react';
import { useGetClasses } from '../../../generated/api/classes/classes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBook, faGraduationCap, faSpinner, faExclamationTriangle, faClock, faCheckCircle, faTimesCircle, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import type { ClassResponseDto } from '../../../generated/model';
import styles from './OpenClassesSection.module.css';
import PublicClassCard from './PublicClassCard';

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'pendiente':
      return { text: 'Pendiente', icon: faClock, style: styles.pending };
    case 'active':
      return { text: 'Abierta', icon: faCheckCircle, style: styles.active };
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

const PAGE_SIZE = 3;

const OpenClassesSection: React.FC = () => {
  const [page, setPage] = useState(1);

  // Enviar status como string separado por comas
  const { data: classesData, isLoading, error } = useGetClasses({
    page,
    pageSize: PAGE_SIZE,
    status: 'pendiente,aprobado',
  });

  const openClasses = classesData?.data?.data || [];
  const meta = classesData?.data?.meta;
  const totalPages = meta?.totalPages || 1;

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <section className={styles.sectionContainer}>
      <h2 className={styles.sectionTitle}>Clases Abiertas para Profesores</h2>
      <p className={styles.sectionDescription}>
        Estas son las clases abiertas actualmente. Si te interesa impartir alguna, contacta a la coordinación o abre una solicitud.
      </p>

      {isLoading && (
        <div className={styles.loadingContainer}>
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
          <p>Cargando clases abiertas...</p>
        </div>
      )}
      {Boolean(error) && (
        <div className={styles.errorContainer}>
          <FontAwesomeIcon icon={faExclamationTriangle} size="2x" />
          <p>Error al cargar las clases abiertas.</p>
        </div>
      )}
      {!isLoading && !error && openClasses.length === 0 && (
        <div className={styles.noClassesMessage}>
          <p>No hay clases abiertas en este momento.</p>
        </div>
      )}
      {!isLoading && !error && openClasses.length > 0 && (
        <>
          <div className={styles.classesGrid}>
            {openClasses.map((classItem: ClassResponseDto) => (
              <PublicClassCard key={classItem.id_class} classData={classItem} />
            ))}
          </div>
          <div className={styles.paginationContainer}>
            <button
              className={styles.paginationButton}
              onClick={handlePrev}
              disabled={page === 1}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
              Anterior
            </button>
            <span className={styles.paginationInfo}>
              Página {page} de {totalPages}
            </span>
            <button
              className={styles.paginationButton}
              onClick={handleNext}
              disabled={page === totalPages}
            >
              Siguiente
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default OpenClassesSection; 