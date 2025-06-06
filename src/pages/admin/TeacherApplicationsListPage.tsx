import React, { useState, useMemo } from 'react';
import { useGetTeachersApplications } from '../../generated/api/teachers/teachers';
import { useNavigate } from 'react-router-dom';
import styles from './TeacherApplicationsListPage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';

const DEBOUNCE_MS = 400;

const TeacherApplicationsListPage: React.FC = () => {
  const { data, isLoading, error } = useGetTeachersApplications();
  const navigate = useNavigate();

  // Filtros
  const [search, setSearch] = useState('');
  const [accepted, setAccepted] = useState<string>('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce para el texto de búsqueda
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), DEBOUNCE_MS);
    return () => clearTimeout(handler);
  }, [search]);

  // Construir los parámetros de búsqueda
  const params = useMemo(() => {
    const p: any = {};
    if (debouncedSearch.trim()) {
      p.search = debouncedSearch;
    }
    if (accepted === 'true') p.accepted = true;
    if (accepted === 'false') p.accepted = false;
    return p;
  }, [debouncedSearch, accepted]);

  // Consulta con filtros
  const {
    data: filteredData,
    isLoading: filteredLoading,
    error: filteredError
  } = useGetTeachersApplications(params);

  const applications = Array.isArray((filteredData as any)?.data) ? (filteredData as any).data : [];
  let errorMessage: string | null = null;
  if (typeof filteredError === 'string') errorMessage = filteredError;
  else if (filteredError instanceof Error) errorMessage = filteredError.message;

  return (
    <div className={styles.container}>
      <button
        style={{
          background: '#e3f2fd', color: '#1976d2', fontWeight: 600, fontSize: '1.08rem', border: 'none', borderRadius: 8, padding: '8px 18px', marginBottom: 18, boxShadow: '0 1px 4px rgba(44,152,185,0.07)', display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'background 0.18s, color 0.18s',
        }}
        onClick={() => navigate(-1)}
        onMouseOver={e => (e.currentTarget.style.background = '#1976d2', e.currentTarget.style.color = '#fff')}
        onMouseOut={e => (e.currentTarget.style.background = '#e3f2fd', e.currentTarget.style.color = '#1976d2')}
      >
        <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: 6 }} /> Volver
      </button>
      <h2>Solicitudes de Profesores</h2>
      {/* Filtros */}
      <div className={styles.filtersContainer}>
        <div className={styles.searchBox}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterBox}>
          <FontAwesomeIcon icon={faFilter} className={styles.filterIcon} />
          <select
            value={accepted}
            onChange={e => setAccepted(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">Todas</option>
            <option value="true">Aceptadas</option>
            <option value="false">No aceptadas</option>
          </select>
        </div>
      </div>
      {filteredLoading && <div className={styles.loading}>Cargando solicitudes...</div>}
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}
      {!filteredLoading && !errorMessage && applications.length === 0 && (
        <div className={styles.empty}>No hay solicitudes registradas.</div>
      )}
      {!filteredLoading && !errorMessage && applications.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>CV</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app: any) => (
              <tr key={app.id}>
                <td>{app.name} {app.paternal_surname} {app.maternal_surname || ''}</td>
                <td>{app.contact_email}</td>
                <td>{app.contact_phone}</td>
                <td>
                  {app.cv.startsWith('http') ? (
                    <a href={app.cv} target="_blank" rel="noopener noreferrer">Ver CV</a>
                  ) : (
                    <span>{app.cv}</span>
                  )}
                </td>
                <td>
                  <button
                    className={styles.detailsButton}
                    onClick={() => navigate(`/admin/teacher-applications/${app.id}`)}
                  >
                    Ver detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeacherApplicationsListPage; 