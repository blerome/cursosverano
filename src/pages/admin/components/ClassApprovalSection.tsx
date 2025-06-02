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
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import { useGetClasses } from '../../../generated/api/classes/classes';
import { usePopup } from '../../../hooks/usePopup';
import ErrorPopup from '../../../components/UI/ErrorPopup';
import type { ClassData } from '../../../types/class.types';
import styles from './ClassApprovalSection.module.css';

interface ClassApprovalModalProps {
  classData: ClassData | null;
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

  if (!isOpen || !classData) return null;

  const handleSubmit = () => {
    if (action === 'approve') {
      onApprove(classData.id_class, reason || undefined);
    } else if (action === 'reject') {
      if (!reason.trim()) {
        alert('Debes proporcionar una razón para rechazar la clase');
        return;
      }
      onReject(classData.id_class, reason);
    }
    setAction(null);
    setReason('');
    onClose();
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
            <strong>Estudiantes máximo:</strong>
            <span>{classData.max_students}</span>
          </div>
          {classData.description && (
            <div className={styles.detailRow}>
              <strong>Descripción:</strong>
              <span>{classData.description}</span>
            </div>
          )}
          {classData.ResponsibleStudent && (
            <div className={styles.detailRow}>
              <strong>Estudiante responsable:</strong>
              <span>
                Control: {classData.ResponsibleStudent.control_number}
                {classData.ResponsibleStudent.student_phone && ` | Tel: ${classData.ResponsibleStudent.student_phone}`}
              </span>
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
              >
                {action === 'approve' ? 'Confirmar Aprobación' : 'Confirmar Rechazo'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ClassApprovalSection: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pendiente' | 'aprobado' | 'rechazado'>('pendiente');
  const [searchTerm, setSearchTerm] = useState('');

  const { popup, showError, showSuccess, hidePopup } = usePopup();

  const { data: classesData, isLoading, error, refetch } = useGetClasses({
    page: 1,
    pageSize: 100
  });

  const classes: ClassData[] = classesData?.data?.data || [];

  // Filtrar clases
  const filteredClasses = classes.filter((classItem: ClassData) => {
    const matchesStatus = filterStatus === 'all' || classItem.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      classItem.Subjects?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.Subjects?.clave?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const handleViewClass = (classData: ClassData) => {
    setSelectedClass(classData);
    setIsModalOpen(true);
  };

  const handleApprove = async (classId: number, reason?: string) => {
    try {
      // TODO: Implementar API call para aprobar clase
      console.log('Aprobar clase:', classId, reason);
      showSuccess('Clase Aprobada', 'La clase ha sido aprobada exitosamente');
      refetch();
    } catch (error) {
      showError('Error', 'No se pudo aprobar la clase');
    }
  };

  const handleReject = async (classId: number, reason: string) => {
    try {
      // TODO: Implementar API call para rechazar clase
      console.log('Rechazar clase:', classId, reason);
      showSuccess('Clase Rechazada', 'La clase ha sido rechazada');
      refetch();
    } catch (error) {
      showError('Error', 'No se pudo rechazar la clase');
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

      <div className={styles.filters}>
        <div className={styles.searchContainer}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por materia o clave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pendiente' | 'aprobado' | 'rechazado')}
          className={styles.statusFilter}
        >
          <option value="pendiente">Solo Pendientes</option>
          <option value="aprobado">Solo Aprobadas</option>
          <option value="rechazado">Solo Rechazadas</option>
          <option value="all">Todas las Clases</option>
        </select>
      </div>

      <div className={styles.classesGrid}>
        {filteredClasses.length === 0 ? (
          <div className={styles.emptyState}>
            <FontAwesomeIcon icon={faGraduationCap} />
            <h3>No hay clases para revisar</h3>
            <p>No se encontraron clases que coincidan con los filtros seleccionados.</p>
          </div>
        ) : (
          filteredClasses.map((classItem: ClassData) => (
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
                  <span>{classItem.max_students} estudiantes máx.</span>
                </div>
                <div className={styles.cardDetail}>
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>{classItem.Schedules?.length || 0} horarios</span>
                </div>
                {classItem.ResponsibleStudent && (
                  <div className={styles.cardDetail}>
                    <FontAwesomeIcon icon={faUser} />
                    <span>
                      Control: {classItem.ResponsibleStudent.control_number}
                    </span>
                  </div>
                )}
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
        )}
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