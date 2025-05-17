import React, { useState } from 'react';
import { useCourses } from '../context/CoursesContext';
import CourseFilter from '../components/Courses/CourseFilter';
import CoursePagination from '../components/Courses/CoursePagination';
import Modal from '../components/UI/Modal';
import styles from './HomePage.module.css';
import CourseList from '../components/Courses/CourseList';
import { Course } from '../types/courseTypes';

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

  //inscripcion
 const handleEnroll = async (courseId: number, studentData: { numeroControl: string; telefono: string }) => {
  try {
    await enrollStudent(courseId, studentData); // Asegúrate que tu context también acepte studentData
    alert('Inscripción exitosa');
  } catch (error) {
    console.error('Error:', error);
  }
};

  // Calcular cursos actuales
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse,
  );

  return (
    <div className={styles.homeContainer}>
      <h1>Cursos de Verano Instituto Tecnologico de cancun</h1>
      <CourseFilter />
      <div className={styles.coursesGrid}>
        <CourseList  
        onViewDetails={handleViewDetails} 
         onEnroll={handleEnroll}/>
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
        title={selectedCourse?.name || 'Detalles del Curso'}
      >
        {selectedCourse && (
          <>
            <p>
              <strong>Carrera(s): </strong>{' '}
              <p>{selectedCourse.careers.join(' ')}</p>
            </p>
            <p>
              <strong>Clave: </strong>{' '}
              {selectedCourse.clave}
            </p>
            <p>
              <strong>Horario: </strong>{' '}
              {selectedCourse.schedule[0].startTime} - {' '} {selectedCourse.schedule[0].endTime}
            </p>
            <p>
              <strong>Créditos: </strong>
              {selectedCourse.credits}
            </p>
            <p>
              <strong>Cupo:</strong> {' '}
              {selectedCourse.enrolled}/
              {selectedCourse.maxStudents} (
              {Math.round((selectedCourse.enrolled / 30) * 100)}%)
            </p>
            <p>
              <strong>Status:</strong>{' '}
              {selectedCourse.status}
            </p>
            <p>
              <strong>Descripción:</strong>{' '}
              {selectedCourse.description}
            </p>

            {/* <div className={styles.inscritosList}>
              <h3>Estudiantes Inscritos</h3>
              <ul>
                {Array.from({ length: selectedCourse.enrolled }).map((_, i) => (
                  <li key={i}>
                    Estudiante {i + 1} (ejemplo{i + 1}@mail.com)
                  </li>
                ))}
                {selectedCourse.enrolled === 0 && (
                  <li>No hay estudiantes inscritos aún</li>
                )}
              </ul>
            </div> */}
          </>
        )}
      </Modal>
    </div>
  );
};

export default HomePage;
