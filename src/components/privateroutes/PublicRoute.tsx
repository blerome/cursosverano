import { Navigate, Outlet } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import Layout from '../Layout/Layout';

export const PublicRoute = () => {
  const { accounts } = useMsal();
  const isAuthenticated = accounts.length > 0;

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};
