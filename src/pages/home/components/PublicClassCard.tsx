import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faClock,
  faCalendarAlt,
  faGraduationCap,
  faBook,
  faCheckCircle,
  faExclamationTriangle,
  faChalkboardTeacher
} from '@fortawesome/free-solid-svg-icons';
import type { ClassResponseDto } from '../../../generated/model';
import styles from './PublicClassCard.module.css';

interface PublicClassCardProps {
  classData: ClassResponseDto;
}

const PublicClassCard: React.FC<PublicClassCardProps> = ({ classData }) => {
  const navigate = useNavigate();

  const enrolled = classData.enrrolled || 0;
  const maxStudents = classData.max_students || 0;
  const available = enrolled < maxStudents;
  const percentage = maxStudents > 0 ? Math.abs(Math.round(((enrolled / maxStudents) * 100) - 100)) : 0;

  // Estado visual
  const getStatusInfo = () => {
    switch (classData.status) {
      case 'pendiente':
        return { text: 'Pendiente', icon: faExclamationTriangle, className: styles.statusPending };
      case 'aprobado':
        return { text: 'Aprobada', icon: faCheckCircle, className: styles.statusApproved };
      case 'rechazado':
        return { text: 'Rechazada', icon: faExclamationTriangle, className: styles.statusRejected };
      default:
        return { text: 'Desconocido', icon: faExclamationTriangle, className: styles.statusUnknown };
    }
  };
  const statusInfo = getStatusInfo();

  // Formatear horarios agrupados por días
  const formatSchedules = () => {
    if (!classData.Schedules || classData.Schedules.length === 0) {
      return 'Horario no definido';
    }
    const scheduleGroups = classData.Schedules.reduce((groups: any, schedule) => {
      const timeKey = `${schedule.start_time}-${schedule.end_time}`;
      if (!groups[timeKey]) {
        groups[timeKey] = {
          time: `${schedule.start_time.slice(0, 5)} - ${schedule.end_time.slice(0, 5)}`,
          days: []
        };
      }
      const dayName = schedule.Days.name.charAt(0).toUpperCase() + schedule.Days.name.slice(1);
      groups[timeKey].days.push(dayName);
      return groups;
    }, {});
    const dayOrder = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return Object.values(scheduleGroups).map((group: any) => {
      const sortedDays = group.days.sort((a: string, b: string) =>
        dayOrder.indexOf(a) - dayOrder.indexOf(b)
      );
      return `${sortedDays.join(', ')}: ${group.time}`;
    }).join(' | ');
  };

  const handleRequestToTeach = () => {
    navigate(`/solicitud-impartir-clase/${classData.id_class}`);
  };

  return (
    <div className={styles.classCard}>
      <div className={styles.cardHeader}>
        <div className={styles.backgroundImage}>
          <img
            src={classData.image || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"}
            alt={classData.Subjects?.name || 'Clase'}
          />
          <div className={styles.overlay}></div>
        </div>
        <div className={`${styles.availabilityBadge} ${available ? styles.available : styles.full}`}>
          {available ? 'Disponible' : 'Lleno'} ({percentage}%)
        </div>
        <div className={`${styles.statusBadge} ${statusInfo.className}`}>
          <FontAwesomeIcon icon={statusInfo.icon} />
          <span>{statusInfo.text}</span>
        </div>
      </div>
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
          {classData.description && (
            <div className={styles.description}>
              <strong>Descripción:</strong>
              <p>{classData.description}</p>
            </div>
          )}
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
        <div className={styles.cardActions}>
          <button
            className={styles.teachButton}
            onClick={handleRequestToTeach}
          >
            <FontAwesomeIcon icon={faChalkboardTeacher} />
            Quiero impartir esta clase
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicClassCard; 