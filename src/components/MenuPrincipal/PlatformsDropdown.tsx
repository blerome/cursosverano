import React from 'react';
import styles from './PlatformsDropdown.module.css';
import {
  FaArrowRight,
  FaChalkboardTeacher,
  FaTasks,
  FaUserTie,
  FaCheckCircle,
} from 'react-icons/fa';
import { PlatformItem, TeacherItem } from './types2';
import sieImage from './IMGMenuPrincipal/sie.jpg';
import ElibroImage from './IMGMenuPrincipal/elibro.png';
import MoodleImage from './IMGMenuPrincipal/moodle.jpg';
interface PlatformsDropdownProps {
  isMobile: boolean;
}

const PlatformsDropdown: React.FC<PlatformsDropdownProps> = ({ isMobile }) => {
  const platforms: PlatformItem[] = [
    {
      title: 'SIE',
      description:
        'Consulta Horarios, Pagos, Información académica y carga de materias.',
      linkText: 'Acceder',
      imageSrc: sieImage,
      altText: 'SIE',
      link: 'http://sie.cancun.tecnm.mx/cgi-bin/sie.pl?Opc=PINDEXESTUDIANTE&psie=intertec&dummy=0',
    },
    {
      title: 'Biblioteca Digital',
      description:
        'Consulta libros e investigaciones en nuestra biblioteca móvil.',
      linkText: 'Acceder',
      imageSrc: ElibroImage,
      altText: 'Biblioteca Digital',
      link: 'https://www.elibro.com/',
    },
    {
      title: 'Ekaanbal',
      description:
        'Plataforma para la administración de materias y recursos educativos.',
      linkText: 'Acceder',
      imageSrc: MoodleImage,
      altText: 'Ekaanbal',
      link: 'https://ekaanbal.cancun.tecnm.mx/',
    },
  ];

  const teachers: TeacherItem[] = [
    { name: 'SISSAD', icon: <FaChalkboardTeacher /> },
    { name: 'CAT', icon: <FaTasks /> },
    { name: 'CVU', icon: <FaUserTie /> },
    { name: 'SATIT', icon: <FaCheckCircle /> },
  ];

  return (
    <div
      className={`${styles.dropdown} ${isMobile ? styles.mobileDropdown : ''}`}
    >
      <div className={styles.platformsContainer}>
        {/* Columnas de plataformas */}
        {platforms.map((platform, index) => (
          <div key={index} className={styles.platformColumn}>
            <img src={platform.imageSrc} alt={platform.altText} />
            <h3>{platform.title}</h3>
            <p>{platform.description}</p>
            <a
              href={platform.link}
              className={styles.platformLink}
              target="_blank" // Para abrir en nueva pestaña
              rel="noopener noreferrer" // Seguridad para target="_blank"
            >
              {platform.linkText} <FaArrowRight />
            </a>
          </div>
        ))}

        {/* Columna de docentes */}
        <div className={styles.teachersColumn}>
          <h3>Docentes</h3>
          <ul>
            {teachers.map((teacher, index) => (
              <li key={index}>
                {teacher.icon} {teacher.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlatformsDropdown;
