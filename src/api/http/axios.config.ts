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

axiosInstance.interceptors.request.use(
  async (config) => {
    const accounts= msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      try {
        const response = await msalInstance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        });
        config.headers.Authorization = `Bearer ${response.accessToken}`;
      } catch (error) {
        throw new AuthError('Error al obtener token MSAL')
      }
      return config;
    }
    throw new AuthError('Error al obtener token MSAL')
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export { axiosInstance };