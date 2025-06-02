import { PublicClientApplication, Configuration, BrowserCacheLocation } from "@azure/msal-browser";
import { config } from "../common";

export const msalConfig: Configuration = {
  auth: {
    clientId: config.clientId, 
    authority: `https://login.microsoftonline.com/${config.tenantId}`,
    redirectUri: "http://localhost:5173/profile",
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        console.log(`[MSAL] ${message}`);
      },
      piiLoggingEnabled: false,
      logLevel: 3,
    },
  },
};

export const loginRequest = {
  scopes: [ `api://${config.apiClientId}/Scope.Any`],
};

export const msalInstance = new PublicClientApplication(msalConfig);

// // Inicializar MSAL explícitamente
// msalInstance.initialize().then(() => {
//   // Manejar respuesta de redirección si existe
//   return msalInstance.handleRedirectPromise();
// }).then((response) => {
//   if (response) {
//     console.log('✅ MSAL: Respuesta de redirección manejada:', response);
//   } else {
//     console.log('ℹ️ MSAL: No hay respuesta de redirección pendiente');
//   }
//   console.log('ℹ️ MSAL: Cuentas disponibles:', msalInstance.getAllAccounts().length);
// }).catch((error) => {
//   console.error('❌ MSAL: Error durante la inicialización:', error);
// });