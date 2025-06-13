import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ReglamentoEstudiante from './pages/ReglamentoEstudiante';
import ReglamentoGeneral from './pages/ReglamentoGeneral';
import { PrivateRoute } from './components/privateroutes/PrivateRoute';
import { AdminRoute } from './components/privateroutes/AdminRoute';
import { PublicRoute } from './components/privateroutes/PublicRoute';
import { AuthProvider } from './contexts/AuthContext';
import CreateClassPage from './pages/admin/CreateClassPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import Profile from './pages/users/Profile';
import ClassesPage from './pages/classes/ClassesPage';
import DiagnosticPage from './pages/DiagnosticPage';
import MyCoursesPage from './pages/courses/MyCoursesPage';
import CourseClassStudentsPage from './pages/courses/ClassStudentsPage';
import AdminClassStudentsPage from './pages/admin/ClassStudentsPage';
import StaffLogin from './components/auth/StaffLogin';
import StaffProfile from './pages/staff/StaffProfile';
import ApplyToTeachPage from './pages/home/ApplyToTeachPage';
import TeacherApplicationsListPage from './pages/admin/TeacherApplicationsListPage';
import TeacherApplicationDetailPage from './pages/admin/TeacherApplicationDetailPage';
import ReglamentoResponsable from './pages/ReglamentoResponsable';
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 👇 Rutas públicas - MANEJAN SU PROPIO LAYOUT DENTRO DE PublicRoute */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route
              path="/Reglamento-Estudiante"
              element={<ReglamentoEstudiante />}
            />
            <Route path="/Reglamento-General" element={<ReglamentoGeneral />} />
            <Route path="/Reglamento-Responsable" element={<ReglamentoResponsable/>} />
            <Route path="/solicitud-impartir-clase/:classId?" element={<ApplyToTeachPage />} />
          </Route>

          {/* 👇 Ruta de login unificada (público, sin layout) */}
          <Route path="/login" element={<LoginPage />} />

          {/* 👇 Rutas de staff login (público) */}
          <Route path="/staff/login" element={<StaffLogin />} />

          {/* 👇 Rutas privadas para usuarios estudiantes - USAN PrivateLayout */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/create-class" element={<CreateClassPage />} />
            <Route path="/my-courses" element={<MyCoursesPage />} />
            <Route path="/my-courses/class/:classId/students" element={<CourseClassStudentsPage />} />
            <Route path="/diagnostic" element={<DiagnosticPage />} />
          </Route>

          {/* 👇 Rutas de staff - REQUIEREN AUTENTICACIÓN POR SESIÓN */}
          <Route element={<AdminRoute />}>
            <Route path="/staff/profile" element={<StaffProfile />} />
            <Route path="/admin">
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="class-students/:classId" element={<AdminClassStudentsPage />} />
              <Route path="teacher-applications" element={<TeacherApplicationsListPage />} />
              <Route path="teacher-applications/:id" element={<TeacherApplicationDetailPage />} />
            </Route>
          </Route>

          {/* Redirección para rutas no encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
