import React from 'react';
import styles from './CourseCard.module.css';
import { Course } from '../../types/courseTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

interface CourseCardProps {
  course: Course;
  onEnroll: (id: number) => void;
  onViewDetails: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEnroll,
  onViewDetails,
}) => {
  const available = course.enrolled < course.maxStudents!;
  const percentage = Math.round((course.enrolled / course.maxStudents!) * 100);

  return (
    <div className={styles.card}>
      <div className={styles.imgBx}>
        <img
          src={
            'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
          }
          alt={course.name}
        />
      </div>
      <div
        className={`${styles.badge} ${
          available ? styles.disponible : styles.lleno
        }`}
      >
        {available ? 'Disponible' : 'Lleno'} ({percentage}%)
      </div>
      <div className={styles.content}>
        <div className={styles.contentBx}>
          <h3>
            Grupo V{course.id.toString().padStart(2, '0')}
            <br />
            <span>{course.name}</span>
          </h3>
          <div className={styles.details}>
            <div>
              <strong>Clave</strong>
              <span>{course.clave}</span>
            </div>
            <div>
              <strong>Carrera/s</strong>
              <span>{course.careers}</span>
            </div>
            <div>
              <strong>Horario</strong>
              <span>
                {course.schedule[0].startTime} - {course.schedule[0].endTime}
              </span>
            </div>
            <div>
              <strong>Créditos</strong>
              <span>{course.credits}</span>
            </div>
          </div>
        </div>
        <ul className={styles.sci}>
          <li>
            <span>{course.status}</span>
          </li>
          <li>
            <button
              onClick={() => onEnroll(course.id)}
              className={styles.inscripcion}
            >
              <FontAwesomeIcon icon={faUserPlus} />
            </button>
          </li>
          <li>
            <button
              onClick={() => onViewDetails(course)}
              className={styles.detalles}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CourseCard;
