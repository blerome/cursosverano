import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserPlus, 
  faInfoCircle, 
  faUsers, 
  faClock, 
  faCalendarAlt,
  faGraduationCap,
  faBook,
  faCheckCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { ClassData } from '../../types/class.types';
import ClassDetailModal from './ClassDetailModal';
import styles from './ClassCard.module.css';

interface ClassCardProps {
  classData: ClassData;
  onEnroll: (classId: number) => Promise<void>;
  studentData?: any;
}

const ClassCard: React.FC<ClassCardProps> = ({
  classData,
  onEnroll,
  studentData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calcular disponibilidad usando los nombres correctos de la API
  const enrolled = classData.enrrolled || 0;
  const maxStudents = classData.max_students || 0;
  const available = enrolled < maxStudents;
  const percentage = maxStudents > 0 ? Math.abs(Math.round(((enrolled / maxStudents) * 100) -100)) : 0;

  // Determinar estado visual
  const getStatusInfo = () => {
    switch (classData.status) {
      case 'active':
        return { text: 'Activa', icon: faCheckCircle, className: styles.statusActive };
      case 'pendiente':
        return { text: 'Pendiente', icon: faExclamationTriangle, className: styles.statusPending };
      case 'cancelled':
        return { text: 'Cancelada', icon: faExclamationTriangle, className: styles.statusCancelled };
      case 'rechazado':
        return { text: 'Rechazada', icon: faExclamationTriangle, className: styles.statusRejected };
      default:
        return { text: 'Desconocido', icon: faInfoCircle, className: styles.statusUnknown };
    }
  };

  const statusInfo = getStatusInfo();

  // Formatear horarios agrupados por días
  const formatSchedules = () => {
    if (!classData.Schedules || classData.Schedules.length === 0) {
      return 'Horario no definido';
    }

    // Agrupar horarios por tiempo (asumiendo que pueden tener el mismo horario en diferentes días)
    const scheduleGroups = classData.Schedules.reduce((groups: any, schedule) => {
      const timeKey = `${schedule.start_time}-${schedule.end_time}`;
      if (!groups[timeKey]) {
        groups[timeKey] = {
          time: `${schedule.start_time.slice(0, 5)} - ${schedule.end_time.slice(0, 5)}`,
          days: []
        };
      }
      
      // Capitalizar primera letra del día
      const dayName = schedule.Days.name.charAt(0).toUpperCase() + schedule.Days.name.slice(1);
      groups[timeKey].days.push(dayName);
      return groups;
    }, {});

    // Ordenar días de la semana
    const dayOrder = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    
    return Object.values(scheduleGroups).map((group: any) => {
      const sortedDays = group.days.sort((a: string, b: string) => 
        dayOrder.indexOf(a) - dayOrder.indexOf(b)
      );
      return `${sortedDays.join(', ')}: ${group.time}`;
    }).join(' | ');
  };

  const handleEnrollClick = () => {
    setIsModalOpen(true);
  };

  const handleDetailsClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={styles.classCard}>
        {/* Header con imagen de fondo */}
        <div className={styles.cardHeader}>
          <div className={styles.backgroundImage}>
            <img
              src={classData.image || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"}
              alt={classData.Subjects?.name || 'Clase'}
            />
            <div className={styles.overlay}></div>
          </div>
          
          {/* Badge de disponibilidad */}
          <div className={`${styles.availabilityBadge} ${available ? styles.available : styles.full}`}>
            {available ? 'Disponible' : 'Lleno'} ({percentage}%)
          </div>

          {/* Badge de estado */}
          <div className={`${styles.statusBadge} ${statusInfo.className}`}>
            <FontAwesomeIcon icon={statusInfo.icon} />
            <span>{statusInfo.text}</span>
          </div>
        </div>

        {/* Contenido principal */}
        <div className={styles.cardContent}>
          <div className={styles.classInfo}>
            <h3 className={styles.className}>
              {classData.Subjects?.name || 'Nombre no disponible'}
            </h3>
            
            <div className={styles.classCode}>
              Clave: {classData.Subjects?.clave || 'N/A'}
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <FontAwesomeIcon icon={faBook} className={styles.infoIcon} />
                <span>Créditos: {classData.Subjects?.credits || 'N/A'}</span>
              </div>
              
              <div className={styles.infoItem}>
                <FontAwesomeIcon icon={faUsers} className={styles.infoIcon} />
                <span>{enrolled}/{maxStudents} estudiantes</span>
              </div>
              
              <div className={styles.infoItem}>
                <FontAwesomeIcon icon={faClock} className={styles.infoIcon} />
                <span>{formatSchedules()}</span>
              </div>
            </div>

            {/* Descripción si existe */}
            {classData.description && (
              <div className={styles.description}>
                <strong>Descripción:</strong>
                <p>{classData.description}</p>
              </div>
            )}

            {/* Información de carreras */}
            {classData.Subjects?.Careers && classData.Subjects.Careers.length > 0 && (
              <div className={styles.careerInfo}>
                <strong>Carreras:</strong>
                <div className={styles.careerTags}>
                  {classData.Subjects.Careers.map((career) => (
                    <span key={career.id_career} className={styles.careerTag}>
                      {career.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className={styles.cardActions}>
            <button
              className={`${styles.enrollButton} ${!available ? styles.disabled : ''}`}
              onClick={handleEnrollClick}
              disabled={classData.status !== 'pendiente'}
            >
              <FontAwesomeIcon icon={faUserPlus} />
              {available ? 'Ver Detalles e Inscribirse' : 'Ver Detalles'}
            </button>
            
            <button 
              className={styles.detailsButton}
              onClick={handleDetailsClick}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Ver Detalles
            </button>
          </div>
        </div>
      </div>

      {/* Modal de detalles */}
      <ClassDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        classData={classData}
        onEnroll={onEnroll}
        studentData={studentData}
      />
    </>
  );
};

export default ClassCard; 