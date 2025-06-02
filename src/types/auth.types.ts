export type UserType = 'student' | 'staff';

export interface AuthContext {
  userType: UserType | null;
  isAuthenticated: boolean;
  user: StudentProfile | StaffProfile | null;
  logout: () => void;
  isLoading?: boolean;
}

export interface StudentProfile {
  type: 'student';
  id_user: number;
  name: string;
  email: string;
  paternal_surname: string;
  maternal_surname: string;
  oid: string;
  studentData?: {
    id_student: number;
    control_number: string;
    phone: string;
    career: string;
    id_career: number;
  };
}

export interface StaffProfile {
  type: 'staff';
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'teacher';
  isActive: boolean;
}

export interface StaffLoginCredentials {
  email: string;
  password: string;
}

export interface StaffSession {
  token: string;
  user: StaffProfile;
  expiresAt: number;
} 