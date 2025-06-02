import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import styles from './DiagnosticPage.module.css';

const DiagnosticPage: React.FC = () => {
  const { user, userType, isAuthenticated } = useAuth();

  return (
    <div className={styles.diagnosticContainer}>
      <div className={styles.diagnosticCard}>
        <h1 className={styles.title}>Página de Diagnóstico</h1>
        <p className={styles.subtitle}>Información del sistema y estado de la aplicación</p>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Estado de Autenticación</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>¿Autenticado?:</span>
              <span className={`${styles.value} ${isAuthenticated ? styles.success : styles.error}`}>
                {isAuthenticated ? '✅ Sí' : '❌ No'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Tipo de Usuario:</span>
              <span className={styles.value}>
                {userType || 'No definido'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Nombre de Usuario:</span>
              <span className={styles.value}>
                {user?.name || 'No disponible'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>
                {user?.email || 'No disponible'}
              </span>
            </div>
          </div>
        </div>

        {user?.type === 'student' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Información de Estudiante</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>ID de Usuario:</span>
                <span className={styles.value}>{user.id_user}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Apellidos:</span>
                <span className={styles.value}>
                  {user.paternal_surname} {user.maternal_surname}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>OID (Microsoft):</span>
                <span className={styles.value}>{user.oid}</span>
              </div>
              {user.studentData && (
                <>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Número de Control:</span>
                    <span className={styles.value}>{user.studentData.control_number}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Carrera:</span>
                    <span className={styles.value}>{user.studentData.career}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Teléfono:</span>
                    <span className={styles.value}>{user.studentData.phone}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {user?.type === 'staff' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Información de Personal</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>ID:</span>
                <span className={styles.value}>{user.id}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Rol:</span>
                <span className={styles.value}>{user.role}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Estado:</span>
                <span className={`${styles.value} ${user.isActive ? styles.success : styles.error}`}>
                  {user.isActive ? '✅ Activo' : '❌ Inactivo'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Información del Sistema</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Versión de React:</span>
              <span className={styles.value}>{React.version}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Timestamp:</span>
              <span className={styles.value}>{new Date().toLocaleString()}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>User Agent:</span>
              <span className={styles.value} title={navigator.userAgent}>
                {navigator.userAgent.substring(0, 50)}...
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPage; 