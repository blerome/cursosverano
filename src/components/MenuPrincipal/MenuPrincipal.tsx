import React, { useState, useEffect } from 'react';
import styles from './MenuPrincipal.module.css';
import { FaHome, FaGraduationCap, FaUniversity, FaLaptopCode, FaUserPlus } from 'react-icons/fa';
import RegulationDropdown from './RegulationDropdown';
import PlatformsDropdown from './PlatformsDropdown';
import HamburgerIcon from './HamburgerIcon';
import { useNavigate } from 'react-router-dom';

const MenuPrincipal: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
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

  const handleRegulationClick = () => {
    closeAll(); // Cierra el menú/dropdown al hacer clic
  };

  return (
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
              <FaHome /> <span>Inicio</span>
            </a>
          </li>
          <li onClick={closeAll}>
            <a href="https://www.cancun.tecnm.mx/">
              <FaGraduationCap /> <span>Instituto</span>
            </a>
          </li>
          <li 
            onMouseEnter={() => handleMouseEnter('regulations')}
            onMouseLeave={handleMouseLeave}
            onClick={() => isMobile && setActiveDropdown(
              activeDropdown === 'regulations' ? null : 'regulations'
            )}
          >
            <a href="#">
              <FaUniversity /> <span>Reglamento</span>
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
          >
            <a href="#">
              <FaLaptopCode /> <span>Plataformas Digitales</span>
            </a>
            {activeDropdown === 'platforms' && <PlatformsDropdown isMobile={isMobile} />}
          </li>
          <li onClick={closeAll}>
            <a href="#">
              <FaUserPlus /> <span>Registro/Acceder</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default MenuPrincipal;