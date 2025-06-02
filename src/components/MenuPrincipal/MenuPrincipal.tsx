import React, { useState, useEffect } from 'react';
import styles from './MenuPrincipal.module.css';
import { FaHome, FaGraduationCap, FaUniversity, FaLaptopCode, FaUserPlus, FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';
import RegulationDropdown from './RegulationDropdown';
import PlatformsDropdown from './PlatformsDropdown';
import HamburgerIcon from './HamburgerIcon';
import { LoginButton } from '../../auth/LoginButton';
import { LogoutButton } from '../../auth/LogoutButton';
import { useMsal } from '@azure/msal-react';
import { Link } from 'react-router-dom';

const MenuPrincipal: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Detectar si el usuario está autenticado
  const { accounts } = useMsal();
  const isAuthenticated = accounts.length > 0;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
        setActiveDropdown(null);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseEnter = (dropdownName: string) => {
    if (!isMobile) {
      setActiveDropdown(dropdownName);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setActiveDropdown(null);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeAll = () => {
    setActiveDropdown(null);
    setMenuOpen(false);
  };

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.menuContainer}>
          {isMobile && (
            <div className={styles.hamburger} onClick={toggleMenu}>
              <HamburgerIcon isOpen={menuOpen} />
            </div>
          )}

          <ul className={`${styles.menu} ${menuOpen ? styles.menuOpen : ''}`}>
            <li onClick={closeAll}>
              <a href="/home">
                <FaHome className={styles.icon} /> 
                <span>Inicio</span>
              </a>
            </li>
            
            <li onClick={closeAll}>
              <a href="https://www.cancun.tecnm.mx/" target="_blank" rel="noopener noreferrer">
                <FaGraduationCap className={styles.icon} /> 
                <span>Instituto</span>
              </a>
            </li>
            
            <li 
              onMouseEnter={() => handleMouseEnter('regulations')}
              onMouseLeave={handleMouseLeave}
              onClick={() => isMobile && setActiveDropdown(
                activeDropdown === 'regulations' ? null : 'regulations'
              )}
              className={activeDropdown === 'regulations' ? styles.activeItem : ''}
            >
              <a href="#">
                <FaUniversity className={styles.icon} /> 
                <span>Reglamento</span>
              </a>
              {activeDropdown === 'regulations' && (
                <RegulationDropdown 
                  isMobile={isMobile}
                  onCloseDropdown={closeAll}
                />
              )}
            </li>
            
            <li 
              onMouseEnter={() => handleMouseEnter('platforms')}
              onMouseLeave={handleMouseLeave}
              onClick={() => isMobile && setActiveDropdown(
                activeDropdown === 'platforms' ? null : 'platforms'
              )}
              className={activeDropdown === 'platforms' ? styles.activeItem : ''}
            >
              <a href="#">
                <FaLaptopCode className={styles.icon} /> 
                <span>Plataformas Digitales</span>
              </a>
              {activeDropdown === 'platforms' && (
                <PlatformsDropdown 
                  isMobile={isMobile}
                />
              )}
            </li>
            
            {/* Botón del Portal del Estudiante - Solo visible si está autenticado */}
            {isAuthenticated && (
              <li onClick={closeAll} className={styles.studentPortalItem}>
                <Link to="/profile" className={styles.studentPortalLink}>
                  <FaUserGraduate className={styles.icon} /> 
                  <span>Portal Estudiante</span>
                  <div className={styles.portalBadge}></div>
                </Link>
              </li>
            )}
            
            <li onClick={closeAll}>
              {isAuthenticated ? <LogoutButton /> : <LoginButton />}
            </li>
            
          </ul>
        </div>
      </nav>
    </>
  );
};

export default MenuPrincipal;

