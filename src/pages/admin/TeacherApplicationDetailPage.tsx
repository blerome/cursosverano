import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTeachersApplicationsId } from '../../generated/api/teachers/teachers';
import styles from './TeacherApplicationDetailPage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faEnvelope, faPhone, faFilePdf, faFileAlt, faCalendar, faExclamationTriangle, faEye } from '@fortawesome/free-solid-svg-icons';

const TeacherApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetTeachersApplicationsId(Number(id));
  const app = (data as any)?.data || {};
  const [previewError, setPreviewError] = React.useState(false);

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} className={styles.icon} /> Volver
      </button>
      <h2>Detalle de Solicitud de Profesor</h2>
      {isLoading && <div className={styles.loading}>Cargando detalles...</div>}
      {error && <div className={styles.error}>Error al cargar los detalles.</div>}
      {!isLoading && !error && app && (
        <div className={styles.detailLayout}>
          <div className={styles.detailCard}>
            <div className={styles.row}><strong><FontAwesomeIcon icon={faUser} className={styles.icon} />Nombre:</strong> {app.name} {app.paternal_surname} {app.maternal_surname || ''}</div>
            <div className={styles.row}><strong><FontAwesomeIcon icon={faEnvelope} className={styles.icon} />Correo:</strong> {app.contact_email}</div>
            <div className={styles.row}><strong><FontAwesomeIcon icon={faPhone} className={styles.icon} />Teléfono:</strong> {app.contact_phone}</div>
            <div className={styles.row}><strong><FontAwesomeIcon icon={faFileAlt} className={styles.icon} />Motivo:</strong> {app.reason || <span className={styles.empty}>No especificado</span>}</div>
            <div className={styles.row}><strong><FontAwesomeIcon icon={faCalendar} className={styles.icon} />Solicitado:</strong> {app.created_at ? new Date(app.created_at).toLocaleString() : 'N/A'}</div>
          </div>
          <div className={styles.cvPreview}>
            <strong style={{ color: '#1976d2', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FontAwesomeIcon icon={faFilePdf} className={styles.icon} /> CV:
            </strong>
            {app.cv && app.cv.startsWith('http') ? (
              <div style={{ width: '100%' }}>
                <a href={app.cv} target="_blank" rel="noopener noreferrer" className={styles.cvButton}>
                  <FontAwesomeIcon icon={faEye} /> Ver CV
                </a>
                {(() => {
                  let url = app.cv;
                  // Google Drive
                  const driveMatch = url.match(/^https:\/\/drive\.google\.com\/file\/d\/([\w-]+)\/view/);
                  if (driveMatch) {
                    url = `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
                  }
                  // OneDrive
                  const oneDriveMatch = url.match(/^https:\/\/onedrive\.live\.com\/view\.aspx\?(.*)$/);
                  if (oneDriveMatch) {
                    url = `https://onedrive.live.com/embed?${oneDriveMatch[1]}`;
                  }
                  // iCloud (intentamos embeber directamente)
                  const iCloudMatch = url.match(/^https:\/\/www\.icloud\.com\/iclouddrive\//);
                  if (
                    url.match(/\.(pdf)(\?.*)?$/i) ||
                    url.match(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i) ||
                    driveMatch || oneDriveMatch || iCloudMatch
                  ) {
                    return previewError ? (
                      <div className={styles.cvError}>
                        <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#b71c1c', fontSize: '1.5em' }} />
                        No se pudo previsualizar el archivo aquí. <br />
                        Puedes abrirlo en una nueva pestaña:
                        <br />
                        <a href={app.cv} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 600 }}>Abrir archivo</a>
                      </div>
                    ) : (
                      <iframe
                        src={url}
                        title="CV Previsualización"
                        style={{ width: '100%', height: 400, border: '1px solid #ccc', borderRadius: 8, background: '#fff' }}
                        allow="autoplay"
                        onError={() => setPreviewError(true)}
                      />
                    );
                  } else {
                    return null;
                  }
                })()}
              </div>
            ) : (
              <span>{app.cv}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherApplicationDetailPage; 