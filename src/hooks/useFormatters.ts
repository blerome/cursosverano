import { 
  faCheckCircle, 
  faExclamationTriangle, 
  faInfoCircle 
} from '@fortawesome/free-solid-svg-icons';

/**
 * Hook para funciones de formato y utilidades reutilizables
 */
export const useFormatters = () => {
  
  /**
   * Formatea un número de teléfono al formato mexicano (999) 123-4567
   */
  const formatPhoneNumber = (phone: string | null | undefined): string => {
    if (!phone) return 'No disponible';
    // Formatear teléfono mexicano: (999) 123-4567
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  /**
   * Obtiene la información de estado de una clase (texto, icono, clase CSS)
   */
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { 
          text: 'Activa', 
          icon: faCheckCircle, 
          className: 'statusActive' 
        };
      case 'pendiente':
        return { 
          text: 'Pendiente', 
          icon: faExclamationTriangle, 
          className: 'statusPending' 
        };
      case 'cancelled':
        return { 
          text: 'Cancelada', 
          icon: faExclamationTriangle, 
          className: 'statusCancelled' 
        };
      default:
        return { 
          text: 'Desconocido', 
          icon: faInfoCircle, 
          className: 'statusUnknown' 
        };
    }
  };

  /**
   * Formatea el nombre completo de un usuario
   */
  const formatFullName = (
    name: string, 
    paternalSurname?: string, 
    maternalSurname?: string
  ): string => {
    const parts = [name, paternalSurname, maternalSurname].filter(Boolean);
    return parts.join(' ');
  };

  /**
   * Trunca un texto a una longitud específica
   */
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return {
    formatPhoneNumber,
    getStatusInfo,
    formatFullName,
    truncateText,
  };
}; 