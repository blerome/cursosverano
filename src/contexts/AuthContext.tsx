import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { useGetAuthStudentProfile, useGetAuthStaffProfile } from '../generated/api/auth/auth';
import { useGetStudents } from '../generated/api/students/students';
import type { AuthContext, UserType, StudentProfile, StaffProfile } from '../types/auth.types';

const AuthenticationContext = createContext<AuthContext | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { accounts, instance, inProgress } = useMsal();
  const [userType, setUserType] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<StudentProfile | StaffProfile | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasCheckedInitialAuth, setHasCheckedInitialAuth] = useState(false);
  const [forceRecheck, setForceRecheck] = useState(0);

  // Función para forzar re-evaluación (útil después del login)
  const triggerRecheck = () => {
    console.log('🔄 Forzando re-evaluación del contexto de autenticación');
    setForceRecheck(prev => prev + 1);
  };

  // Detectar tipo de usuario basado en si hay sesión de staff o cuenta MSAL
  useEffect(() => {
    const checkAuthentication = async () => {
      console.log('🔍 Iniciando verificación de autenticación:', {
        inProgress,
        accountsLength: accounts.length,
        hasCheckedInitialAuth,
        forceRecheck
      });

      // Si MSAL está en progreso, esperar
      if (inProgress !== "none") {
        console.log('⏳ MSAL en progreso, esperando...');
        return;
      }

      // Dar tiempo adicional para que MSAL cargue completamente
      if (!hasCheckedInitialAuth && forceRecheck === 0) {
        console.log('🕐 Primera verificación, esperando 500ms adicionales...');
        setTimeout(() => {
          setHasCheckedInitialAuth(true);
        }, 500);
        return;
      }

      const staffSession = localStorage.getItem('staff_session');
      const hasStudentAccount = accounts.length > 0;

      // Log detallado del localStorage
      console.log('📦 Verificando localStorage:', {
        hasStaffSession: !!staffSession,
        staffSessionRaw: staffSession,
      });

      if (staffSession) {
        try {
          const parsedSession = JSON.parse(staffSession);
          console.log('📋 Sesión de staff parseada:', {
            hasToken: !!parsedSession.token,
            hasUser: !!parsedSession.user,
            userRole: parsedSession.user?.role,
            expiresAt: parsedSession.expiresAt,
            isExpired: parsedSession.expiresAt ? Date.now() > parsedSession.expiresAt : 'no expiry set',
            currentTime: Date.now()
          });

          // Verificar si la sesión ha expirado
          if (parsedSession.expiresAt && Date.now() > parsedSession.expiresAt) {
            console.log('⏰ Sesión de staff expirada, eliminando...');
            localStorage.removeItem('staff_session');
            setUserType(null);
            setIsInitializing(false);
            return;
          }
        } catch (error) {
          console.log('❌ Error al parsear sesión de staff:', error);
          localStorage.removeItem('staff_session');
          setUserType(null);
          setIsInitializing(false);
          return;
        }
      }

      console.log('🔍 Detección de autenticación detallada:', {
        staffSession: !!staffSession,
        hasStudentAccount,
        accountsLength: accounts.length,
        inProgress,
        msalAccounts: accounts,
        currentUserType: userType
      });

      if (staffSession && !hasStudentAccount) {
        console.log('👨‍💼 Detectado: Usuario staff sin cuenta de estudiante');
        setUserType('staff');
      } else if (hasStudentAccount && !staffSession) {
        console.log('🎓 Detectado: Usuario estudiante');
        setUserType('student');
      } else if (staffSession && hasStudentAccount) {
        console.log('🔄 Detectado: Ambas sesiones, priorizando staff');
        setUserType('staff');
      } else {
        console.log('❌ No se detectó autenticación válida');
        setUserType(null);
      }

      // Marcar como inicializado
      setIsInitializing(false);
    };

    checkAuthentication();
  }, [accounts, inProgress, hasCheckedInitialAuth, forceRecheck]);

  // Listener para cambios en localStorage (para detectar cuando se guarda una nueva sesión)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'staff_session') {
        console.log('📢 Detectado cambio en staff_session, forzando re-evaluación');
        triggerRecheck();
      }
    };

    // Listener para evento personalizado de cambio de sesión de staff
    const handleStaffSessionChange = (e: CustomEvent) => {
      console.log('📢 Evento personalizado de cambio de sesión de staff:', e.detail);
      triggerRecheck();
    };

    // También detectar cambios manuales en localStorage desde la misma ventana
    const handleManualStorageChange = () => {
      triggerRecheck();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('staffSessionChanged', handleStaffSessionChange as EventListener);
    
    // Para detectar cambios desde la misma ventana, podemos usar un intervalo corto
    const interval = setInterval(() => {
      const currentSession = localStorage.getItem('staff_session');
      const sessionExists = !!currentSession;
      const wasStaff = userType === 'staff';
      
      if (sessionExists && !wasStaff) {
        console.log('📢 Nueva sesión de staff detectada via polling');
        handleManualStorageChange();
      }
    }, 200); // Reducido de 1000ms a 200ms para detección más rápida

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('staffSessionChanged', handleStaffSessionChange as EventListener);
      clearInterval(interval);
    };
  }, [userType]);

  // Hook para perfil de estudiante - solo se ejecuta si userType es 'student'
  const {
    data: studentProfileData,
    isLoading: studentProfileLoading,
    error: studentProfileError,
  } = useGetAuthStudentProfile({
    query: {
      enabled: userType === 'student',
      retry: false,
    },
  });

  // Hook para perfil de staff - solo se ejecuta si userType es 'staff'
  const {
    data: staffProfileData,
    isLoading: staffProfileLoading,
    error: staffProfileError,
  } = useGetAuthStaffProfile({
    query: {
      enabled: userType === 'staff',
      retry: false,
    },
  });

  // Log específico del hook de staff profile
  console.log('🔍 Staff Profile Hook - Estado:', {
    userType,
    hookEnabled: userType === 'staff',
    staffProfileLoading,
    hasStaffProfileData: !!staffProfileData?.data,
    hasStaffProfileError: !!staffProfileError
  });

  // Hook para datos adicionales del estudiante
  const studentUserId = studentProfileData?.data?.id_user;
  const {
    data: studentsData,
    isLoading: studentsLoading,
  } = useGetStudents(
    { userId: studentUserId || 0 },
    {
      query: {
        enabled: !!studentUserId && userType === 'student',
        retry: false,
      },
    },
  );

  // Actualizar estado de usuario cuando los datos cambien
  useEffect(() => {
    if (userType === 'student' && studentProfileData?.data) {
      const studentProfile: StudentProfile = {
        type: 'student',
        id_user: studentProfileData.data.id_user,
        name: studentProfileData.data.name,
        email: studentProfileData.data.email,
        paternal_surname: studentProfileData.data.paternal_surname,
        maternal_surname: studentProfileData.data.maternal_surname?.toString() || '',
        oid: studentProfileData.data.oid,
        studentData: studentsData?.data ? {
          id_student: studentsData.data.id_student,
          control_number: studentsData.data.control_number?.toString() || '',
          phone: studentsData.data.phone?.toString() || '',
          career: studentsData.data.career || '',
          id_career: studentsData.data.id_career || 0,
        } : undefined,
      };
      setUser(studentProfile);
      setIsAuthenticated(true);
      console.log('✅ Usuario estudiante autenticado completamente:', studentProfile);
    } else if (userType === 'staff' && staffProfileData?.data) {
      console.log('🔍 Staff Profile - Datos recibidos:', staffProfileData.data);
      
      // Función para convertir el rol a nuestro tipo
      const convertRole = (roleData: any): 'admin' | 'teacher' => {
        // Si el rol viene como objeto con name
        if (roleData && typeof roleData === 'object' && roleData.name) {
          return roleData.name === 'admin' ? 'admin' : 'teacher';
        }
        // Si el rol viene como string directo
        if (typeof roleData === 'string') {
          return roleData === 'admin' ? 'admin' : 'teacher';
        }
        // Si el rol viene como id numérico (1 = admin, otros = teacher)
        if (typeof roleData === 'number') {
          return roleData === 1 ? 'admin' : 'teacher';
        }
        // Si hay un campo id_role separado
        if (staffProfileData.data.id_role === 1) {
          return 'admin';
        }
        
        // Por defecto, teacher
        return 'teacher';
      };

      const staffProfile: StaffProfile = {
        type: 'staff',
        id: Number(staffProfileData.data.id || staffProfileData.data.id_user) || 0,
        name: String(staffProfileData.data.name) || '',
        email: String(staffProfileData.data.email) || '',
        role: convertRole(staffProfileData.data.role),
        isActive: Boolean(staffProfileData.data.isActive ?? true),
      };
      
      console.log('🔍 Staff Profile - Conversión de rol:', {
        originalRole: staffProfileData.data.role,
        originalIdRole: staffProfileData.data.id_role,
        convertedRole: staffProfile.role
      });
      
      setUser(staffProfile);
      setIsAuthenticated(true);
      console.log('✅ Usuario staff autenticado completamente:', staffProfile);
    } else if (userType === 'student' && studentProfileError) {
      // Verificar si es un error de conexión vs error de autenticación
      const errorMessage = (studentProfileError as any)?.message || '';
      const errorCode = (studentProfileError as any)?.code || '';
      const isConnectionError = errorMessage.includes('ERR_CONNECTION_REFUSED') || 
                               errorMessage.includes('Network Error') ||
                               errorCode === 'ERR_NETWORK';
      
      if (isConnectionError) {
        console.log('🌐 Error de conexión con el backend, pero usuario MSAL válido');
        // No cambiar isAuthenticated a false por errores de conexión
        // Mantener el estado de autenticación basado en MSAL
        setIsAuthenticated(true);
        
        // Crear un perfil temporal basado en MSAL
        const msalAccounts = instance.getAllAccounts();
        if (msalAccounts.length > 0) {
          const account = msalAccounts[0];
          const tempProfile: StudentProfile = {
            type: 'student',
            id_user: 0, // Temporal
            name: account.name || 'Usuario',
            email: account.username,
            paternal_surname: '',
            maternal_surname: '',
            oid: account.localAccountId,
          };
          setUser(tempProfile);
          console.log('👤 Usando perfil temporal de MSAL:', tempProfile);
        }
      } else {
        console.log('❌ Error de autenticación real:', studentProfileError);
        setUser(null);
        setIsAuthenticated(false);
      }
    } else if (userType === 'staff' && staffProfileError) {
      console.log('❌ Error de staff:', staffProfileError);
      
      // Verificar si es un error de conexión vs error de autenticación
      const errorMessage = (staffProfileError as any)?.message || '';
      const errorCode = (staffProfileError as any)?.code || '';
      const isConnectionError = errorMessage.includes('ERR_CONNECTION_REFUSED') || 
                               errorMessage.includes('Network Error') ||
                               errorCode === 'ERR_NETWORK';
      
      if (isConnectionError) {
        console.log('🌐 Error de conexión con el backend para staff, manteniendo sesión local');
        // No cambiar isAuthenticated a false por errores de conexión
        // Intentar usar datos de la sesión guardada
        const staffSession = localStorage.getItem('staff_session');
        if (staffSession) {
          try {
            const session = JSON.parse(staffSession);
            if (session.user) {
              setUser(session.user);
              setIsAuthenticated(true);
              console.log('👤 Usando datos de sesión local de staff:', session.user);
              return; // Salir temprano para evitar setear como no autenticado
            }
          } catch (error) {
            console.log('❌ Error al recuperar sesión local de staff:', error);
          }
        }
      }
      
      // Para cualquier error de staff, setear como no autenticado
      setUser(null);
      setIsAuthenticated(false);
    } else if (!isInitializing && userType === null) {
      // Solo setear como no autenticado si ya terminó la inicialización
      setUser(null);
      setIsAuthenticated(false);
      console.log('❌ Usuario no autenticado - inicialización completada');
    } else if (userType && !studentProfileData?.data && !staffProfileData?.data && !studentProfileError && !staffProfileError) {
      console.log('⏳ Esperando datos del perfil de usuario...');
    }
  }, [userType, studentProfileData, staffProfileData, studentsData, isInitializing, studentProfileError, staffProfileError, instance]);

  const logout = () => {
    console.log('🚪 Cerrando sesión para tipo:', userType);
    if (userType === 'student') {
      instance.logoutPopup({
        postLogoutRedirectUri: '/',
        mainWindowRedirectUri: '/'
      });
    } else if (userType === 'staff') {
      localStorage.removeItem('staff_session');
      // Forzar re-evaluación después de eliminar la sesión
      setTimeout(triggerRecheck, 100);
      window.location.href = '/';
    }
    setUser(null);
    setIsAuthenticated(false);
    setUserType(null);
    setHasCheckedInitialAuth(false);
    setIsInitializing(true);
  };

  const contextValue: AuthContext = {
    userType,
    isAuthenticated,
    user,
    logout,
    isLoading: isInitializing || 
               inProgress !== "none" || 
               !hasCheckedInitialAuth ||
               (userType === 'student' && (studentProfileLoading || (!studentProfileData?.data && !studentProfileError))) ||
               (userType === 'staff' && staffProfileLoading),
  };

  // Log del estado de loading para debug
  console.log('🔍 AuthContext - Estado de loading:', {
    isInitializing,
    inProgress,
    hasCheckedInitialAuth,
    userType,
    studentProfileLoading: userType === 'student' ? studentProfileLoading : 'N/A',
    staffProfileLoading: userType === 'staff' ? staffProfileLoading : 'N/A',
    hasStaffProfileData: userType === 'staff' ? !!staffProfileData?.data : 'N/A',
    hasStaffProfileError: userType === 'staff' ? !!staffProfileError : 'N/A',
    shouldWaitForStaffProfile: userType === 'staff' && (staffProfileLoading || (!staffProfileData?.data && !staffProfileError)),
    finalIsLoading: contextValue.isLoading,
    isAuthenticated
  });

  return (
    <AuthenticationContext.Provider value={contextValue}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuth = (): AuthContext => {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}; 