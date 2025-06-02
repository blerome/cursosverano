import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../auth/msalConfig';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap, 
  faUserTie, 
  faBuilding,
  faEnvelope,
  faLock,
  faSignInAlt,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import StaffLogin from '../components/auth/StaffLogin';
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const [selectedLoginType, setSelectedLoginType] = useState<'student' | 'staff' | null>(null);

  const handleStudentLogin = async () => {
    try {
      await instance.loginPopup(loginRequest);
      navigate('/my-courses');
    } catch (error) {
      console.error('Error en login de estudiante:', error);
    }
  };

  const handleBackToSelection = () => {
    setSelectedLoginType(null);
  };

  const handleStaffLoginSuccess = () => {
    navigate('/admin/dashboard');
  };

  if (selectedLoginType === 'staff') {
    return (
      <div className={styles.loginPage}>
        <div className={styles.container}>
          <div className={styles.loginCard}>
            <div className={styles.backButton} onClick={handleBackToSelection}>
              <FontAwesomeIcon icon={faArrowLeft} />
              Volver a opciones
            </div>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                <FontAwesomeIcon icon={faUserTie} className={styles.headerIcon} />
              </div>
              <h2 className={styles.cardTitle}>Personal ITC</h2>
              <p className={styles.cardSubtitle}>
                Acceso para administradores y docentes
              </p>
            </div>
            <StaffLogin onSuccess={handleStaffLoginSuccess} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.container}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>
            Bienvenido al Portal ITC
          </h1>
          <p className={styles.welcomeSubtitle}>
            Selecciona tu tipo de usuario para continuar
          </p>
        </div>

        <div className={styles.loginOptions}>
          {/* Opción para Estudiantes */}
          <div 
            className={`${styles.loginOption} ${styles.studentOption}`}
            onClick={() => setSelectedLoginType('student')}
          >
            <div className={styles.optionIcon}>
              <FontAwesomeIcon icon={faGraduationCap} />
            </div>
            <div className={styles.optionContent}>
              <h3 className={styles.optionTitle}>Estudiantes</h3>
              <p className={styles.optionDescription}>
                Inicia sesión con tu correo institucional
              </p>
              <div className={styles.optionMethod}>
                <FontAwesomeIcon icon={faBuilding} className={styles.methodIcon} />
                <span>Microsoft 365</span>
              </div>
            </div>
            <div className={styles.optionArrow}>
              <FontAwesomeIcon icon={faSignInAlt} />
            </div>
          </div>

          {/* Opción para Personal */}
          <div 
            className={`${styles.loginOption} ${styles.staffOption}`}
            onClick={() => setSelectedLoginType('staff')}
          >
            <div className={styles.optionIcon}>
              <FontAwesomeIcon icon={faUserTie} />
            </div>
            <div className={styles.optionContent}>
              <h3 className={styles.optionTitle}>Personal</h3>
              <p className={styles.optionDescription}>
                Administradores y docentes
              </p>
              <div className={styles.optionMethod}>
                <FontAwesomeIcon icon={faEnvelope} className={styles.methodIcon} />
                <span>Correo y contraseña</span>
              </div>
            </div>
            <div className={styles.optionArrow}>
              <FontAwesomeIcon icon={faSignInAlt} />
            </div>
          </div>
        </div>

        {/* Modal para login de estudiante */}
        {selectedLoginType === 'student' && (
          <div className={styles.modal} onClick={handleBackToSelection}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <div className={styles.modalIcon}>
                  <FontAwesomeIcon icon={faGraduationCap} />
                </div>
                <h3 className={styles.modalTitle}>Iniciar Sesión - Estudiantes</h3>
                <p className={styles.modalDescription}>
                  Serás redirigido a Microsoft 365 para autenticarte con tu correo institucional
                </p>
              </div>
              <div className={styles.modalActions}>
                <button 
                  className={styles.modalCancelButton}
                  onClick={handleBackToSelection}
                >
                  Cancelar
                </button>
                <button 
                  className={styles.modalConfirmButton}
                  onClick={handleStudentLogin}
                >
                  <FontAwesomeIcon icon={faBuilding} />
                  Continuar con Microsoft
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.helpSection}>
          <p className={styles.helpText}>
            ¿Problemas para acceder? <br />
            Contacta al soporte técnico: soporte@itcancun.edu.mx
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 