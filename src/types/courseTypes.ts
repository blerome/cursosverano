// src/types/courseTypes.ts

export interface Course {
    id: number;
    nombre: string;
    clave: string;
    horario: string;
    creditos: number;
    imagen: string;
    whatsapp: string;
    cupo: number;
    inscritos: number;
    carrera: string;
    descripcion: string;
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