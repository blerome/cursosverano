# Sistema de Popups Reutilizable

Este sistema proporciona una manera elegante y consistente de mostrar mensajes de error, éxito, advertencia e información en toda la aplicación.

## Componentes

### ErrorPopup
Componente principal para mostrar popups modales con diferentes tipos de mensajes.

### usePopup Hook
Hook personalizado que facilita el manejo del estado de los popups.

## Uso Básico

```tsx
import { usePopup } from '../../hooks/usePopup';
import ErrorPopup from '../../components/UI/ErrorPopup';

const MiComponente: React.FC = () => {
  const { popup, showError, showSuccess, showWarning, showInfo, hidePopup } = usePopup();

  const handleError = () => {
    showError('Error de validación', 'Por favor, completa todos los campos requeridos.');
  };

  const handleSuccess = () => {
    showSuccess('¡Éxito!', 'La operación se completó correctamente.');
  };

  return (
    <div>
      <button onClick={handleError}>Mostrar Error</button>
      <button onClick={handleSuccess}>Mostrar Éxito</button>
      
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
```

## Tipos de Popup

### Error (Rojo)
```tsx
showError('Título del Error', 'Descripción detallada del error');
```

### Éxito (Verde)
```tsx
showSuccess('¡Operación Exitosa!', 'La acción se completó correctamente');
```

### Advertencia (Amarillo)
```tsx
showWarning('Advertencia', 'Esta acción no se puede deshacer');
```

### Información (Azul)
```tsx
showInfo('Información', 'Datos importantes para el usuario');
```

## Manejo de Errores de API

Para manejar errores del backend de manera consistente:

```tsx
const parseApiError = (error: any): string => {
  try {
    if (error?.response?.data) {
      const apiError = error.response.data as { message: string; error: string; statusCode: number };
      return apiError.message || 'Error desconocido del servidor';
    }
    
    if (error?.message) {
      return error.message;
    }
    
    return 'Error inesperado. Por favor, intenta nuevamente.';
  } catch {
    return 'Error inesperado. Por favor, intenta nuevamente.';
  }
};

// Uso en try/catch
try {
  await apiCall();
  showSuccess('¡Éxito!', 'Operación completada');
} catch (error: any) {
  const errorMessage = parseApiError(error);
  showError('Error en la operación', errorMessage);
}
```

## Propiedades del ErrorPopup

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `isOpen` | boolean | ✅ | Controla si el popup está visible |
| `onClose` | function | ✅ | Función para cerrar el popup |
| `title` | string | ✅ | Título del popup |
| `message` | string | ✅ | Mensaje principal |
| `type` | 'error' \| 'warning' \| 'info' \| 'success' | ❌ | Tipo de popup (default: 'info') |
| `autoClose` | boolean | ❌ | Si se cierra automáticamente (default: false) |
| `autoCloseDelay` | number | ❌ | Tiempo en ms para auto-cerrar (default: 5000) |
| `showCloseButton` | boolean | ❌ | Mostrar botón X (default: true) |

## Métodos del usePopup Hook

| Método | Parámetros | Descripción |
|--------|------------|-------------|
| `showPopup` | (title, message, type?) | Método genérico para mostrar popup |
| `showError` | (title, message) | Mostrar popup de error |
| `showSuccess` | (title, message) | Mostrar popup de éxito |
| `showWarning` | (title, message) | Mostrar popup de advertencia |
| `showInfo` | (title, message) | Mostrar popup de información |
| `hidePopup` | () | Cerrar el popup actual |

## Características

- ✅ **Responsive**: Se adapta a diferentes tamaños de pantalla
- ✅ **Accesible**: Manejo de teclado y foco
- ✅ **Animaciones**: Transiciones suaves de entrada y salida
- ✅ **Auto-cierre**: Opción de cerrar automáticamente
- ✅ **Tipos visuales**: Diferentes colores e iconos por tipo
- ✅ **Reutilizable**: Un solo componente para todos los casos
- ✅ **TypeScript**: Completamente tipado 