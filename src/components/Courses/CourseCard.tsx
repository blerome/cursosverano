import React from 'react';
import styles from './CourseCard.module.css';
import { Course } from '../../types/courseTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
interface CourseCardProps {
  course: Course;
  onEnroll: (id: number) => void;
  onViewDetails: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll, onViewDetails }) => {
  const available = course.inscritos < course.cupo;
  const percentage = Math.round((course.inscritos / course.cupo) * 100);

  return (
    <div className={styles.card}>
      <div className={styles.imgBx}>
        <img src={course.imagen} alt={course.nombre} />
      </div>
      <div className={`${styles.badge} ${available ? styles.disponible : styles.lleno}`}>
        {available ? 'Disponible' : 'Lleno'} ({percentage}%)
      </div>
      <div className={styles.content}>
        <div className={styles.contentBx}>
          <h3>Grupo V{course.id.toString().padStart(2, '0')}<br /><span>{course.nombre}</span></h3>
          <div className={styles.details}>
            <div>
              <strong>Clave</strong>
              <span>{course.clave}</span>
            </div>
            <div>
              <strong>Horario</strong>
              <span>{course.horario}</span>
            </div>
            <div>
              <strong>Créditos</strong>
              <span>{course.creditos}</span>
            </div>
          </div>
        </div>
        <ul className={styles.sci}>
          <li>
            <a href={course.whatsapp} className={styles.whatsapp} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>
          </li>
          <li>
            <button onClick={() => onEnroll(course.id)} className={styles.inscripcion}>
              <FontAwesomeIcon icon={faUserPlus} />
            </button>
          </li>
          <li>
            <button onClick={() => onViewDetails(course)} className={styles.detalles}>
              <FontAwesomeIcon icon={faInfoCircle} />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CourseCard;