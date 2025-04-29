import React, { useState } from 'react';
import styles from './CourseFilter.module.css';
import { useCourses } from '../../context/CoursesContext';
import { Carrera } from '../../types/courseTypes';
import Button from '../UI/Button';

const CourseFilter: React.FC = () => {
  const { courses, setFilteredCourses } = useCourses();
  const [searchTerm, setSearchTerm] = useState('');
  const [carrera, setCarrera] = useState<Carrera | ''>('');
  const [disponibilidad, setDisponibilidad] = useState('');
  const [creditos, setCreditos] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(true);

  const handleFilter = () => {
    const filtered = courses.filter(course => {
      // Filtro por búsqueda
      if (searchTerm && !course.nombre.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filtro por carrera
      if (carrera && course.carrera !== carrera) {
        return false;
      }
      
      // Filtro por disponibilidad
      if (disponibilidad === 'disponible' && course.inscritos >= course.cupo) {
        return false;
      }
      if (disponibilidad === 'lleno' && course.inscritos < course.cupo) {
        return false;
      }
      
      // Filtro por créditos
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
        <span><i className="fas fa-filter"></i> Filtros de Búsqueda</span>
        <i className={`fas fa-chevron-${filtersOpen ? 'down' : 'up'}`}></i>
      </div>
      <div className={`${styles.filtrosContenido} ${!filtersOpen ? styles.cerrado : ''}`}>
        <div className={styles.filtroGrupo}>
          <label htmlFor="busqueda"><i className="fas fa-search"></i> Buscar por nombre</label>
          <input
            type="text"
            id="busqueda"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ej: Inteligencia Artificial"
          />
        </div>
        <div className={styles.filtroGrupo}>
          <label htmlFor="carrera"><i className="fas fa-graduation-cap"></i> Carrera</label>
          <select
            id="carrera"
            value={carrera}
            onChange={(e) => setCarrera(e.target.value as Carrera | '')}
          >
            <option value="">Todas las carreras</option>
            <option value="Sistemas">Ing. Sistemas Computacionales</option>
            <option value="Informatica">Ing. Informática</option>
            <option value="Software">Ing. Software</option>
            <option value="TICs">Ing. TICs</option>
            <option value="Industrial">Ing. Industrial</option>
          </select>
        </div>
        <div className={styles.filtroGrupo}>
          <label htmlFor="disponibilidad"><i className="fas fa-users"></i> Disponibilidad</label>
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
          <label htmlFor="creditos"><i className="fas fa-star"></i> Créditos</label>
          <select
            id="creditos"
            value={creditos}
            onChange={(e) => setCreditos(e.target.value)}
          >
            <option value="">Todos los créditos</option>
            <option value="4">4 créditos</option>
            <option value="6">6 créditos</option>
            <option value="8">8 créditos</option>
            <option value="10">10 créditos</option>
          </select>
        </div>
        <Button onClick={handleFilter} variant="primary">
          <i className="fas fa-filter"></i> Aplicar Filtros
        </Button>
        <Button onClick={handleClear} variant="secondary">
          <i className="fas fa-broom"></i> Limpiar Filtros
        </Button>
      </div>
    </div>
  );
};

export default CourseFilter;