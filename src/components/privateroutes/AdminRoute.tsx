import { Navigate, Outlet } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';

export const AdminRoute = () => {
  const { accounts, inProgress } = useMsal();
  const isAuthenticated = accounts.length > 0;

  // Esperar a que MSAL termine de inicializar
  if (inProgress === "login" || inProgress === "ssoSilent" || inProgress === "startup") {
    return <div>Cargando autenticación...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Usuario autenticado - renderiza directamente el contenido sin layout wrapper
  return <Outlet />;
}; 