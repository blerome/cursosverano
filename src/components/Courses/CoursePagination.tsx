import React from 'react';
import styles from './CoursePagination.module.css';
import Button from '../UI/Button';

interface CoursePaginationProps {
  coursesPerPage: number;
  totalCourses: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const CoursePagination: React.FC<CoursePaginationProps> = ({
  coursesPerPage,
  totalCourses,
  currentPage,
  setCurrentPage
}) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalCourses / coursesPerPage);

  if (totalPages <= 1) return null;

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={styles.paginacion}>
      <Button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={currentPage === 1 ? styles.disabled : ''}
      >
        <i className="fas fa-chevron-left"></i>
      </Button>

      {pageNumbers.map(number => (
        <Button
          key={number}
          onClick={() => setCurrentPage(number)}
          variant={currentPage === number ? 'primary' : 'secondary'}
        >
          {number}
        </Button>
      ))}

      <Button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={currentPage === totalPages ? styles.disabled : ''}
      >
        <i className="fas fa-chevron-right"></i>
      </Button>
    </div>
  );
};

export default CoursePagination;