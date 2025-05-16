// src/types/courseTypes.ts

export interface Course {
    id: number;
    idSubject: number;
    name: string;
    clave: string;
    schedule: Schedule[];
    credits: number;
    maxStudents: number | null;
    status: string | null ;
    enrolled: number;
    careers: string[];
    description: string | null;
  }
  export interface Schedule {
    day: string;
    startTime: string;
    endTime: string;
  }

  export interface Days {
    name: string;
  }
  
  export type Carrera = 'Sistemas' | 'Informatica' | 'Software' | 'TICs' | 'Industrial';
  
  // También puedes agregar tipos para los filtros si los necesitas
  export interface FilterOptions {
    searchTerm?: string;
    carrera?: Carrera | '';
    disponibilidad?: 'disponible' | 'lleno' | '';
    creditos?: number | '';
  }
  
  // Tipo para el estado inicial de los cursos (opcional)
  export interface CoursesState {
    courses: Course[];
    filteredCourses: Course[];
  }