import React, { useState } from 'react';
import styles from './CourseFilter.module.css';
import { useCourses } from '../../context/CoursesContext';
import { Carrera } from '../../types/courseTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFilter, 
  faSearch, 
  faGraduationCap, 
  faUsers, 
  faStar, 
  faBroom, 
  faChevronDown, 
  faChevronUp 
} from '@fortawesome/free-solid-svg-icons';

const CourseFilter: React.FC = () => {
  const { courses, setFilteredCourses } = useCourses();
  const [searchTerm, setSearchTerm] = useState('');
  const [carrera, setCarrera] = useState<Carrera | ''>('');
  const [disponibilidad, setDisponibilidad] = useState('');
  const [creditos, setCreditos] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(true);

  const handleFilter = () => {
    const filtered = courses.filter(course => {
      if (searchTerm && !course.nombre.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (carrera && course.carrera !== carrera) {
        return false;
      }
      if (disponibilidad === 'disponible' && course.inscritos >= course.cupo) {
        return false;
      }
      if (disponibilidad === 'lleno' && course.inscritos < course.cupo) {
        return false;
      }
      if (creditos && course.creditos !== parseInt(creditos)) {
        return false;
      }
      return true;
    });
    setFilteredCourses(filtered);
  };

  const handleClear = () => {
    setSearchTerm('');
    setCarrera('');
    setDisponibilidad('');
    setCreditos('');
    setFilteredCourses(courses);
  };

  return (
    <div className={styles.filtrosContainer}>
      <div 
        className={styles.filtrosTitulo} 
        onClick={() => setFiltersOpen(!filtersOpen)}
      >
        <span><FontAwesomeIcon icon={faFilter} /> Filtros de Búsqueda</span>
        <FontAwesomeIcon icon={filtersOpen ? faChevronDown : faChevronUp} />
      </div>
      <div className={`${styles.filtrosContenido} ${!filtersOpen ? styles.cerrado : ''}`}>
        <div className={styles.filtroGrupo}>
          <label htmlFor="busqueda">
            <FontAwesomeIcon icon={faSearch} /> Buscar por nombre
          </label>
          <input
            type="text"
            id="busqueda"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ej: Inteligencia Artificial"
          />
        </div>
        <div className={styles.filtroGrupo}>
          <label htmlFor="carrera">
            <FontAwesomeIcon icon={faGraduationCap} /> Carrera
          </label>
          <select
            id="carrera"
            value={carrera}
            onChange={(e) => setCarrera(e.target.value as Carrera | '')}
          >
            <option value="">Todas las carreras</option>
            <option value="Sistemas">Ing. Sistemas Computacionales</option>
            <option value="Informatica">Lic. Contaduria</option>
            <option value="Software">Ing. Mecatronica</option>
            <option value="TICs">Ing. Civil</option>
            <option value="Industrial">Turismo</option>
          </select>
        </div>
        <div className={styles.filtroGrupo}>
          <label htmlFor="disponibilidad">
            <FontAwesomeIcon icon={faUsers} /> Disponibilidad
          </label>
          <select
            id="disponibilidad"
            value={disponibilidad}
            onChange={(e) => setDisponibilidad(e.target.value)}
          >
            <option value="">Todos los cursos</option>
            <option value="disponible">Solo disponibles</option>
            <option value="lleno">Solo llenos</option>
          </select>
        </div>
        <div className={styles.filtroGrupo}>
          <label htmlFor="creditos">
            <FontAwesomeIcon icon={faStar} /> Créditos
          </label>
          <select
            id="creditos"
            value={creditos}
            onChange={(e) => setCreditos(e.target.value)}
          >
            <option value="">Todos los créditos</option>
            <option value="3">3 créditos</option>+
            <option value="4">4 créditos</option>
            <option value="5">6 créditos</option>
          
          </select>
        </div>
        
        <div className={styles.contenedorBotones}>
          <button 
            onClick={handleFilter} 
            className={styles['boton-filtrar']}
          >
            <FontAwesomeIcon icon={faFilter} /> Aplicar Filtros
          </button>
          <button 
            onClick={handleClear} 
            className={styles['boton-limpiar']}
          >
            <FontAwesomeIcon icon={faBroom} /> Limpiar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseFilter;
