import { Navigate, Outlet } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';

export const PublicRoute = () => {
  const { accounts } = useMsal();
  const isAuthenticated = accounts.length > 0;

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};