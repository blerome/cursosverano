import React, { useState } from 'react';
import styles from './CourseCard.module.css';
import { Course } from '../../types/courseTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import ModalInscripcion from '../modalInscripcion/ModalInscripcion';
import ActionButtons from './coursecard/BotonesCarta/ActionButtons';

// Interface que define las propiedades del componente
interface CourseCardProps {
  course: Course; // Objeto con la información del curso
  onEnroll: (id: number, studentData: { numeroControl: string; telefono: string }) => Promise<void>; // Modificada para aceptar datos del estudiante
  onViewDetails: (course: Course) => void; // Función para ver detalles
}

// Componente funcional principal
const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEnroll,
  onViewDetails,
}) => {
  // Calcula si hay cupos disponibles
  const available = course.enrolled < course.maxStudents!;
  // Calcula el porcentaje de ocupación
  const percentage = Math.round((course.enrolled / course.maxStudents!) * 100);
  // Estado para controlar la visibilidad del modal
  const [showModal, setShowModal] = useState(false);

  // Función para manejar el clic en inscribirse
  const handleEnrollClick = () => {
    if (available) {
      setShowModal(true);
    }
  };

  // Función para manejar la inscripción desde el modal
  const handleEnrollSubmit = async (studentData: { numeroControl: string; telefono: string }) => {
    try {
      await onEnroll(course.id, studentData);
      setShowModal(false);
    } catch (error) {
      console.error('Error en la inscripción:', error);
    }
  };

  return (
    <>
      <div className={styles.card}>
        {/* Contenedor de la imagen de fondo */}
        <div className={styles.imgBx}>
          <img
            src={'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'}
            alt={course.name}
          />
        </div>

        {/* Badge que muestra disponibilidad */}
        <div className={`${styles.badge} ${available ? styles.disponible : styles.lleno}`}>
          {available ? 'Disponible' : 'Lleno'} ({percentage}%)
        </div>

        {/* Contenedor del contenido principal */}
        <div className={styles.content}>
          <div className={styles.contentBx}>
            {/* Encabezado con grupo y nombre del curso */}
            <h3>
              Grupo V{course.id.toString().padStart(2, '0')}
              <br />
              <span>{course.name}</span>
            </h3>
            
            {/* Sección de información básica reorganizada */}
            <div className={styles.basicInfo}>
              <div>
                {course.clave} {/* Clave del curso (sin etiqueta strong) */}
              </div>
              <div>
                <strong>Horario:</strong> {course.schedule[0].startTime} - {course.schedule[0].endTime}
              </div>
              <div>
                <strong>Créditos:</strong> {course.credits}
              </div>
            </div>
            
            {/* Sección de carrera separada */}
            <div className={styles.careerInfo}>
              <strong>Carrera/s:</strong> {course.careers}
            </div>
            
            {/* Estado del curso en sección aparte */}
            <div className={styles.statusInfo}>
              <span>{course.status}</span>
            </div>
          </div>
          <ActionButtons
            available={available}
            onEnrollClick={handleEnrollClick}
            onViewDetails={() => onViewDetails(course)}
          />
        
        </div>
      </div>

      {/* Modal de inscripción (nuevo) */}
      {showModal && (
        <ModalInscripcion
          cursoId={course.id}
          nombreCurso={course.name}
          onClose={() => setShowModal(false)}
          onInscribir={handleEnrollSubmit}
        />
      )}
    </>
  );
};

export default CourseCard;