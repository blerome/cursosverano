// src/components/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import PrivateLayout from '../Layout/PrivateLayout';

export const PrivateRoute = () => {
  const { accounts, inProgress } = useMsal();
  const isAuthenticated = accounts.length > 0;

  // Esperar a que MSAL termine de inicializar
  if (inProgress === "login" || inProgress === "ssoSilent" || inProgress === "startup") {
    return <div>Cargando autenticación...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Usuario autenticado - renderiza las rutas hijas con el PrivateLayout que incluye navegación específica
  return (
    <PrivateLayout>
      <Outlet />
    </PrivateLayout>
  );
};
