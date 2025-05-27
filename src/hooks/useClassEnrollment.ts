import { useState } from 'react';
import { usePostClassesEnrollStudent } from '../generated/api/classes/classes';

export const useClassEnrollment = () => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const enrollMutation = usePostClassesEnrollStudent();

  const enrollInClass = async (
    classId: number, 
    studentId: number, 
    controlNumber: string, 
    studentPhone: string
  ) => {
    setIsEnrolling(true);
    try {
      await enrollMutation.mutateAsync({
        data: {
          classId,
          student: {
            studentId,
            controlNumber,
            studentPhone,
          },
        },
      });
      return { success: true, message: '¡Inscripción exitosa!' };
    } catch (error: any) {
      console.error('Error al inscribirse:', error);
      
      // Manejar diferentes tipos de errores
      let errorMessage = 'No se pudo completar la inscripción.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      return { success: false, message: errorMessage };
    } finally {
      setIsEnrolling(false);
    }
  };

  return {
    enrollInClass,
    isEnrolling,
  };
}; 