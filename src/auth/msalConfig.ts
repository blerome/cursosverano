import { PublicClientApplication, Configuration } from "@azure/msal-browser";
import { config } from "../common";

export const msalConfig: Configuration = {
  auth: {
    clientId: config.clientId, 
    authority: `https://login.microsoftonline.com/${config.tenantId}`,
    redirectUri: "http://localhost:5173/profile",
  },

};

export const loginRequest = {
  scopes: [ `api://${config.apiClientId}/Scope.Any`],
};

export const msalInstance = new PublicClientApplication(msalConfig);