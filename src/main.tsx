import ReactDOM from 'react-dom/client'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './auth/msalConfig'; 
import App from './App'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
        <MsalProvider instance={msalInstance}>
      <App />
      </MsalProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
