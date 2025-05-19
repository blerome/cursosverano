import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from '../firebaseConfig';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Course } from '../../src/types/courseTypes';

interface CoursesContextType {
  courses: Course[];
  filteredCourses: Course[];
  setFilteredCourses: (courses: Course[]) => void;
  enrollStudent: (courseId: number) => void;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

export const CoursesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  const enrollStudent = (courseId: number) => {
    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.classId === courseId && course.enrolled < course.maxStudents
          ? { ...course, inscritos: course.enrolled + 1 }
          : course
      )
    );
    setFilteredCourses(prevCourses =>
      prevCourses.map(course =>
        course.classId === courseId && course.enrolled < course.maxStudents
          ? { ...course, inscritos: course.enrolled + 1 }
          : course
      )
    );
  };

  return (
    <CoursesContext.Provider value={{ courses, filteredCourses, setFilteredCourses, enrollStudent }}>
      {children}
    </CoursesContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CoursesContext);
  if (!context) {
    throw new Error('useCourses must be used within a CoursesProvider');
  }
  return context;
};