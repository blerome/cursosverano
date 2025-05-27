import { Navigate, Outlet } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import Layout from '../Layout/Layout';

export const PublicRoute = () => {
  // const { accounts } = useMsal();
  // const isAuthenticated = accounts.length > 0;

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};
