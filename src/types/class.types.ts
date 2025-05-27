export interface Day {
  id_day: number;
  name: string;
}

export interface Classroom {
  id_classroom: number;
  name: string;
  // Agregar más campos según sea necesario
}

export interface Schedule {
  id_schedule: number;
  start_time: string;
  end_time: string;
  id_day: number;
  id_classroom: number | null;
  Classrooms: Classroom | null;
  Days: Day;
}

export interface Career {
  id_career: number;
  name: string;
}

export interface Subject {
  id_subject: number;
  clave: string;
  name: string;
  credits: number;
  Careers: Career[];
}

export interface ResponsibleStudent {
  student_name?: string;
  control_number?: string;
  student_phone?: string;
  id_student?: number;
}

export interface ClassData {
  id_class: number;
  status: 'pendiente' | 'active' | 'cancelled';
  max_students: number;
  description: string | null;
  id_subject: number;
  image: string | null;
  Subjects: Subject;
  Schedules: Schedule[];
  enrrolled: number; // Nota: parece ser "enrolled" pero la API usa "enrrolled"
  ResponsibleStudent?: ResponsibleStudent;
}

export interface ClassResponse {
  data: ClassData[];
  total: number;
  page: number;
  pageSize: number;
} 