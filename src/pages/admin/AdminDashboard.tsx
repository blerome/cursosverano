import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine,
  faUsers,
  faGraduationCap,
  faChalkboardTeacher,
  faBuilding,
  faClipboardCheck,
  faUserTimes,
  faExchangeAlt,
  faUserCheck,
  faBan,
  faEye,
  faPlus,
  faFilter,
  faSearch,
  faExclamationTriangle,
  faCalendarAlt,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { useGetClasses } from '../../generated/api/classes/classes';
import { useAuth } from '../../contexts/AuthContext';
import ClassApprovalSection from './components/ClassApprovalSection';
import type { ClassData } from '../../types/class.types';
import styles from './AdminDashboard.module.css';

type DashboardSection = 'overview' | 'class-approval' | 'student-management' | 'classroom-assignment' | 'teacher-management';

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const { user, logout } = useAuth();

  // Obtener datos para el overview
  const { data: classesData, isLoading: classesLoading } = useGetClasses({
    page: 1,
    pageSize: 100
  });

  const classes: ClassData[] = classesData?.data?.data || [];

  // Calcular estadísticas
  const stats = {
    totalClasses: classes.length,
    pendingClasses: classes.filter((c: ClassData) => c.status === 'pendiente').length,
    activeClasses: classes.filter((c: ClassData) => c.status === 'active').length,
    enrolledStudents: classes.reduce((acc: number, c: ClassData) => acc + (c.enrrolled || 0), 0),
  };

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    {
      id: 'overview' as DashboardSection,
      title: 'Resumen General',
      icon: faChartLine,
      description: 'Vista general del sistema'
    },
    {
      id: 'class-approval' as DashboardSection,
      title: 'Aprobar Clases',
      icon: faClipboardCheck,
      description: 'Aprobar o rechazar clases creadas por estudiantes',
      badge: stats.pendingClasses
    },
    {
      id: 'student-management' as DashboardSection,
      title: 'Gestión de Estudiantes',
      icon: faUsers,
      description: 'Ver y gestionar estudiantes por clase'
    },
    {
      id: 'classroom-assignment' as DashboardSection,
      title: 'Asignar Salones',
      icon: faBuilding,
      description: 'Asignar aulas a las clases'
    },
    {
      id: 'teacher-management' as DashboardSection,
      title: 'Gestión de Profesores',
      icon: faChalkboardTeacher,
      description: 'Asignar profesores y aprobar solicitudes'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className={styles.overviewSection}>
            <h2>Resumen General del Sistema</h2>
            
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FontAwesomeIcon icon={faGraduationCap} />
                </div>
                <div className={styles.statContent}>
                  <h3>{stats.totalClasses}</h3>
                  <p>Total de Clases</p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FontAwesomeIcon icon={faClipboardCheck} />
                </div>
                <div className={styles.statContent}>
                  <h3>{stats.pendingClasses}</h3>
                  <p>Clases Pendientes</p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FontAwesomeIcon icon={faUserCheck} />
                </div>
                <div className={styles.statContent}>
                  <h3>{stats.activeClasses}</h3>
                  <p>Clases Activas</p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <div className={styles.statContent}>
                  <h3>{stats.enrolledStudents}</h3>
                  <p>Inscripciones Totales</p>
                </div>
              </div>
            </div>

            <div className={styles.quickActions}>
              <h3>Acciones Rápidas</h3>
              <div className={styles.actionButtons}>
                <button 
                  onClick={() => setActiveSection('class-approval')}
                  className={styles.actionButton}
                  disabled={stats.pendingClasses === 0}
                >
                  <FontAwesomeIcon icon={faClipboardCheck} />
                  Revisar Clases Pendientes
                  {stats.pendingClasses > 0 && (
                    <span className={styles.badge}>{stats.pendingClasses}</span>
                  )}
                </button>

                <button 
                  onClick={() => setActiveSection('student-management')}
                  className={styles.actionButton}
                >
                  <FontAwesomeIcon icon={faUsers} />
                  Gestionar Estudiantes
                </button>

                <button 
                  onClick={() => setActiveSection('classroom-assignment')}
                  className={styles.actionButton}
                >
                  <FontAwesomeIcon icon={faBuilding} />
                  Asignar Salones
                </button>

                <button 
                  onClick={() => setActiveSection('teacher-management')}
                  className={styles.actionButton}
                >
                  <FontAwesomeIcon icon={faChalkboardTeacher} />
                  Gestionar Profesores
                </button>
              </div>
            </div>
          </div>
        );

      case 'class-approval':
        return <ClassApprovalSection />;

      case 'student-management':
        return (
          <div className={styles.sectionPlaceholder}>
            <h2>Gestión de Estudiantes</h2>
            <p>Funcionalidad en desarrollo...</p>
          </div>
        );

      case 'classroom-assignment':
        return (
          <div className={styles.sectionPlaceholder}>
            <h2>Asignar Salones</h2>
            <p>Funcionalidad en desarrollo...</p>
          </div>
        );

      case 'teacher-management':
        return (
          <div className={styles.sectionPlaceholder}>
            <h2>Gestión de Profesores</h2>
            <p>Funcionalidad en desarrollo...</p>
          </div>
        );

      default:
        return null;
    }
  };

  if (classesLoading) {
    return (
      <div className={styles.loadingContainer}>
        <FontAwesomeIcon icon={faChartLine} spin />
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.adminDashboard}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <h1>Panel de Administración</h1>
        <p>Gestiona clases, estudiantes, profesores y recursos del sistema</p>
      </div>

      <div className={styles.dashboardContent}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <nav className={styles.sidebarNav}>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`${styles.navItem} ${activeSection === item.id ? styles.active : ''}`}
              >
                <div className={styles.navIcon}>
                  <FontAwesomeIcon icon={item.icon} />
                  {item.badge && item.badge > 0 && (
                    <span className={styles.navBadge}>{item.badge}</span>
                  )}
                </div>
                <div className={styles.navContent}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </button>
            ))}
          </nav>
          <div className={styles.sidebarFooter}>
            <button 
              onClick={handleLogout}
              className={styles.logoutButton}
              title="Cerrar sesión y volver al inicio"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              <div>
                <h4>Cerrar Sesión</h4>
                <p>Salir del panel de administración</p>
              </div>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 