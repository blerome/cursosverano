import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faPlus, faUsers, faCalendar, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './AdminPage.module.css';

const AdminPage: React.FC = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: '/',
      mainWindowRedirectUri: '/'
    });
  };

  // Función para navegación corregida
  const handleNavigation = (path: string) => {
    navigate(path); // Navegación relativa al path actual
  };

  // Verifica si la ruta está activa
  const isActive = (path: string) => {
    return location.pathname === `/admin/${path}` || 
           (location.pathname === '/admin' && path === 'new-project');
  };

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Menú Admin</h2>
        </div>
        
        <nav className={styles.sidebarNav}>
          <button
            className={`${styles.navButton} ${isActive('new-project') ? styles.active : ''}`}
            onClick={() => handleNavigation('new-project')}
          >
            <FontAwesomeIcon icon={faPlus} className={styles.navIcon} />
            <span>Nuevo Proyecto</span>
          </button>
          
          <button
            className={`${styles.navButton} ${isActive('team-groups') ? styles.active : ''}`}
            onClick={() => handleNavigation('team-groups')}
          >
            <FontAwesomeIcon icon={faUsers} className={styles.navIcon} />
            <span>Grupos</span>
          </button>
          
          <button
            className={`${styles.navButton} ${isActive('calendar') ? styles.active : ''}`}
            onClick={() => handleNavigation('calendar')}
          >
            <FontAwesomeIcon icon={faCalendar} className={styles.navIcon} />
            <span>Calendario</span>
          </button>
          
          <button
            className={`${styles.navButton} ${isActive('user-profile') ? styles.active : ''}`}
            onClick={() => handleNavigation('user-profile')}
          >
            <FontAwesomeIcon icon={faUser} className={styles.navIcon} />
            <span>Perfil</span>
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>

      {/* Contenido principal - Aquí aparecerán las páginas */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPage;
