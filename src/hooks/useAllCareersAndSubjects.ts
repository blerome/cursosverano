import { useMemo } from 'react';
import { useGetCareers } from '../generated/api/careers/careers';
import { useGetSubjects } from '../generated/api/subjects/subjects';
import type { GetSubjects202DataItem } from '../generated/model/getSubjects202DataItem';
import type { GetSubjects202DataItemCareersItem } from '../generated/model/getSubjects202DataItemCareersItem';

/**
 * Hook personalizado para obtener todas las carreras y materias
 * Útil para dropdowns y filtros que necesitan mostrar todas las opciones
 */
export const useAllCareersAndSubjects = (selectedCareerId?: number) => {
  // Obtener todas las carreras (pageSize grande para evitar paginación)
  const { 
    data: careersData, 
    isLoading: careersLoading, 
    error: careersError 
  } = useGetCareers({
    pageSize: 1000, // Suficiente para todas las carreras
  });

  // Obtener todas las materias (pageSize grande para evitar paginación)
  const { 
    data: subjectsData, 
    isLoading: subjectsLoading, 
    error: subjectsError 
  } = useGetSubjects({
    pageSize: 1000, // Suficiente para todas las materias
  });

  // Extraer los datos de las respuestas
  const careers = careersData?.data?.data || [];
  const allSubjects = subjectsData?.data?.data || [];

  // Filtrar materias por carrera seleccionada
  const subjects = useMemo(() => {
    if (!selectedCareerId || !allSubjects.length) {
      return allSubjects;
    }

    return allSubjects.filter((subject: GetSubjects202DataItem) => 
      subject.Careers?.some((career: GetSubjects202DataItemCareersItem) => career.id_career === selectedCareerId)
    );
  }, [allSubjects, selectedCareerId]);

  // Estados combinados
  const isLoading = careersLoading || subjectsLoading;
  const hasError = !!careersError || !!subjectsError;

  return {
    careers,
    subjects,
    allSubjects, // Todas las materias sin filtrar
    isLoading,
    hasError,
    careersError,
    subjectsError,
  };
}; 