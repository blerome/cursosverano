interface Config {
  tenantId: string;
  clientId: string;
  apiClientId: string;
  baseUrl: string;
}

function getConfig(): Config {
  const clientId = import.meta.env.VITE_CLIENT_ID || 'default-client-id';
  const tenantId = import.meta.env.VITE_TENANT_ID || 'default-tenant-id';
  const apiClientId = import.meta.env.VITE_API_CLIENT_ID || 'default-api-client-id';
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Solo mostrar advertencias en desarrollo si las variables no están definidas
  if (import.meta.env.DEV) {
    if (!import.meta.env.VITE_CLIENT_ID) {
      console.warn('⚠️ Variable de entorno VITE_CLIENT_ID no definida, usando valor por defecto');
    }
    if (!import.meta.env.VITE_TENANT_ID) {
      console.warn('⚠️ Variable de entorno VITE_TENANT_ID no definida, usando valor por defecto');
    }
    if (!import.meta.env.VITE_API_CLIENT_ID) {
      console.warn('⚠️ Variable de entorno VITE_API_CLIENT_ID no definida, usando valor por defecto');
    }
    if (!import.meta.env.VITE_API_URL) {
      console.warn('⚠️ Variable de entorno VITE_API_URL no definida, usando valor por defecto');
    }
  }

  return {
    clientId,
    tenantId,
    apiClientId,
    baseUrl,
  };
}

export const config = getConfig();
