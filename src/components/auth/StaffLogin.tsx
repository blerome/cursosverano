import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostAuthStaffLogin } from '../../generated/api/auth/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSignInAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import type { StaffLoginCredentials, StaffSession } from '../../types/auth.types';
import styles from './StaffLogin.module.css';

interface StaffLoginProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const StaffLogin: React.FC<StaffLoginProps> = ({ onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<StaffLoginCredentials>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const staffLoginMutation = usePostAuthStaffLogin();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) {
      setError(null);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setError('Todos los campos son obligatorios');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, ingresa un email válido');
      return false;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await staffLoginMutation.mutateAsync({
        data: formData,
      });

      // Guardar sesión en localStorage
      const session: StaffSession = {
        token: response.data.access_token,
        user: {
          type: 'staff',
          id: response.data.user.id_user,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role?.name === 'admin' ? 'admin' : 'teacher',
          isActive: true, // Valor por defecto ya que no viene en la respuesta de login
        },
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 horas
      };

      console.log('🔍 Staff Login - Datos recibidos:', {
        originalRole: response.data.user.role,
        convertedRole: response.data.user.role?.name === 'admin' ? 'admin' : 'teacher',
        userData: response.data.user
      });

      localStorage.setItem('staff_session', JSON.stringify(session));

      console.log('✅ Sesión guardada en localStorage:', session);

      // Disparar evento personalizado para notificar al AuthContext inmediatamente
      window.dispatchEvent(new CustomEvent('staffSessionChanged', { 
        detail: { action: 'login', session } 
      }));

      // Mostrar estado de redirección
      setIsRedirecting(true);

      // Dar tiempo al contexto para actualizarse antes de redirigir
      setTimeout(() => {
        // Ejecutar callback de éxito
        if (onSuccess) {
          onSuccess();
        } else {
          // Redireccionar por defecto basado en el rol
          const targetPath = session.user.role === 'admin' ? '/admin/dashboard' : '/staff/profile';
          console.log(`🔄 Redirigiendo a: ${targetPath}`);
          navigate(targetPath, { replace: true });
        }
      }, 500); // Reducido de 1000ms a 500ms
    } catch (error: any) {
      console.error('Error en login de staff:', error);
      if (error.response?.status === 401) {
        setError('Email o contraseña incorrectos');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Error de conexión. Por favor, intenta nuevamente.');
      }
    }
  };

  return (
    <div className={styles.staffLoginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <FontAwesomeIcon icon={faSignInAlt} className={styles.loginIcon} />
          <h2>Acceso Personal</h2>
          <p>Administradores y Maestros</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              Email Institucional
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={styles.formInput}
              placeholder="ejemplo@itcancun.edu.mx"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Contraseña
            </label>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={styles.formInput}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.passwordToggle}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.loginButton}
              disabled={staffLoginMutation.isPending || isRedirecting}
            >
              {isRedirecting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Accediendo al sistema...
                </>
              ) : staffLoginMutation.isPending ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSignInAlt} />
                  Iniciar Sesión
                </>
              )}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className={styles.cancelButton}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className={styles.loginFooter}>
          <p>¿Problemas para acceder? Contacta al administrador del sistema.</p>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin; 