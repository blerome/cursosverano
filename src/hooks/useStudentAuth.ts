import { useAuth } from '../contexts/AuthContext';

/**
 * Hook para manejar la autenticación y validación de estudiantes
 * Combina la información del perfil del usuario con los datos del estudiante
 */
export const useStudentAuth = () => {
  const { user, userType, isAuthenticated } = useAuth();

  // Solo para estudiantes
  const isStudent = isAuthenticated && userType === 'student' && user?.type === 'student';
  const studentData = isStudent ? user.studentData : null;

  return {
    isAuthenticated,
    isStudent,
    user: isStudent ? user : null,
    studentData,
    userData: isStudent ? user : null,
    hasStudentProfile: !!studentData,
  };
}; 