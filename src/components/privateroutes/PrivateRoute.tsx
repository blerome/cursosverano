// src/components/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';

/**
 * Componente para proteger rutas privadas
 * - Redirige a la página principal ("/") si el usuario no está autenticado
 * - Muestra el contenido de la ruta si el usuario está autenticado
 * 
 * Uso en rutas:
 * <Route element={<PrivateRoute />}>
 *   <Route path="/ruta-privada" element={<ComponentePrivado />} />
 * </Route>
 */
export const PrivateRoute = () => {
  const { accounts } = useMsal();
  const isAuthenticated = accounts.length > 0;

  // Verificación de autenticación
  if (!isAuthenticated) {
    // Usuario NO autenticado - redirige a home
    return <Navigate to="/" replace />;
  }

  // Usuario autenticado - muestra el contenido
  return <Outlet />;
};