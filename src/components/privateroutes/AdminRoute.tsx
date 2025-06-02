import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const AdminRoute = () => {
  const { isAuthenticated, userType, user, isLoading } = useAuth();

  console.log('🛡️ AdminRoute - Estado actual:', {
    isLoading,
    isAuthenticated,
    userType,
    user,
    userRole: user?.type === 'staff' ? user.role : 'N/A'
  });

  // Mostrar loading mientras se inicializa la autenticación
  if (isLoading) {
    console.log('⏳ AdminRoute: Mostrando loading...');
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
          <div>Verificando permisos administrativos...</div>
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

  // Solo staff (admin y maestros) pueden acceder a rutas de admin
  if (!isAuthenticated || userType !== 'staff') {
    console.log('🚫 AdminRoute: Redirigiendo a /staff/login - No es staff autenticado:', {
      isAuthenticated,
      userType
    });
    return <Navigate to="/staff/login" replace />;
  }

  // Verificar que el usuario sea admin para ciertas rutas
  if (user?.type === 'staff' && user.role !== 'admin') {
    console.log('🚫 AdminRoute: Redirigiendo a /staff/profile - No es admin:', {
      userRole: user.role
    });
    // Los maestros podrían tener acceso limitado en el futuro
    // Por ahora, solo admins pueden acceder
    return <Navigate to="/staff/profile" replace />;
  }

  console.log('✅ AdminRoute: Acceso permitido');
  // Usuario staff autenticado - renderiza directamente el contenido
  return <Outlet />;
}; 