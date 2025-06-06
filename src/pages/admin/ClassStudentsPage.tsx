import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUsers, faUser, faGraduationCap, faBook, faSpinner, faExclamationTriangle, faTrash, faUserPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useClassStudents } from '../../hooks/useClassStudents';
import { useDeleteClassesIdStudentStudentId, usePostClassesEnrollStudent } from '../../generated/api/classes/classes';
import { useGetStudentsStudents } from '../../generated/api/students/students';
import { usePopup } from '../../hooks/usePopup';
import type { ClassResponseDto, GetStudentByClassResponseDto, StudentResponseDto, EnrollStudentClassDto } from '../../generated/model';
import styles from './ClassStudentsPage.module.css'; // Crearemos este archivo de estilos

const ClassStudentsPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError, popup, hidePopup } = usePopup();
  
  // Obtener detalles de la clase del estado de la navegación
  const classDetails = location.state?.classDetails as ClassResponseDto | undefined;

  const numericClassId = classId ? parseInt(classId, 10) : undefined;

  // Hook para estudiantes inscritos en la clase actual
  const { 
    allStudents: enrolledStudents, 
    isLoading: isLoadingEnrolledStudents, 
    error: enrolledStudentsError, 
    refetch: refetchEnrolledStudents
  } = useClassStudents(numericClassId);

  // Hook para obtener TODOS los estudiantes del sistema
  const {
    data: allAvailableStudentsData,
    isLoading: isLoadingAllStudents,
    error: allStudentsError,
    refetch: refetchAllSystemStudents
  } = useGetStudentsStudents();

  const allSystemStudents = useMemo(() => allAvailableStudentsData?.data || [], [allAvailableStudentsData]);

  // Nuevo estado para el término de búsqueda de estudiantes a inscribir
  const [enrollSearchTerm, setEnrollSearchTerm] = useState<string>('');

  // Filtrar estudiantes que no están inscritos en la clase actual
  const enrollableStudents = useMemo(() => {
    if (!allSystemStudents.length) return [];

    // Primero, filtrar por término de búsqueda si existe
    const searchedStudents = enrollSearchTerm
      ? allSystemStudents.filter((student: StudentResponseDto) => {
          const searchTermLower = enrollSearchTerm.toLowerCase();
          const fullName = `${student.user.name} ${student.user.paternal_surname} ${student.user.maternal_surname || ''}`.toLowerCase();
          const controlNumber = student.control_number?.toLowerCase() || '';
          return fullName.includes(searchTermLower) || controlNumber.includes(searchTermLower);
        })
      : allSystemStudents;

    // Luego, excluir a los ya inscritos
    const enrolledStudentIds = new Set(enrolledStudents?.map(s => s.student?.id_student) || []);
    return searchedStudents.filter((student: StudentResponseDto) => !enrolledStudentIds.has(student.id_student));
  }, [allSystemStudents, enrolledStudents, enrollSearchTerm]);

  const [selectedStudentToEnrollId, setSelectedStudentToEnrollId] = useState<string>('');

  const deleteStudentMutation = useDeleteClassesIdStudentStudentId();
  const enrollStudentMutation = usePostClassesEnrollStudent();

  // Determinar si las acciones de gestión están permitidas
  const areActionsDisabled = useMemo(() => {
    if (!classDetails) return true; // Si no hay detalles, deshabilitar por seguridad
    return classDetails.status === 'aprobado' || classDetails.status === 'rechazado' || classDetails.status === 'cancelled';
  }, [classDetails]);

  const handleGoBack = () => {
    navigate(-1); // Vuelve a la página anterior (debería ser la de aprobación)
  };

  const handleDeleteStudent = async (studentIdToDelete: number) => {
    if (!numericClassId) {
      showError('Error', 'No se pudo obtener el ID de la clase.');
      return;
    }

    // Confirmación antes de eliminar
    if (!window.confirm('¿Estás seguro de que deseas eliminar a este estudiante de la clase?')) {
      return;
    }

    try {
      await deleteStudentMutation.mutateAsync({
        id: numericClassId,
        studentId: studentIdToDelete,
      });
      showSuccess('Estudiante Eliminado', 'El estudiante ha sido eliminado de la clase exitosamente.');
      refetchEnrolledStudents(); // Recargar la lista de estudiantes
    } catch (error: any) {
      console.error('Error al eliminar estudiante:', error);
      const errorMessage = error?.response?.data?.message || 'No se pudo eliminar al estudiante. Intente nuevamente.';
      showError('Error al Eliminar', errorMessage);
    }
  };

  const handleEnrollStudent = async () => {
    if (!numericClassId || !selectedStudentToEnrollId) {
      showError('Error de Validación', 'Por favor, selecciona un estudiante para inscribir.');
      return;
    }

    const studentToEnroll = allSystemStudents.find(
      (s: StudentResponseDto) => s.id_student === parseInt(selectedStudentToEnrollId)
    );

    if (!studentToEnroll) {
      showError('Error', 'Estudiante seleccionado no encontrado.');
      return;
    }

    const enrollPayload: EnrollStudentClassDto = {
      classId: numericClassId,
      student: {
        studentId: studentToEnroll.id_student,
        controlNumber: studentToEnroll.control_number || '',
        studentPhone: studentToEnroll.phone || '',
      },
    };

    try {
      await enrollStudentMutation.mutateAsync({ data: enrollPayload });
      showSuccess('Estudiante Inscrito', 
        `${studentToEnroll.user.name} ${studentToEnroll.user.paternal_surname || ''} ha sido inscrito exitosamente.`
      );
      refetchEnrolledStudents();
      setSelectedStudentToEnrollId(''); // Resetear select
      setEnrollSearchTerm(''); // Limpiar búsqueda después de inscribir
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'No se pudo inscribir al estudiante.';
      showError('Error al Inscribir', errorMessage);
    }
  };

  if (!classDetails && !numericClassId) {
    // Si no hay detalles de la clase (por acceso directo a URL sin estado) Y no hay ID, algo anda mal.
    // En un escenario real, aquí podríamos cargar los detalles de la clase usando el ID si classDetails es undefined.
    // Por ahora, mostramos un error simple o redirigimos.
    return (
      <div className={styles.pageContainer}>
        <div className={styles.errorContainer}>
          <FontAwesomeIcon icon={faExclamationTriangle} size="3x" />
          <h2>Error</h2>
          <p>No se pudo cargar la información de la clase. Por favor, intente volver y seleccionar la clase nuevamente.</p>
          <button onClick={handleGoBack} className={styles.backButton}>
            <FontAwesomeIcon icon={faArrowLeft} /> Volver
          </button>
        </div>
      </div>
    );
  }
  
  // Si no hay classDetails (ej. acceso directo por URL) pero sí ID,
  // podríamos mostrar un cargador mientras se obtienen los detalles de la clase.
  // Por simplicidad, asumimos que classDetails siempre vendrá o mostramos un mensaje limitado.

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <button onClick={handleGoBack} className={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} /> Volver
        </button>
        <h1>
          <FontAwesomeIcon icon={faUsers} /> Estudiantes Inscritos
        </h1>
      </header>

      {classDetails && (
        <section className={styles.classInfoSection}>
          <h2>
            <FontAwesomeIcon icon={faGraduationCap} /> {classDetails.Subjects?.name || 'Materia Desconocida'}
          </h2>
          <p>
            <FontAwesomeIcon icon={faBook} /> Clave: {classDetails.Subjects?.clave || 'N/A'}
          </p>
          <p>
            <FontAwesomeIcon icon={faUsers} /> Inscritos: {classDetails.enrrolled} / {classDetails.max_students}
          </p>
        </section>
      )}
      {!classDetails && numericClassId && (
         <section className={styles.classInfoSection}>
            <p>Detalles de la clase no disponibles (ID: {numericClassId}). Mostrando solo estudiantes.</p>
         </section>
      )}

      {/* Sección para Inscribir Nuevo Estudiante (condicional) */}
      {!areActionsDisabled && (
        <section className={styles.enrollStudentSection}>
          <h3><FontAwesomeIcon icon={faUserPlus} /> Inscribir Nuevo Estudiante</h3>
          {isLoadingAllStudents && <p>Cargando estudiantes disponibles...</p>}
          {Boolean(allStudentsError) && <p className={styles.errorMessage}>Error al cargar estudiantes disponibles.</p>}
          {!isLoadingAllStudents && !Boolean(allStudentsError) && (
            <>
              <div className={styles.enrollSearchContainer}>
                <FontAwesomeIcon icon={faSearch} className={styles.enrollSearchIcon} />
                <input 
                  type="text"
                  placeholder="Buscar por nombre o N.C..."
                  value={enrollSearchTerm}
                  onChange={(e) => setEnrollSearchTerm(e.target.value)}
                  className={styles.enrollSearchInput}
                />
              </div>
              <div className={styles.enrollFormContainer}>
                <select 
                  value={selectedStudentToEnrollId}
                  onChange={(e) => setSelectedStudentToEnrollId(e.target.value)}
                  className={styles.enrollSelect}
                  disabled={enrollableStudents.length === 0 && !enrollSearchTerm}
                >
                  <option value="">
                    {enrollSearchTerm && enrollableStudents.length === 0 
                      ? 'No hay coincidencias' 
                      : enrollableStudents.length === 0 
                        ? 'No hay estudiantes para inscribir' 
                        : '-- Selecciona un estudiante --'
                    }
                  </option>
                  {enrollableStudents.map((student: StudentResponseDto) => (
                    <option key={student.id_student} value={student.id_student}>
                      {`${student.user.name} ${student.user.paternal_surname} ${student.user.maternal_surname || ''} (NC: ${student.control_number || 'N/A'})`}
                    </option>
                  ))}
                </select>
                <button 
                  onClick={handleEnrollStudent} 
                  className={styles.enrollButton}
                  disabled={!selectedStudentToEnrollId || enrollStudentMutation.isPending || (enrollableStudents.length === 0 && !enrollSearchTerm)}
                >
                  {enrollStudentMutation.isPending ? 'Inscribiendo...' : 'Inscribir Estudiante'}
                </button>
              </div>
            </>
          )}
        </section>
      )}
      {areActionsDisabled && classDetails && (
        <div className={styles.actionsDisabledMessage}>
          <p>La inscripción y eliminación de estudiantes no está permitida para clases en estado "{classDetails.status}".</p>
        </div>
      )}

      <section className={styles.studentsListSection}>
        <h3>Lista de Estudiantes Inscritos ({enrolledStudents?.length || 0})</h3>
        {isLoadingEnrolledStudents && (
          <div className={styles.loadingState}>
            <FontAwesomeIcon icon={faSpinner} spin size="2x" />
            <p>Cargando estudiantes inscritos...</p>
          </div>
        )}
        {Boolean(enrolledStudentsError) && (
          <div className={styles.errorState}>
            <FontAwesomeIcon icon={faExclamationTriangle} size="2x" />
            <p>Error al cargar la lista de estudiantes inscritos.</p>
          </div>
        )}
        {!isLoadingEnrolledStudents && !Boolean(enrolledStudentsError) && enrolledStudents && enrolledStudents.length > 0 && (
          <ul className={styles.studentsList}>
            {enrolledStudents.map((studentItem: GetStudentByClassResponseDto, index: number) => (
              <li key={studentItem.student?.id_student || index} className={styles.studentItem}>
                <div className={styles.studentInfo}>
                  <FontAwesomeIcon icon={faUser} className={styles.studentIcon} />
                  <div>
                    <span className={styles.studentName}>
                      {`${studentItem.student?.user?.name || 'Estudiante'} ${studentItem.student?.user?.paternal_surname || ''} ${studentItem.student?.user?.maternal_surname || ''}`.trim()}
                    </span>
                    <span className={styles.studentControlNumber}>
                      N.C: {studentItem.student?.control_number || 'N/A'}
                    </span>
                  </div>
                </div>
                <div className={styles.studentActions}>
                  {studentItem.group_leader && <span className={styles.leaderBadge}>Líder</span>}
                  {!areActionsDisabled && (
                    <button 
                      className={styles.deleteStudentButton}
                      onClick={() => studentItem.student?.id_student && handleDeleteStudent(studentItem.student.id_student)}
                      disabled={deleteStudentMutation.isPending || enrollStudentMutation.isPending}
                      title="Eliminar estudiante de la clase"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        {!isLoadingEnrolledStudents && !Boolean(enrolledStudentsError) && (!enrolledStudents || enrolledStudents.length === 0) && (
          <p className={styles.noStudentsMessage}>No hay estudiantes inscritos en esta clase.</p>
        )}
      </section>
    </div>
  );
};

export default ClassStudentsPage; 