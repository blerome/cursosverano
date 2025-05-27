import React, { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSignOutAlt, 
  faPlus, 
  faUsers, 
  faCalendar, 
  faUser, 
  faHome,
  faGraduationCap,
  faBookOpen
} from '@fortawesome/free-solid-svg-icons';
import BackgroundEffects from './BackgroundEffects';
import HeaderBanners from '../../core/HeaderBanner';
import styles from './PrivateLayout.module.css';

interface PrivateLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

const PrivateLayout: React.FC<PrivateLayoutProps> = ({ 
  children, 
  showHeader = true 
}) => {
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
    return location.pathname === path;
  };

  return (
    <div className={styles.privateContainer}>
      {/* {showHeader && <HeaderBanners />}
      <BackgroundEffects /> */}
      
      {/* Barra de navegación horizontal para usuarios privados */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.navBrand}>
            <h2>Portal Estudiante</h2>
          </div>
          
          <ul className={styles.navMenu}>
            {/* <li>
              <button
                className={`${styles.navItem} ${isActive('/home') ? styles.active : ''}`}
                onClick={() => handleNavigation('/home')}
              >
                <FontAwesomeIcon icon={faHome} className={styles.navIcon} />
                <span>Inicio</span>
              </button>
            </li> */}
            
            <li>
              <button
                className={`${styles.navItem} ${isActive('/profile') ? styles.active : ''}`}
                onClick={() => handleNavigation('/profile')}
              >
                <FontAwesomeIcon icon={faUser} className={styles.navIcon} />
                <span>Mi Perfil</span>
              </button>
            </li>
            
            <li>
              <button
                className={`${styles.navItem} ${isActive('/classes') ? styles.active : ''}`}
                onClick={() => handleNavigation('/classes')}
              >
                <FontAwesomeIcon icon={faBookOpen} className={styles.navIcon} />
                <span>Clases Disponibles</span>
              </button>
            </li>
            
            <li>
              <button
                className={`${styles.navItem} ${isActive('/create-class') ? styles.active : ''}`}
                onClick={() => handleNavigation('/create-class')}
              >
                <FontAwesomeIcon icon={faPlus} className={styles.navIcon} />
                <span>Crear Curso</span>
              </button>
            </li>
            
            <li>
              <button
                className={`${styles.navItem} ${isActive('/my-courses') ? styles.active : ''}`}
                onClick={() => handleNavigation('/my-courses')}
              >
                <FontAwesomeIcon icon={faGraduationCap} className={styles.navIcon} />
                <span>Mis Cursos</span>
              </button>
            </li>
            
            <li>
              <button 
                onClick={handleLogout} 
                className={`${styles.navItem} ${styles.logoutItem}`}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className={styles.navIcon} />
                <span>Cerrar Sesión</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default PrivateLayout; 