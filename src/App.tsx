import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import ReglamentoEstudiante from './pages/ReglamentoEstudiante';
import ReglamentoGeneral from './pages/ReglamentoGeneral';
import { CoursesProvider } from './context/CoursesContext';
import { PrivateRoute } from './components/privateroutes/PrivateRoute';
import { AdminRoute } from './components/privateroutes/AdminRoute';
import { PublicRoute } from './components/privateroutes/PublicRoute';
import NewProject from './pages/admin/NewProjectPage/NewProjectPage';
import CreateClassPage from './pages/admin/CreateClassPage';
import Profile from './pages/users/Profile';
import ClassesPage from './pages/classes/ClassesPage';
import DiagnosticPage from './pages/DiagnosticPage';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <CoursesProvider>
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
          </Route>

          {/* 👇 Rutas privadas para usuarios autenticados - USAN PrivateLayout */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/create-class" element={<CreateClassPage />} />
            <Route path="/my-courses" element={<div>Mis Cursos - En desarrollo</div>} />
            <Route path="/diagnostic" element={<DiagnosticPage />} />
          </Route>

          {/* 👇 Rutas de admin - USAN AdminPage COMO LAYOUT */}
          <Route element={<AdminRoute />}>
            <Route path="/admin">
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<div>Dashboard Admin</div>} />
              <Route path="new-project" element={<NewProject />} />
            </Route>
          </Route>

          {/* Redirección para rutas no encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CoursesProvider>
    </Router>
  );
};

export default App;
