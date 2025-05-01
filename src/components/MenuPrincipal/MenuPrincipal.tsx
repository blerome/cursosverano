import React, { useState, useEffect } from 'react';
import styles from './MenuPrincipal.module.css';
import { FaHome, FaGraduationCap, FaUniversity, FaLaptopCode, FaUserPlus } from 'react-icons/fa';
import RegulationDropdown from './RegulationDropdown';
import PlatformsDropdown from './PlatformsDropdown';
import HamburgerIcon from './HamburgerIcon';
import LoginForm from '../LoginComponent/LoginForm';

const MenuPrincipal: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

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

  const handleLoginClick = () => {
    setShowLoginForm(true);
    closeAll();
  };

  const closeLoginForm = () => {
    setShowLoginForm(false);
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
                  onCloseDropdown={closeAll}
                />
              )}
            </li>
            
            <li onClick={handleLoginClick}>
              <a href="#">
                <FaUserPlus className={styles.icon} /> 
                <span>Registro/Acceder</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {showLoginForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={closeLoginForm}>
              &times;
            </button>
            <LoginForm onClose={closeLoginForm} />
          </div>
        </div>
      )}
    </>
  );
};

export default MenuPrincipal;