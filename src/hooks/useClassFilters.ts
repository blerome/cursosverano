import { useState, useCallback, useMemo, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { GetClassesParams } from '../generated/model/getClassesParams';

interface FilterParams {
  careerId?: number;
  subjectId?: number;
  status?: 'pendiente' | 'aprobado' | 'rechazado';
  clave?: string;
  period?: number;
}

interface UseClassFiltersProps {
  studentCareer?: number;
  currentPage: number;
  pageSize: number;
}

export const useClassFilters = ({ studentCareer, currentPage, pageSize }: UseClassFiltersProps) => {
  const [filters, setFilters] = useState<FilterParams>({
    careerId: studentCareer, // Inicializar directamente
  });
  
  // Debounce solo para la búsqueda por clave
  const debouncedClave = useDebounce(filters.clave, 1000);

  // Memoizar los parámetros de consulta para evitar recálculos innecesarios
  const queryParams = useMemo((): GetClassesParams => {
    const params: GetClassesParams = {
      page: currentPage,
      pageSize: pageSize,
      careerId: filters.careerId || studentCareer,
      subjectId: filters.subjectId,
      period: filters.period,
    };

    // Solo enviar status 'pendiente' a la API (los otros son para filtrado local)
    if (filters.status === 'pendiente') {
      params.status = filters.status;
    }

    // Solo agregar clave si cumple con el formato: 3 letras + 4 números (ej: IED2201)
    if (debouncedClave && debouncedClave.trim().length > 0) {
      const claveFormatted = debouncedClave.trim().toUpperCase();
      const claveRegex = /^[A-Z]{3}\d{4}$/;
      
      if (claveRegex.test(claveFormatted)) {
        params.clave = claveFormatted;
      }
    }

    return params;
  }, [currentPage, pageSize, filters.careerId, filters.subjectId, filters.status, filters.period, debouncedClave, studentCareer]);

  // Handler optimizado para cambios de filtros
  const handleFilterChange = useCallback((newFilters: FilterParams) => {
    setFilters(newFilters);
  }, []);

  // Handler para limpiar filtros
  const clearFilters = useCallback(() => {
    setFilters({
      careerId: studentCareer,
    });
  }, [studentCareer]);

  // Verificar si hay filtros activos (excluyendo la carrera del estudiante por defecto)
  const hasActiveFilters = useMemo(() => {
    // Validar si la clave tiene el formato correcto
    const hasValidClave = filters.clave && /^[A-Z]{3}\d{4}$/.test(filters.clave.trim());
    
    return !!(
      hasValidClave ||
      filters.subjectId ||
      filters.status ||
      filters.period ||
      (filters.careerId && filters.careerId !== studentCareer)
    );
  }, [filters, studentCareer]);

  return {
    filters,
    queryParams,
    handleFilterChange,
    clearFilters,
    hasActiveFilters,
    debouncedClave,
  };
}; 