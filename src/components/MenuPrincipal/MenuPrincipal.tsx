import React, { useState, useEffect } from 'react';
import styles from './MenuPrincipal.module.css';
import { FaHome, FaGraduationCap, FaUniversity, FaLaptopCode, FaUserPlus } from 'react-icons/fa';
import RegulationDropdown from './RegulationDropdown';
import PlatformsDropdown from './PlatformsDropdown';
import HamburgerIcon from './HamburgerIcon';
import { LoginButton } from '../../auth/LoginButton';
import { LogoutButton } from '../../auth/LogoutButton';

const MenuPrincipal: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Eliminamos el estado showLoginButton ya que no usaremos el modal

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

  // Eliminamos handleLoginClick ya que el LoginButton manejará su propia lógica

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
                  onCloseDropdown={closeAll}
                />
              )}
            </li>
            
            {/* Cambiamos el ítem de login por el componente LoginButton directamente */}
            <li onClick={closeAll}>
              <LoginButton />
            </li>
            
          </ul>
        </div>
      </nav>

      {/* Eliminamos el modal de login ya que no lo necesitamos más */}
    </>
  );
};

export default MenuPrincipal;

