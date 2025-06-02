import { useGetClassesIdStudents } from '../generated/api/classes/classes';
import type { GetStudentByClassResponseDto } from '../generated/model';

/**
 * Hook para obtener los estudiantes de una clase específica
 */
export const useClassStudents = (classId: number | undefined) => {
  const {
    data: studentsData,
    isLoading: studentsLoading,
    error: studentsError,
    refetch: refetchStudents,
  } = useGetClassesIdStudents(
    classId || 0,
    { page: 1, pagesize: 100 },
    {
      query: {
        enabled: !!classId,
        retry: false,
      },
    },
  );

  const allStudents = studentsData?.data?.data || [];

  // Calcular estadísticas
  const leadersCount = allStudents.filter((s: GetStudentByClassResponseDto) => s.group_leader).length;
  const totalStudents = allStudents.length;

  return {
    // Datos
    allStudents,
    studentsData,
    
    // Estados
    isLoading: studentsLoading,
    error: studentsError,
    
    // Acciones
    refetch: refetchStudents,
    
    // Estadísticas
    totalStudents,
    leadersCount,
    hasStudents: totalStudents > 0,
  };
}; 