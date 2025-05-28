import { useGetAuthProfile } from '../generated/api/auth/auth';
import { useGetStudents } from '../generated/api/students/students';

/**
 * Hook para manejar la autenticación y validación de estudiantes
 * Combina la información del perfil del usuario con los datos del estudiante
 */
export const useStudentAuth = () => {
  // Obtener información del usuario actual
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
  } = useGetAuthProfile();

  const userData = profileData?.data;

  // Obtener datos del estudiante actual
  const {
    data: studentsData,
    isLoading: studentsLoading,
    error: studentsError,
  } = useGetStudents(
    { userId: userData?.id_user || 0 },
    {
      query: {
        enabled: !!userData?.id_user,
        retry: false,
      },
    },
  );

  const currentStudentData = studentsData?.data;

  // Estados combinados
  const isLoading = profileLoading || studentsLoading;
  const hasProfileError = !!profileError;
  const hasStudentError = !!studentsError || !currentStudentData;
  const isAuthenticated = !!userData && !!currentStudentData;

  return {
    // Datos del usuario
    userData,
    currentStudentData,
    
    // Estados de carga
    isLoading,
    profileLoading,
    studentsLoading,
    
    // Estados de error
    profileError,
    studentsError,
    hasProfileError,
    hasStudentError,
    
    // Estado de autenticación
    isAuthenticated,
  };
}; 