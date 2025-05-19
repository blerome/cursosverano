import { PublicClientApplication, Configuration } from "@azure/msal-browser";

// Configuración de MSAL 
export const msalConfig: Configuration = {
  auth: {
    clientId: "8211b029-c21b-4ded-9778-19dfc8726de0", // CORRECTO: Usa el Application (client) ID 
    authority: "https://login.microsoftonline.com/74d8aa24-096e-4f44-a8a9-6c296d1991bb", // CAMBIO: Se reemplazó el Tenant ID incorrecto por el válido "74d8aa24-096e-4f44-a8a9-6c296d1991bb"
    redirectUri: "http://localhost:5173", // CORRECTO: Asegúrate de que esté registrado en Azure AD como tipo "SPA"
  },
  cache: {
    cacheLocation: "sessionStorage", // CORRECTO: Configuración óptima para SPA
  },
};

// Solicitud de login (scopes) - SIN CAMBIOS (configuración correcta)
export const loginRequest = {
  scopes: ["openid", "profile", "User.Read"], // Permisos básicos para autenticación
};

// Instancia de MSAL 
export const msalInstance = new PublicClientApplication(msalConfig);