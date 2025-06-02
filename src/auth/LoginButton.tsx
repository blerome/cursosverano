import { Link } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";

export const LoginButton = () => {
  return (
    <Link to="/login" className="menu-link">
      <FaUserPlus className="icon" /> 
      <span>Iniciar sesión</span>
    </Link>
  );
};