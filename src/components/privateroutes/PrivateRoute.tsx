// src/components/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PrivateLayout from '../Layout/PrivateLayout';

export const PrivateRoute = () => {
  const { isAuthenticated, userType, isLoading, user } = useAuth();

  console.log('🛡️ PrivateRoute - Estado actual:', {
    isLoading,
    isAuthenticated,
    userType,
    hasUser: !!user
  });

  // Mostrar loading mientras se inicializa la autenticación
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#667eea',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          padding: '2rem',
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <div>Verificando autenticación...</div>
          <div style={{fontSize: '14px', color: '#666', marginTop: '0.5rem'}}>
            Cargando información del usuario
          </div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Solo estudiantes pueden acceder a rutas privadas
  if (!isAuthenticated || userType !== 'student') {
    console.log('🚫 Redirigiendo al home - No autenticado como estudiante');
    return <Navigate to="/" replace />;
  }

  console.log('✅ Acceso permitido a ruta privada');
  // Usuario estudiante autenticado - renderiza las rutas hijas con el PrivateLayout
  return (
    <PrivateLayout>
      <Outlet />
    </PrivateLayout>
  );
};
