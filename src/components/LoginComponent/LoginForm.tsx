import { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaTimes } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  const toggleForm = (): void => {
    setIsActive(!isActive);
  };

  const handleLoginSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    console.log('Login submitted');
  };

  const handleRegisterSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    console.log('Register submitted');
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.container} ${isActive ? styles.active : ''}`}>
        {/* Botón para cerrar el modal - FUNCIONAL */}
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>

        {/* Formulario de Login */}
        <div className={`${styles.formBox} ${styles.login}`}>
          <form className={styles.form} onSubmit={handleLoginSubmit}>
            <h1>Login</h1>
            <div className={styles.inputBox}>
              <input 
                type="text" 
                placeholder="Usuario" 
                required 
              />
              <FaUser className={styles.icon} />
            </div>
            <div className={styles.inputBox}>
              <input 
                type="password" 
                placeholder="Contraseña" 
                required 
              />
              <FaLock className={styles.icon} />
            </div>
            <div className={styles.forgotLink}>
              <a href="#">¿Olvidaste la contraseña?</a>
            </div>
            <button type="submit" className={styles.btn}>
              Iniciar Sesión
            </button>
            <div className={styles.socialText}>
              <p>o regístrate a través de</p>
            </div>
            <div className={styles.socialIcons}>
              <a href="#" className={styles.socialIcon}><FcGoogle /></a>
              <a href="#" className={styles.socialIcon}><FaFacebook className={styles.facebookIcon} /></a>
            </div>
          </form>
        </div>

        {/* Formulario de Registro - POSICIONADO CORRECTAMENTE */}
        <div className={`${styles.formBox} ${styles.register}`}>
          <form className={styles.form} onSubmit={handleRegisterSubmit}>
            <h1>Registro</h1>
            <div className={styles.inputBox}>
              <input 
                type="text" 
                placeholder="Usuario" 
                required 
              />
              <FaUser className={styles.icon} />
            </div>
            <div className={styles.inputBox}>
              <input 
                type="email" 
                placeholder="Correo Electrónico" 
                required 
              />
              <FaEnvelope className={styles.icon} />
            </div>
            <div className={styles.inputBox}>
              <input 
                type="password" 
                placeholder="Contraseña" 
                required 
              />
              <FaLock className={styles.icon} />
            </div>
            <button type="submit" className={styles.btn}>
              Registrarse
            </button>
            <div className={styles.socialText}>
              <p>o regístrate a través de otras plataformas</p>
            </div>
            <div className={styles.socialIcons}>
              <a href="#" className={styles.socialIcon}><FcGoogle /></a>
              <a href="#" className={styles.socialIcon}><FaFacebook className={styles.facebookIcon} /></a>
            </div>
          </form>
        </div>

        {/* Paneles de alternancia - AJUSTADOS */}
        <div className={styles.toggleBox}>
          <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
            <h1>¡Bienvenido!</h1>
            <p>¿No tienes una cuenta?</p>
            <button 
              className={`${styles.btn} ${styles.toggleBtn}`} 
              onClick={toggleForm}
            >
              Registrarse
            </button>
          </div>

          <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
            <h1>¡Bienvenido de Vuelta!</h1>
            <p>¿Ya estás registrado?</p>
            <button 
              className={`${styles.btn} ${styles.toggleBtn}`} 
              onClick={toggleForm}
            >
              Iniciar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;