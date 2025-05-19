import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../auth/msalConfig";
import { FaUserPlus } from "react-icons/fa";


export const LoginButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch((error) => console.error(error));
  };

  return (
    <a href="#" onClick={handleLogin} className="menu-link">
      <FaUserPlus className="icon" /> 
      <span>Iniciar sesión</span>
    </a>
  );
};