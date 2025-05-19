// src/components/LogoutButton.tsx
import { useMsal } from '@azure/msal-react';
export const LogoutButton = () => {
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: '/', // Redirige al home
      mainWindowRedirectUri: '/' // Cierra ventanas emergentes
    });
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      <svg className="logout-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2"/>
        <path d="M21 12H9" stroke="currentColor" strokeWidth="2"/>
      </svg>
      <span className="logout-text">Cerrar sesión</span>
    </button>
  );
};