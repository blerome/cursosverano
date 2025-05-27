import React, { useState, useEffect, useRef } from 'react';
import { useGetClasses } from '../../generated/api/classes/classes';
import { useGetStudents } from '../../generated/api/students/students';
import { useGetAuthProfile } from '../../generated/api/auth/auth';
import { ClassData } from '../../types/class.types';
import { useClassEnrollment } from '../../hooks/useClassEnrollment';
import { useClassFilters } from '../../hooks/useClassFilters';
import { useAllCareersAndSubjects } from '../../hooks/useAllCareersAndSubjects';
import ClassCard from '../../components/Classes/ClassCard';
import ClassFilter from '../../components/Classes/ClassFilter';
import ClassPagination from '../../components/Classes/ClassPagination';
import { usePopup } from '../../hooks/usePopup';
import ErrorPopup from '../../components/UI/ErrorPopup';
import styles from './ClassesPage.module.css';

const ClassesPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [hasError, setHasError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const previousFiltersRef = useRef<string>('');

  const { popup, showError, showSuccess, hidePopup } = usePopup();
  const { enrollInClass } = useClassEnrollment();

  // Obtener datos del usuario autenticado
  const { data: profileData } = useGetAuthProfile();
  const userData = profileData?.data;

  // Obtener datos del estudiante para filtrar por carrera
  const { data: studentData } = useGetStudents(
    { userId: userData?.id_user || 0 },
    {
      query: {
        enabled: !!userData?.id_user,
        retry: false,
      },
    }
  );

  // Hook personalizado para manejar filtros
  const {
    filters,
    queryParams,
    handleFilterChange,
    clearFilters,
    hasActiveFilters,
  } = useClassFilters({
    studentCareer: studentData?.data?.id_career,
    currentPage,
    pageSize,
  });

  // Obtener carreras y materias para los filtros (filtrar materias por carrera seleccionada)
  const { 
    careers, 
    subjects, 
    isLoading: isLoadingCareersAndSubjects 
  } = useAllCareersAndSubjects(filters.careerId);

  // Obtener clases con filtros optimizados
  const {
    data: classesData,
    isLoading,
    error,
    refetch,
  } = useGetClasses(queryParams, {
    query: {
      retry: 2,
      retryDelay: 1000,
    },
  });

  const classes: ClassData[] = classesData?.data?.data || [];
  const totalPages = Math.ceil((classesData?.data?.total || 0) / pageSize);

  // Efecto para manejar errores
  useEffect(() => {
    if (error) {
      console.error('Error al cargar clases:', error);
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [error]);

  // Resetear página cuando cambian los filtros (excepto la paginación)
  useEffect(() => {
    const currentFiltersString = JSON.stringify({
      careerId: filters.careerId,
      subjectId: filters.subjectId,
      status: filters.status,
      clave: filters.clave
    });
    
    if (previousFiltersRef.current !== currentFiltersString) {
      previousFiltersRef.current = currentFiltersString;
      
      // Si hay búsqueda por clave, marcar como buscando
      if (filters.clave && filters.clave.trim().length > 0) {
        setIsSearching(true);
      } else {
        setIsSearching(false);
      }
      
      setCurrentPage(1);
    }
  }, [filters.careerId, filters.subjectId, filters.status, filters.clave]);

  // Resetear estado de búsqueda cuando termina la carga
  useEffect(() => {
    if (!isLoading) {
      setIsSearching(false);
    }
  }, [isLoading]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setHasError(false);
  };

  const handleRetry = () => {
    setHasError(false);
    refetch();
  };

  const handleClearFilters = () => {
    clearFilters();
    setCurrentPage(1);
    setHasError(false);
  };

  const handleEnroll = async (classId: number) => {
    const currentStudent = studentData?.data;
    
    if (!currentStudent) {
      showError(
        'Error de estudiante', 
        'Debes estar registrado como estudiante para inscribirte a una clase.'
      );
      return;
    }

    try {
      const result = await enrollInClass(
        classId,
        currentStudent.id_student,
        currentStudent.control_number || '',
        currentStudent.phone || ''
      );

      if (result.success) {
        showSuccess('¡Inscripción exitosa!', result.message);
        refetch();
      } else {
        showError('Error en la inscripción', result.message);
      }
    } catch (error) {
      showError('Error en la inscripción', 'No se pudo completar la inscripción.');
    }
  };

  if ((isLoading && !classesData) || isLoadingCareersAndSubjects) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>
          {isLoadingCareersAndSubjects 
            ? 'Cargando carreras y materias...' 
            : isSearching 
              ? 'Buscando clases...' 
              : 'Cargando clases disponibles...'
          }
        </p>
      </div>
    );
  }
  console.log(classesData)

  return (
    <div className={styles.classesContainer}>

      <ClassFilter
        careers={careers}
        subjects={subjects}
        studentCareer={studentData?.data?.id_career}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Mostrar mensaje de error con opciones de recuperación */}
      {hasError && (
        <div className={styles.errorBanner}>
          <div className={styles.errorContent}>
            <h3>Error al cargar las clases</h3>
            <p>
              Hubo un problema al cargar las clases. Esto puede deberse a filtros inválidos o problemas de conexión.
            </p>
            <div className={styles.errorActions}>
              <button onClick={handleRetry} className={styles.retryButton}>
                Reintentar
              </button>
              <button onClick={handleClearFilters} className={styles.clearButton}>
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Indicador de carga */}
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
        </div>
      )}

      {/* Mostrar contenido */}
      {(!hasError || classes.length > 0) && (
        <>
          {classes.length === 0 && !isLoading ? (
            <div className={styles.noResults}>
              <h3>No se encontraron clases</h3>
              <p>No hay clases disponibles con los filtros seleccionados.</p>
              {hasActiveFilters && (
                <button onClick={handleClearFilters} className={styles.clearFiltersButton}>
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <>
              <div className={styles.resultsInfo}>
                <p>
                  Mostrando {classes.length} de {classesData?.data.meta.total || 0} clases
                  {isLoading && <span className={styles.loadingText}> (actualizando...)</span>}
                </p>
              </div>

              <div className={styles.classesGrid}>
                {classes.map((classItem: ClassData) => (
                  <ClassCard
                    key={classItem.id_class}
                    classData={classItem}
                    onEnroll={handleEnroll}
                    studentData={studentData?.data}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <ClassPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </>
      )}

      <ErrorPopup
        isOpen={popup.isOpen}
        onClose={hidePopup}
        title={popup.title}
        message={popup.message}
        type={popup.type}
        autoClose={popup.type === 'success'}
        autoCloseDelay={3000}
      />
    </div>
  );
};

export default ClassesPage; 