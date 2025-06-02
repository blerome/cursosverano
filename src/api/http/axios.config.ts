import axios from 'axios';
import { msalInstance } from '../../auth/msalConfig';
import { loginRequest } from '../../auth/msalConfig';
import { AuthError } from '@azure/msal-browser';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para obtener el token de staff desde localStorage
const getStaffToken = (): string | null => {
  const staffSession = localStorage.getItem('staff_session');
  console.log('🔑 getStaffToken - Verificando sesión:', {
    hasSession: !!staffSession,
    sessionContent: staffSession ? 'presente' : 'ausente'
  });
  
  if (!staffSession) return null;
  
  try {
    const session = JSON.parse(staffSession);
    // Verificar si el token no ha expirado
    if (session.expiresAt && Date.now() > session.expiresAt) {
      console.log('⏰ getStaffToken - Sesión expirada, eliminando');
      localStorage.removeItem('staff_session');
      return null;
    }
    console.log('✅ getStaffToken - Sesión válida');
    return session.token;
  } catch {
    console.log('❌ getStaffToken - Error al parsear sesión, eliminando');
    localStorage.removeItem('staff_session');
    return null;
  }
};

// Función para detectar si es una ruta de staff
const isStaffRoute = (url: string): boolean => {
  // Rutas que definitivamente son de staff
  const staffOnlyRoutes = [
    '/auth/staff',
    '/staff/',
    '/admin/'
  ];
  
  return staffOnlyRoutes.some(route => url.includes(route));
};

// Función para detectar si es una ruta de estudiante exclusiva
const isStudentRoute = (url: string): boolean => {
  const studentOnlyRoutes = [
    '/auth/students',
    '/students/profile'
  ];
  
  return studentOnlyRoutes.some(route => url.includes(route));
};

axiosInstance.interceptors.request.use(
  async (config) => {
    // Validar que config y url estén definidos
    if (!config || !config.url) {
      console.warn('⚠️ Request interceptor: config o url no definidos', config);
      return config;
    }
    
    const url = config.url;
    console.log('🔄 Procesando request para:', url);
    
    // Si es una ruta específicamente de staff, solo usar token de staff
    if (isStaffRoute(url)) {
      console.log('👨‍💼 Ruta detectada como staff exclusiva');
      const staffToken = getStaffToken();
      if (staffToken) {
        config.headers.Authorization = `Bearer ${staffToken}`;
        return config;
      }
      // Si no hay token de staff para rutas que lo requieren (excepto login), rechazar
      if (!url.includes('/auth/staff/login')) {
        throw new AuthError('Token de staff requerido');
      }
      return config;
    }
    
    // Si es una ruta específicamente de estudiante, solo usar MSAL
    if (isStudentRoute(url)) {
      console.log('🎓 Ruta detectada como estudiante exclusiva');
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        try {
          const response = await msalInstance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0],
          });
          config.headers.Authorization = `Bearer ${response.accessToken}`;
          return config;
        } catch (error) {
          throw new AuthError('Error al obtener token MSAL')
        }
      }
      throw new AuthError('Autenticación de estudiante requerida');
    }
    
    // Para rutas ambiguas, intentar con la autenticación del usuario actual
    // Primero verificar si hay sesión de staff activa
    const staffSession = localStorage.getItem('staff_session');
    if (staffSession) {
      try {
        const session = JSON.parse(staffSession);
        if (session.token && (!session.expiresAt || Date.now() < session.expiresAt)) {
          console.log('🔑 Usando autenticación de staff para ruta ambigua');
          config.headers.Authorization = `Bearer ${session.token}`;
          return config;
        }
      } catch (error) {
        console.log('❌ Error al parsear sesión de staff para ruta ambigua');
      }
    }
    
    // Si no hay staff válido, intentar con MSAL
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      try {
        console.log('🔑 Usando autenticación MSAL para ruta ambigua');
        const response = await msalInstance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        });
        config.headers.Authorization = `Bearer ${response.accessToken}`;
        return config;
      } catch (error) {
        console.log('❌ Error al obtener token MSAL para ruta ambigua');
      }
    }
    
    // Si no hay autenticación disponible, rechazar
    console.log('❌ No hay autenticación disponible para:', url);
    throw new AuthError('Autenticación requerida')
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorUrl = error.config?.url || 'URL_NO_DEFINIDA';
    const errorStatus = error.response?.status || 'STATUS_NO_DEFINIDO';
    
    console.log('🌐 Axios Response Error:', {
      status: errorStatus,
      url: errorUrl,
      isStaffRoute: errorUrl !== 'URL_NO_DEFINIDA' ? isStaffRoute(errorUrl) : false,
      willClearSession: error.response?.status === 401 && errorUrl !== 'URL_NO_DEFINIDA' && isStaffRoute(errorUrl)
    });
    
    // Si hay error 401 en rutas de staff, limpiar sesión
    if (error.response?.status === 401 && errorUrl !== 'URL_NO_DEFINIDA' && isStaffRoute(errorUrl)) {
      console.log('🚫 Eliminando sesión de staff por error 401');
      localStorage.removeItem('staff_session');
    }
    return Promise.reject(error);
  }
);

export { axiosInstance };