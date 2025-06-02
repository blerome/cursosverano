import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faShieldAlt, 
  faChalkboardTeacher,
  faSignOutAlt,
  faUserTie,
  faCog
} from '@fortawesome/free-solid-svg-icons';
import styles from './StaffProfile.module.css';

const StaffProfile: React.FC = () => {
  const { user, logout, userType } = useAuth();

  if (userType !== 'staff' || !user || user.type !== 'staff') {
    return (
      <div className={styles.errorContainer}>
        <h2>Acceso denegado</h2>
        <p>No tienes permisos para acceder a esta página.</p>
      </div>
    );
  }

  const getRoleIcon = () => {
    return user.role === 'admin' ? faShieldAlt : faChalkboardTeacher;
  };

  const getRoleLabel = () => {
    return user.role === 'admin' ? 'Administrador' : 'Maestro';
  };

  const getRoleColor = () => {
    return user.role === 'admin' ? '#e74c3c' : '#3498db';
  };

  return (
    <div className={styles.staffProfileContainer}>
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            <FontAwesomeIcon icon={faUserTie} />
          </div>
          <h1 className={styles.profileTitle}>Perfil de Personal</h1>
          <div 
            className={styles.roleBadge}
            style={{ background: getRoleColor() }}
          >
            <FontAwesomeIcon icon={getRoleIcon()} />
            <span>{getRoleLabel()}</span>
          </div>
        </div>

        <div className={styles.profileInfo}>
          <div className={styles.infoSection}>
            <h3 className={styles.sectionTitle}>Información Personal</h3>

            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>
                <FontAwesomeIcon icon={faUser} />
                <span>Nombre Completo:</span>
              </div>
              <span className={styles.infoValue}>
                {user.name || 'No disponible'}
              </span>
            </div>

            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>
                <FontAwesomeIcon icon={faEnvelope} />
                <span>Email Institucional:</span>
              </div>
              <span className={styles.infoValue}>
                {user.email || 'No disponible'}
              </span>
            </div>

            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>
                <FontAwesomeIcon icon={getRoleIcon()} />
                <span>Rol:</span>
              </div>
              <span className={styles.infoValue}>
                {getRoleLabel()}
              </span>
            </div>

            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>
                <FontAwesomeIcon icon={faCog} />
                <span>Estado:</span>
              </div>
              <span className={`${styles.infoValue} ${user.isActive ? styles.active : styles.inactive}`}>
                {user.isActive ? '✅ Activo' : '❌ Inactivo'}
              </span>
            </div>
          </div>

          {/* Acciones disponibles */}
          <div className={styles.actionsSection}>
            <h3 className={styles.sectionTitle}>Acciones Disponibles</h3>
            
            <div className={styles.actionButtons}>
              {user.role === 'admin' && (
                <button 
                  className={styles.actionButton}
                  onClick={() => window.location.href = '/admin/dashboard'}
                >
                  <FontAwesomeIcon icon={faShieldAlt} />
                  <span>Panel de Administración</span>
                </button>
              )}

              <button 
                className={styles.actionButton}
                onClick={() => {
                  // Aquí podrías navegar a una página de configuración
                  alert('Funcionalidad en desarrollo');
                }}
              >
                <FontAwesomeIcon icon={faCog} />
                <span>Configuración</span>
              </button>
            </div>
          </div>

          {/* Información del sistema */}
          <div className={styles.systemInfo}>
            <h3 className={styles.sectionTitle}>Información del Sistema</h3>
            <p className={styles.systemText}>
              Como miembro del personal de IT Cancún, tienes acceso a herramientas especializadas 
              para la gestión del sistema de cursos de verano.
            </p>
            
            {user.role === 'admin' && (
              <p className={styles.adminNote}>
                <strong>Nota:</strong> Como administrador, tienes acceso completo al sistema 
                incluyendo gestión de usuarios, aprobación de cursos y configuración general.
              </p>
            )}
          </div>
        </div>

        {/* Botón de logout */}
        <div className={styles.logoutSection}>
          <button 
            onClick={logout}
            className={styles.logoutButton}
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile; 