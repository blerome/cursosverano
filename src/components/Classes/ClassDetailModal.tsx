import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes,
  faUserPlus,
  faUsers,
  faClock,
  faCalendarAlt,
  faGraduationCap,
  faBook,
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle,
  faUser,
  faPhone,
  faIdCard,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import { ClassData } from '../../types/class.types';
import styles from './ClassDetailModal.module.css';

interface ClassDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: ClassData;
  onEnroll: (classId: number) => Promise<void>;
  studentData?: any;
}

const ClassDetailModal: React.FC<ClassDetailModalProps> = ({
  isOpen,
  onClose,
  classData,
  onEnroll,
  studentData,
}) => {
  const [isEnrolling, setIsEnrolling] = useState(false);

  if (!isOpen) return null;

  // Calcular disponibilidad
  const enrolled = classData.enrrolled || 0;
  const maxStudents = classData.max_students || 0;
  const available = enrolled < maxStudents;
  const percentage = maxStudents > 0 ? Math.round((enrolled / maxStudents) * 100) : 0;

  // Determinar estado visual
  const getStatusInfo = () => {
    switch (classData.status) {
      case 'active':
        return { text: 'Activa', icon: faCheckCircle, className: styles.statusActive };
      case 'pendiente':
        return { text: 'Pendiente', icon: faExclamationTriangle, className: styles.statusPending };
      case 'cancelled':
        return { text: 'Cancelada', icon: faExclamationTriangle, className: styles.statusCancelled };
      default:
        return { text: 'Desconocido', icon: faInfoCircle, className: styles.statusUnknown };
    }
  };

  const statusInfo = getStatusInfo();

  // Formatear horarios detallados
  const formatDetailedSchedules = () => {
    if (!classData.Schedules || classData.Schedules.length === 0) {
      return [];
    }

    return classData.Schedules.map(schedule => ({
      day: schedule.Days.name.charAt(0).toUpperCase() + schedule.Days.name.slice(1),
      startTime: schedule.start_time.slice(0, 5),
      endTime: schedule.end_time.slice(0, 5),
      duration: calculateDuration(schedule.start_time, schedule.end_time)
    }));
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0 && diffMinutes > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    } else if (diffHours > 0) {
      return `${diffHours}h`;
    } else {
      return `${diffMinutes}m`;
    }
  };

  const handleEnroll = async () => {
    if (!available || isEnrolling) return;
    
    setIsEnrolling(true);
    try {
      await onEnroll(classData.id_class);
      onClose(); // Cerrar modal después de inscripción exitosa
    } catch (error) {
      console.error('Error al inscribirse:', error);
    } finally {
      setIsEnrolling(false);
    }
  };

  const schedules = formatDetailedSchedules();

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header del modal */}
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <h2 className={styles.modalTitle}>
              {classData.Subjects?.name || 'Detalles de la Clase'}
            </h2>
            <div className={styles.classCode}>
              Clave: {classData.Subjects?.clave || 'N/A'}
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Contenido del modal */}
        <div className={styles.modalBody}>
          {/* Estado y disponibilidad */}
          <div className={styles.statusSection}>
            <div className={`${styles.statusBadge} ${statusInfo.className}`}>
              <FontAwesomeIcon icon={statusInfo.icon} />
              <span>{statusInfo.text}</span>
            </div>
            <div className={`${styles.availabilityBadge} ${available ? styles.available : styles.full}`}>
              {available ? 'Disponible' : 'Lleno'} ({percentage}%)
            </div>
          </div>

          {/* Información básica */}
          <div className={styles.infoSection}>
            <h3>Información General</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <FontAwesomeIcon icon={faBook} className={styles.infoIcon} />
                <div>
                  <strong>Créditos:</strong>
                  <span>{classData.Subjects?.credits || 'N/A'}</span>
                </div>
              </div>
              
              <div className={styles.infoItem}>
                <FontAwesomeIcon icon={faUsers} className={styles.infoIcon} />
                <div>
                  <strong>Estudiantes:</strong>
                  <span>{enrolled} de {maxStudents} inscritos</span>
                </div>
              </div>
              
              <div className={styles.infoItem}>
                <FontAwesomeIcon icon={faIdCard} className={styles.infoIcon} />
                <div>
                  <strong>ID de Clase:</strong>
                  <span>{classData.id_class}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Descripción */}
          {classData.description && (
            <div className={styles.descriptionSection}>
              <h3>Descripción</h3>
              <p className={styles.description}>{classData.description}</p>
            </div>
          )}

          {/* Horarios detallados */}
          <div className={styles.scheduleSection}>
            <h3>Horarios</h3>
            {schedules.length > 0 ? (
              <div className={styles.scheduleList}>
                {schedules.map((schedule, index) => (
                  <div key={index} className={styles.scheduleItem}>
                    <div className={styles.scheduleDay}>
                      <FontAwesomeIcon icon={faCalendarAlt} />
                      <strong>{schedule.day}</strong>
                    </div>
                    <div className={styles.scheduleTime}>
                      <FontAwesomeIcon icon={faClock} />
                      <span>{schedule.startTime} - {schedule.endTime}</span>
                      <small>({schedule.duration})</small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noSchedule}>No hay horarios definidos</p>
            )}
          </div>

          {/* Información de carreras */}
          {classData.Subjects?.Careers && classData.Subjects.Careers.length > 0 && (
            <div className={styles.careerSection}>
              <h3>Carreras Relacionadas</h3>
              <div className={styles.careerList}>
                {classData.Subjects.Careers.map((career) => (
                  <div key={career.id_career} className={styles.careerItem}>
                    <FontAwesomeIcon icon={faGraduationCap} />
                    <span>{career.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Información del jefe de grupo */}
          {classData.ResponsibleStudent && (
            <div className={styles.responsibleSection}>
              <h3>Jefe de Grupo</h3>
              <div className={styles.responsibleInfo}>
                <div className={styles.responsibleItem}>
                  <FontAwesomeIcon icon={faUser} />
                  <span>{classData.ResponsibleStudent.student_name || 'Nombre no disponible'}</span>
                </div>
                {classData.ResponsibleStudent.control_number && (
                  <div className={styles.responsibleItem}>
                    <FontAwesomeIcon icon={faIdCard} />
                    <span>Control: {classData.ResponsibleStudent.control_number}</span>
                  </div>
                )}
                {classData.ResponsibleStudent.student_phone && (
                  <div className={styles.responsibleItem}>
                    <FontAwesomeIcon icon={faPhone} />
                    <span>{classData.ResponsibleStudent.student_phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Advertencias o información importante */}
          {!available && (
            <div className={styles.warningSection}>
              <FontAwesomeIcon icon={faExclamationTriangle} />
              <p>Esta clase ha alcanzado su capacidad máxima de estudiantes.</p>
            </div>
          )}

          {classData.status !== 'pendiente' && (
            <div className={styles.warningSection}>
              <FontAwesomeIcon icon={faInfoCircle} />
              <p>Solo puedes inscribirte en clases con estado "Pendiente".</p>
            </div>
          )}
        </div>

        {/* Footer con botones de acción */}
        <div className={styles.modalFooter}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cancelar
          </button>
          
          <button
            className={`${styles.enrollButton} ${(!available || classData.status !== 'pendiente') ? styles.disabled : ''}`}
            onClick={handleEnroll}
            disabled={!available || isEnrolling || classData.status !== 'pendiente'}
          >
            <FontAwesomeIcon icon={faUserPlus} />
            {isEnrolling ? 'Inscribiendo...' : 'Confirmar Inscripción'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailModal; 