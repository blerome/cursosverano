import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import styles from './TeacherManagementSection.module.css';

const TeacherManagementSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.cardsContainer}>
      <div className={styles.card} onClick={() => navigate('/admin/teacher-applications')}>
        <div className={styles.iconWrapper}>
          <FontAwesomeIcon icon={faClipboardList} size="2x" />
        </div>
        <h3>Revisar Solicitudes de Profesores</h3>
        <p>Consulta y gestiona las solicitudes de profesores que desean impartir clases.</p>
        <button className={styles.actionButton}>Ver Solicitudes</button>
      </div>
      <div className={styles.card} style={{ opacity: 0.6, cursor: 'not-allowed' }}>
        <div className={styles.iconWrapper}>
          <FontAwesomeIcon icon={faUserPlus} size="2x" />
        </div>
        <h3>Invitar Profesores</h3>
        <p>Próximamente podrás invitar profesores directamente desde el sistema.</p>
        <button className={styles.actionButton} disabled>Invitar Profesor</button>
      </div>
    </div>
  );
};

export default TeacherManagementSection; 