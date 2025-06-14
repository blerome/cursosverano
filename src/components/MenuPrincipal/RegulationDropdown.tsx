import React from 'react';
import styles from './RegulationDropdown.module.css';
import { FaArrowRight } from 'react-icons/fa';
import { DropdownItem } from './types2';
import Estudiante from './IMGMenuPrincipal/estudiante.png';
import General from './IMGMenuPrincipal/general.jpg';
import Responsable from './IMGMenuPrincipal/responsable.png';
import { Link, useNavigate } from 'react-router-dom';

interface RegulationDropdownProps {
  isMobile: boolean;
  onCloseDropdown?: () => void; // Nueva prop para cerrar el dropdown
}

const RegulationDropdown: React.FC<RegulationDropdownProps> = ({
  isMobile,
  onCloseDropdown,
}) => {
  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    navigate(path);
    if (onCloseDropdown) {
      onCloseDropdown();
    }
  };

  const regulations: DropdownItem[] = [
    {
      title: 'Al estudiante',
      description:
        'Las obligaciones que tiene el estudiante que esté interesado en las convocatorias...',
      linkText: 'Ver más detalles',
      imageSrc: Estudiante,
      altText: 'Al estudiante',
      path: '/reglamento-estudiante',
    },
    {
      title: 'Generales del curso',
      description:
        'Infórmate acerca de los costos, trámites y fechas para llevar a cabo tu postulación...',
      linkText: 'Consultar requisitos',
      imageSrc: General,
      altText: 'Generales del curso',
      path: '/reglamento-general',
    },
    {
      title: 'Responsables',
      description:
        'Si quieres crear un grupo de verano, estas son las responsabilidades...',
      linkText: 'Conoce las responsabilidades',
      imageSrc: Responsable,
      altText: 'Responsables',
      path: '/reglamento-responsable',
    },
  ];

  return (
    <div
      className={`${styles.dropdown} ${isMobile ? styles.mobileDropdown : ''}`}
    >
      {regulations.map((regulation, index) => (
        <div key={index} className={styles.regulationContainer}>
          <div className={styles.regulationImage}>
            <img src={regulation.imageSrc} alt={regulation.altText} />
          </div>
          <div className={styles.regulationContent}>
            <h3>{regulation.title}</h3>
            <p>{regulation.description}</p>
            <button
              onClick={() => handleLinkClick(regulation.path)}
              className={styles.regulationLink}
            >
              {regulation.linkText} <FaArrowRight />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RegulationDropdown;
