import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import styles from './ClassPagination.module.css';

interface ClassPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ClassPagination: React.FC<ClassPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.pagination}>
        {/* Botón anterior */}
        <button
          className={`${styles.pageButton} ${styles.navButton} ${
            currentPage === 1 ? styles.disabled : ''
          }`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
          <span>Anterior</span>
        </button>

        {/* Números de página */}
        <div className={styles.pageNumbers}>
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className={styles.dots}>...</span>
              ) : (
                <button
                  className={`${styles.pageButton} ${styles.numberButton} ${
                    currentPage === page ? styles.active : ''
                  }`}
                  onClick={() => onPageChange(page as number)}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Botón siguiente */}
        <button
          className={`${styles.pageButton} ${styles.navButton} ${
            currentPage === totalPages ? styles.disabled : ''
          }`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span>Siguiente</span>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      {/* Información de página */}
      <div className={styles.pageInfo}>
        Página {currentPage} de {totalPages}
      </div>
    </div>
  );
};

export default ClassPagination; 