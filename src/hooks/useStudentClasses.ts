import { useGetClassesStudent } from '../generated/api/classes/classes';

/**
 * Hook para obtener las clases de un estudiante específico
 */
export const useStudentClasses = (studentId: number | undefined) => {
  const {
    data: studentClassesData,
    isLoading: classesLoading,
    error: classesError,
    refetch: refetchClasses,
  } = useGetClassesStudent(
    { id: studentId || 0 },
    {
      query: {
        enabled: !!studentId,
        retry: false,
      },
    },
  );

  const studentClasses = studentClassesData?.data || [];

  return {
    // Datos
    studentClasses,
    classesData: studentClassesData,
    
    // Estados
    isLoading: classesLoading,
    error: classesError,
    
    // Acciones
    refetch: refetchClasses,
    
    // Utilidades
    hasClasses: studentClasses.length > 0,
    classesCount: studentClasses.length,
  };
}; 