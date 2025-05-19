// src/components/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import AdminPage from '../../pages/AdminPage';

export const PrivateRoute = () => {
  const { accounts } = useMsal();
  const isAuthenticated = accounts.length > 0;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Usuario autenticado - muestra el AdminPage como layout
  return (
    <AdminPage>
      <Outlet />
    </AdminPage>
  );
};
