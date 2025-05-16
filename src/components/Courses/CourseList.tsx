import React from "react";
import { useGetClasses } from "../../generated/api/classes/classes";
import CourseCard from "./CourseCard";
import { mapApiClassToCourse } from "./mapApiClassToCourse";
import { Course } from "../../types/courseTypes";

interface CourseListProps {
  onEnroll: (id: number) => void;
  onViewDetails: (course: any) => void;
}

const CourseList: React.FC<CourseListProps> = ({onEnroll, onViewDetails}) => {
  const { data, isLoading, error } = useGetClasses();
  if (isLoading) return <>Cargando cursos...</>;
  if (error) return <>Error al cargar cursos.</>;

  const courses: Course[] = data?.data?.data.map(mapApiClassToCourse) ?? [];

  return (
    <>
    {courses.length > 0 ? (
      courses.map(course => (
        <CourseCard
          key={course.id}
          course={course}
          onEnroll={onEnroll}
          onViewDetails={onViewDetails}
        />
      ))
    ) : (
      <div>No hay cursos disponibles</div>
    )}
  </>
  );
};

export default CourseList;
