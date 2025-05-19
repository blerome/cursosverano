// src/types/courseTypes.ts

export interface Course {
    classId: number;
    image: string | null;
    subjectId: number;
    maxStudents: number;
    status: string | null ;
    enrolled: number;
    description: string | null;
    Subject: Subject;
    Schedules: Schedule[];
  }
  export interface Schedule {
    scheduleId: number;
    dayId: number;
    startTime: string;
    endTime: string;
    Day: Day;
    Classroom: Classroom | null;
  }

  export interface Subject {
    subjectId: number;
    clave: string;
    name: string;
    credits: number;
    Careers: Career[];
  }

  export interface Classroom {
    classroomId: number | null;
    name: string | null;
    Building: Building | null;
  }

  export interface Building {
    buildingId: number | null;
    name: string | null;
    sieKey: string | null;
  }

  export interface Career {
    careerId: number;
    name: string;
  }

  export interface Day {
    dayId: number;
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