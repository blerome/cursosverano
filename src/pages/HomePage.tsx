import React, { useState } from 'react';
import { useCourses } from '../context/CoursesContext';
import CourseCard from '../components/Courses/CourseCard';
import CourseFilter from '../components/Courses/CourseFilter';
import CoursePagination from '../components/Courses/CoursePagination';
import Modal from '../components/UI/Modal';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  const { filteredCourses, enrollStudent } = useCourses();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showModal, setShowModal] = useState(false);
  const coursesPerPage = 6;

  const handleViewDetails = (course: Course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleEnroll = (courseId: number) => {
    enrollStudent(courseId);
    const nombre = prompt('Ingresa tu nombre completo:');
    if (nombre) {
      alert(`¡Inscripción exitosa, ${nombre}!`);
    }
  };

  // Calcular cursos actuales
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  return (
    <div className={styles.homeContainer}>
      <h1>Cursos de Verano 2023</h1>
      
      <CourseFilter />
      
      <div className={styles.coursesGrid}>
        {currentCourses.length > 0 ? (
          currentCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onEnroll={handleEnroll}
              onViewDetails={handleViewDetails}
            />
          ))
        ) : (
          <div className={styles.sinResultados}>
            <i className="fas fa-search" style={{ fontSize: '2rem', marginBottom: '15px' }}></i>
            <p>No se encontraron cursos con los filtros aplicados</p>
          </div>
        )}
      </div>
      
      <CoursePagination
        coursesPerPage={coursesPerPage}
        totalCourses={filteredCourses.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedCourse?.nombre || 'Detalles del Curso'}
      >
        {selectedCourse && (
          <>
            <p><strong>Carrera:</strong> {selectedCourse.carrera}</p>
            <p><strong>Clave:</strong> {selectedCourse.clave}</p>
            <p><strong>Horario:</strong> {selectedCourse.horario}</p>
            <p><strong>Créditos:</strong> {selectedCourse.creditos}</p>
            <p><strong>Cupo:</strong> {selectedCourse.inscritos}/{selectedCourse.cupo} ({Math.round((selectedCourse.inscritos / selectedCourse.cupo) * 100)}%)</p>
            <p><strong>Grupo WhatsApp:</strong> <a href={selectedCourse.whatsapp} target="_blank" rel="noopener noreferrer">Enlace al grupo</a></p>
            <p><strong>Descripción:</strong> {selectedCourse.descripcion}</p>
            
            <div className={styles.inscritosList}>
              <h3>Estudiantes Inscritos</h3>
              <ul>
                {Array.from({ length: selectedCourse.inscritos }).map((_, i) => (
                  <li key={i}>Estudiante {i + 1} (ejemplo{i + 1}@mail.com)</li>
                ))}
                {selectedCourse.inscritos === 0 && <li>No hay estudiantes inscritos aún</li>}
              </ul>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default HomePage;