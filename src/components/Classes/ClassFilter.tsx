import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFilter, 
  faSearch, 
  faGraduationCap, 
  faBook, 
  faCheckCircle,
  faBroom, 
  faChevronDown, 
  faChevronUp 
} from '@fortawesome/free-solid-svg-icons';
import styles from './ClassFilter.module.css';

interface FilterParams {
  careerId?: number;
  subjectId?: number;
  status?: 'pendiente' | 'aprobado' | 'rechazado';
  clave?: string;
}

interface ClassFilterProps {
  careers: any[];
  subjects: any[];
  studentCareer?: number;
  filters: FilterParams;
  onFilterChange: (filters: FilterParams) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const ClassFilter: React.FC<ClassFilterProps> = ({
  careers,
  subjects,
  studentCareer,
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleInputChange = (key: keyof FilterParams, value: any) => {
    let processedValue = value;
    
    // Formateo especial para la clave
    if (key === 'clave' && value) {
      // Convertir a mayúsculas y remover espacios
      processedValue = value.toUpperCase().replace(/\s/g, '');
      
      // Limitar a 7 caracteres máximo (3 letras + 4 números)
      if (processedValue.length > 7) {
        processedValue = processedValue.substring(0, 7);
      }
    }
    
    const newFilters = {
      ...filters,
      [key]: processedValue || undefined,
    };

    // Si se cambia la carrera, limpiar la selección de materia
    if (key === 'careerId') {
      newFilters.subjectId = undefined;
    }
    
    onFilterChange(newFilters);
  };

  // Función para validar el formato de la clave
  const isValidClaveFormat = (clave: string) => {
    if (!clave) return true; // Vacío es válido
    const claveRegex = /^[A-Z]{3}\d{4}$/;
    return claveRegex.test(clave);
  };

  // Función para obtener el estado de validación de la clave
  const getClaveValidationState = (clave: string) => {
    if (!clave || clave.length === 0) return 'empty';
    if (clave.length < 7) return 'incomplete';
    if (isValidClaveFormat(clave)) return 'valid';
    return 'invalid';
  };

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'pendiente', label: 'Pendientes' },
    { value: 'aprobado', label: 'Aprobados'},
    { value: 'rechazado', label: 'Rechazados'},
  ];

  return (
    <div className={styles.filterContainer}>
      <div 
        className={styles.filterHeader} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.filterTitle}>
          <FontAwesomeIcon icon={faFilter} />
          <span>Filtros de Búsqueda</span>
        </div>
        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
      </div>

      <div className={`${styles.filterContent} ${!isOpen ? styles.collapsed : ''}`}>
        <div className={styles.filterGrid}>
          {/* Búsqueda por clave */}
          <div className={styles.filterGroup}>
            <label htmlFor="clave">
              <FontAwesomeIcon icon={faSearch} />
              Buscar por clave
            </label>
            <div className={styles.searchInputContainer}>
              <input
                type="text"
                id="clave"
                value={filters.clave || ''}
                onChange={(e) => handleInputChange('clave', e.target.value)}
                placeholder="Ej: IED2201, MAT1001..."
                className={`${styles.searchInput} ${
                  filters.clave ? 
                    (getClaveValidationState(filters.clave) === 'valid' ? styles.valid : 
                     getClaveValidationState(filters.clave) === 'invalid' ? styles.invalid : '') 
                    : ''
                }`}
                maxLength={7}
              />
              {filters.clave && (
                <div className={styles.claveValidation}>
                  {getClaveValidationState(filters.clave) === 'incomplete' && (
                    <span className={styles.validationIncomplete}>
                      Formato: 3 letras + 4 números (ej: IED2201)
                    </span>
                  )}
                  {getClaveValidationState(filters.clave) === 'invalid' && (
                    <span className={styles.validationError}>
                      Formato inválido. Debe ser: 3 letras + 4 números
                    </span>
                  )}
                  {getClaveValidationState(filters.clave) === 'valid' && (
                    <span className={styles.validationSuccess}>
                      ✓ Formato válido
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Filtro por carrera */}
          <div className={styles.filterGroup}>
            <label htmlFor="career">
              <FontAwesomeIcon icon={faGraduationCap} />
              Carrera
            </label>
            <select
              id="career"
              value={filters.careerId || ''}
              onChange={(e) => handleInputChange('careerId', parseInt(e.target.value) || undefined)}
              className={styles.filterSelect}
            >
              <option value="">Todas las carreras</option>
              {careers.map((career) => (
                <option key={career.id_career} value={career.id_career}>
                  {career.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por materia */}
          <div className={styles.filterGroup}>
            <label htmlFor="subject">
              <FontAwesomeIcon icon={faBook} />
              Materia
              {filters.careerId && (
                <span className={styles.filterInfo}>
                  ({subjects.length} disponibles)
                </span>
              )}
            </label>
            <select
              id="subject"
              value={filters.subjectId || ''}
              onChange={(e) => handleInputChange('subjectId', parseInt(e.target.value) || undefined)}
              className={styles.filterSelect}
              disabled={!subjects.length}
            >
              <option value="">
                {filters.careerId 
                  ? subjects.length > 0 
                    ? 'Todas las materias de esta carrera'
                    : 'No hay materias para esta carrera'
                  : 'Todas las materias'
                }
              </option>
              {subjects.map((subject) => (
                <option key={subject.id_subject} value={subject.id_subject}>
                  {subject.clave} - {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por estado */}
          <div className={styles.filterGroup}>
            <label htmlFor="status">
              <FontAwesomeIcon icon={faCheckCircle} />
              Estado
            </label>
            <select
              id="status"
              value={filters.status || ''}
              onChange={(e) => handleInputChange('status', e.target.value as 'pendiente' | undefined)}
              className={styles.filterSelect}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botones de acción */}
        <div className={styles.filterActions}>
          <button 
            onClick={onClearFilters}
            className={styles.clearButton}
            disabled={!hasActiveFilters}
          >
            <FontAwesomeIcon icon={faBroom} />
            Limpiar Filtros
          </button>
        </div>

        {/* Mensaje informativo sobre filtrado de materias */}
        {filters.careerId && filters.careerId !== studentCareer && (
          <div className={styles.filterInfo}>
            <div className={styles.infoMessage}>
              <span className={styles.infoIcon}>ℹ️</span>
              <span>
                Las materias se han filtrado automáticamente para mostrar solo las de la carrera seleccionada.
              </span>
            </div>
          </div>
        )}

        {/* Indicador de filtros activos */}
        {hasActiveFilters && (
          <div className={styles.activeFilters}>
            <span className={styles.activeFiltersLabel}>Filtros activos:</span>
            <div className={styles.filterTags}>
              {filters.clave && (
                <span className={styles.filterTag}>
                  Clave: "{filters.clave}"
                </span>
              )}
              {filters.careerId && filters.careerId !== studentCareer && (
                <span className={styles.filterTag}>
                  Carrera: {careers.find(c => c.id_career === filters.careerId)?.name}
                </span>
              )}
              {filters.subjectId && (
                <span className={styles.filterTag}>
                  Materia: {subjects.find(s => s.id_subject === filters.subjectId)?.name}
                </span>
              )}
              {filters.status && (
                <span className={styles.filterTag}>
                  Estado: {statusOptions.find(s => s.value === filters.status)?.label}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassFilter; 