import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faPlus, faUsers, faCalendar, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './AdminPage.module.css';

interface AdminPageProps {
  children?: React.ReactNode;
}

const AdminPage: React.FC<AdminPageProps> = ({ children }) => {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: '/',
      mainWindowRedirectUri: '/'
    });
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === `/admin/${path}` || 
           (location.pathname === '/admin' && path === 'new-project');
  };

  return (
    <div className={styles.adminContainer}>
      {/* Efectos de fondo premium */}
      <div className={styles.premiumEffects} id="premiumEffects">
        {/* Las líneas dinámicas, ondas y puntos se generarán con JavaScript */}
      </div>

      {/* Sidebar con nuevo estilo */}
      <ul className={styles.menu}>
        <button
          className={`${styles.menuItem} ${isActive('new-project') ? styles.active : ''}`}
          onClick={() => handleNavigation('new-project')}
        >
          <FontAwesomeIcon icon={faPlus} className={styles.menuIcon} />
          <span className={styles.menuText}>Crear Curso</span>
        </button>
        
        <button
          className={`${styles.menuItem} ${isActive('team-groups') ? styles.active : ''}`}
          onClick={() => handleNavigation('team-groups')}
        >
          <FontAwesomeIcon icon={faUsers} className={styles.menuIcon} />
          <span className={styles.menuText}>Grupos</span>
        </button>
        
        <button
          className={`${styles.menuItem} ${isActive('calendar') ? styles.active : ''}`}
          onClick={() => handleNavigation('calendar')}
        >
          <FontAwesomeIcon icon={faCalendar} className={styles.menuIcon} />
          <span className={styles.menuText}>Calendario</span>
        </button>
        
        <button
          className={`${styles.menuItem} ${isActive('user-profile') ? styles.active : ''}`}
          onClick={() => handleNavigation('user-profile')}
        >
          <FontAwesomeIcon icon={faUser} className={styles.menuIcon} />
          <span className={styles.menuText}>Perfil</span>
        </button>

        <button 
          onClick={handleLogout} 
          className={`${styles.menuItem} ${styles.logoutItem}`}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className={styles.menuIcon} />
          <span className={styles.menuText}>Cerrar Sesión</span>
        </button>
      </ul>

      {/* Contenido principal */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default AdminPage;
