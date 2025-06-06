import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck,
  faTimes,
  faEye,
  faUser,
  faGraduationCap,
  faCalendarAlt,
  faClock,
  faExclamationTriangle,
  faSpinner,
  faFilter,
  faSearch,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { useGetClasses, usePostClassesIdStatusStatus } from '../../../generated/api/classes/classes';
import { usePopup } from '../../../hooks/usePopup';
import ErrorPopup from '../../../components/UI/ErrorPopup';
import type { ClassResponseDto } from '../../../generated/model';
import styles from './ClassApprovalSection.module.css';

// Opciones de filtro por estado
const statusOptions = [
  { value: 'pendiente' as const, label: 'Pendientes', icon: faClock },
  { value: 'aprobado' as const, label: 'Aprobadas', icon: faCheck },
  { value: 'rechazado' as const, label: 'Rechazadas', icon: faTimes },
  { value: 'all' as const, label: 'Todas', icon: faFilter },
];

interface ClassApprovalModalProps {
  classData: ClassResponseDto | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (classId: number, reason?: string) => void;
  onReject: (classId: number, reason: string) => void;
}

const ClassApprovalModal: React.FC<ClassApprovalModalProps> = ({
  classData,
  isOpen,
  onClose,
  onApprove,
  onReject
}) => {
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !classData) return null;

  const handleSubmit = async () => {
    if (action === 'approve') {
      setIsSubmitting(true);
      await onApprove(classData.id_class, reason || undefined);
      setIsSubmitting(false);
    } else if (action === 'reject') {
      if (!reason.trim()) {
        alert('Debes proporcionar una razón para rechazar la clase');
        return;
      }
      setIsSubmitting(true);
      await onReject(classData.id_class, reason);
      setIsSubmitting(false);
    }
    setAction(null);
    setReason('');
  };

  const formatSchedules = () => {
    if (!classData.Schedules || classData.Schedules.length === 0) {
      return 'No definido';
    }

    return classData.Schedules.map(schedule => 
      `${schedule.Days.name}: ${schedule.start_time.slice(0, 5)} - ${schedule.end_time.slice(0, 5)}`
    ).join(', ');
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Revisar Clase</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className={styles.classDetails}>
          <div className={styles.detailRow}>
            <strong>Materia:</strong>
            <span>{classData.Subjects?.name || 'No disponible'}</span>
          </div>
          <div className={styles.detailRow}>
            <strong>Clave:</strong>
            <span>{classData.Subjects?.clave || 'No disponible'}</span>
          </div>
          <div className={styles.detailRow}>
            <strong>Créditos:</strong>
            <span>{classData.Subjects?.credits || 'No disponible'}</span>
          </div>
          <div className={styles.detailRow}>
            <strong>Horarios:</strong>
            <span>{formatSchedules()}</span>
          </div>
          <div className={styles.detailRow}>
            <strong>Estudiantes inscritos:</strong>
            <span>{classData.enrrolled} / {classData.max_students}</span>
          </div>
          {classData.description && (
            <div className={styles.detailRow}>
              <strong>Descripción:</strong>
              <span>{classData.description}</span>
            </div>
          )}
        </div>

        {!action && (
          <div className={styles.actionButtons}>
            <button 
              onClick={() => setAction('approve')}
              className={`${styles.actionButton} ${styles.approveButton}`}
            >
              <FontAwesomeIcon icon={faCheck} />
              Aprobar Clase
            </button>
            <button 
              onClick={() => setAction('reject')}
              className={`${styles.actionButton} ${styles.rejectButton}`}
            >
              <FontAwesomeIcon icon={faTimes} />
              Rechazar Clase
            </button>
          </div>
        )}

        {action && (
          <div className={styles.reasonSection}>
            <h3>{action === 'approve' ? 'Aprobar Clase' : 'Rechazar Clase'}</h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                action === 'approve' 
                  ? 'Comentarios adicionales (opcional)...'
                  : 'Explica la razón del rechazo (requerido)...'
              }
              className={styles.reasonTextarea}
              rows={4}
            />
            <div className={styles.confirmButtons}>
              <button onClick={() => setAction(null)} className={styles.cancelButton}>
                Cancelar
              </button>
              <button 
                onClick={handleSubmit}
                className={action === 'approve' ? styles.confirmApprove : styles.confirmReject}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    {action === 'approve' ? 'Aprobando...' : 'Rechazando...'}
                  </>
                ) : (
                  action === 'approve' ? 'Confirmar Aprobación' : 'Confirmar Rechazo'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ClassApprovalSection: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<ClassResponseDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pendiente' | 'aprobado' | 'rechazado'>('pendiente');
  const [filterPeriod, setFilterPeriod] = useState<number>(0); // 0 = todos los periodos
  const [searchTerm, setSearchTerm] = useState('');

  const { popup, showError, showSuccess, hidePopup } = usePopup();

  // Años académicos disponibles para filtros
  const ACADEMIC_YEARS = [2024, 2025, 2026, 2027, 2028];

  // Paginación desde backend
  const [currentPage, setCurrentPage] = useState(1);
  const classesPerPage = 6;

  // Construir los parámetros para el backend
  const params: any = {
    page: currentPage,
    pageSize: classesPerPage,
  };
  if (filterPeriod > 0) params.period = filterPeriod;
  if (filterStatus !== 'all') params.status = filterStatus;
  if (searchTerm.trim()) params.search = searchTerm.trim();

  const { data: classesData, isLoading, error, refetch } = useGetClasses(params);
  const classes: ClassResponseDto[] = classesData?.data?.data || [];
  const meta = classesData?.data?.meta || { total: 0, page: 1, pageSize: classesPerPage, totalPages: 1 };

  // Reiniciar página si cambia el total de páginas (por ejemplo, tras filtrar)
  React.useEffect(() => {
    if (currentPage > meta.totalPages) {
      setCurrentPage(1);
    }
  }, [meta.totalPages]);

  // Cambiar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Hook para cambiar status de clase
  const changeStatusMutation = usePostClassesIdStatusStatus();

  const handleViewClass = (classData: ClassResponseDto) => {
    setSelectedClass(classData);
    setIsModalOpen(true);
  };

  const handleApprove = async (classId: number, reason?: string) => {
    try {
      await changeStatusMutation.mutateAsync({
        id: classId,
        status: 'aprobado'
      });
      showSuccess('Clase Aprobada', 'La clase ha sido aprobada exitosamente');
      refetch();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Error al aprobar clase:', error);
      const errorMessage = error?.response?.data?.message || 'No se pudo aprobar la clase';
      showError('Error', errorMessage);
    }
  };

  const handleReject = async (classId: number, reason: string) => {
    try {
      await changeStatusMutation.mutateAsync({
        id: classId,
        status: 'rechazado'
      });
      showSuccess('Clase Rechazada', 'La clase ha sido rechazada');
      refetch();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Error al rechazar clase:', error);
      const errorMessage = error?.response?.data?.message || 'No se pudo rechazar la clase';
      showError('Error', errorMessage);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendiente':
        return <span className={`${styles.statusBadge} ${styles.pending}`}>Pendiente</span>;
      case 'aprobado':
        return <span className={`${styles.statusBadge} ${styles.approved}`}>Aprobado</span>;
      case 'rechazado':
        return <span className={`${styles.statusBadge} ${styles.rejected}`}>Rechazado</span>;
      case 'active':
        return <span className={`${styles.statusBadge} ${styles.active}`}>Activa</span>;
      case 'cancelled':
        return <span className={`${styles.statusBadge} ${styles.cancelled}`}>Cancelada</span>;
      default:
        return <span className={`${styles.statusBadge} ${styles.unknown}`}>Desconocido</span>;
    }
  };

  const handleStatusChange = (status: typeof filterStatus) => {
    setFilterStatus(status);
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterPeriod(parseInt(e.target.value));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <FontAwesomeIcon icon={faSpinner} spin />
        <p>Cargando clases...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <FontAwesomeIcon icon={faExclamationTriangle} />
        <h3>Error al cargar clases</h3>
        <p>No se pudieron cargar las clases. Intenta nuevamente.</p>
        <button onClick={() => refetch()} className={styles.retryButton}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.approvalSection}>
      <div className={styles.sectionHeader}>
        <h2>Aprobación de Clases</h2>
        <p>Revisa y aprueba o rechaza las clases creadas por estudiantes</p>
      </div>

      <div className={styles.filtersSection}>
        <div className={styles.filterRow}>
          {/* Filtro por estado */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Estado:</label>
            <div className={styles.statusFilters}>
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  className={`${styles.filterButton} ${
                    filterStatus === status.value ? styles.filterButtonActive : ''
                  }`}
                >
                  <FontAwesomeIcon icon={status.icon} />
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por periodo */}
          <div className={styles.filterGroup}>
            <label htmlFor="periodFilter" className={styles.filterLabel}>
              Año Académico:
            </label>
            <select
              id="periodFilter"
              value={filterPeriod}
              onChange={handlePeriodChange}
              className={styles.filterSelect}
            >
              <option value={0}>Todos los años</option>
              {ACADEMIC_YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Búsqueda */}
        <div className={styles.searchSection}>
          <div className={styles.searchGroup}>
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por clave o nombre de materia..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      <div className={styles.classesGrid}>
        {classes.length === 0 ? (
          <div className={styles.emptyState}>
            <FontAwesomeIcon icon={faGraduationCap} />
            <h3>No hay clases para revisar</h3>
            <p>No se encontraron clases que coincidan con los filtros seleccionados.</p>
          </div>
        ) :
          classes.map((classItem: ClassResponseDto) => (
            <div key={classItem.id_class} className={styles.classCard}>
              <div className={styles.cardHeader}>
                <h3>{classItem.Subjects?.name || 'Materia no disponible'}</h3>
                {getStatusBadge(classItem.status)}
              </div>

              <div className={styles.cardContent}>
                <div className={styles.cardDetail}>
                  <FontAwesomeIcon icon={faGraduationCap} />
                  <span>{classItem.Subjects?.clave || 'N/A'}</span>
                </div>
                <div className={styles.cardDetail}>
                  <FontAwesomeIcon icon={faUser} />
                  <span>{classItem.enrrolled} / {classItem.max_students} estudiantes</span>
                </div>
                <div className={styles.cardDetail}>
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>{classItem.Schedules?.length || 0} horarios</span>
                </div>
              </div>

              <div className={styles.cardActions}>
                <button
                  onClick={() => handleViewClass(classItem)}
                  className={styles.viewButton}
                >
                  <FontAwesomeIcon icon={faEye} />
                  Revisar
                </button>
              </div>
            </div>
          ))
        }
      </div>

      {/* Controles de paginación */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ marginRight: 12, padding: '8px 16px', borderRadius: 8, border: '1px solid #b3d6f6', background: currentPage === 1 ? '#f0f0f0' : '#e3f2fd', color: '#1976d2', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
        >
          Anterior
        </button>
        <span style={{ alignSelf: 'center', fontWeight: 600, color: '#1976d2' }}>
          Página {meta.page} de {meta.totalPages || 1}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === (meta.totalPages || 1)}
          style={{ marginLeft: 12, padding: '8px 16px', borderRadius: 8, border: '1px solid #b3d6f6', background: currentPage === (meta.totalPages || 1) ? '#f0f0f0' : '#e3f2fd', color: '#1976d2', cursor: currentPage === (meta.totalPages || 1) ? 'not-allowed' : 'pointer' }}
        >
          Siguiente
        </button>
      </div>

      <ClassApprovalModal
        classData={selectedClass}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <ErrorPopup
        isOpen={popup.isOpen}
        onClose={hidePopup}
        title={popup.title}
        message={popup.message}
        type={popup.type}
      />
    </div>
  );
};

export default ClassApprovalSection; 