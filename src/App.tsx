import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage'; 
import ReglamentoEstudiante from './pages/ReglamentoEstudiante';
import ReglamentoGeneral from './pages/ReglamentoGeneral';
import { CoursesProvider } from './context/CoursesContext';
import { PrivateRoute } from './components/privateroutes/PrivateRoute';
import { PublicRoute } from './components/privateroutes/PublicRoute';
import NewProject from './pages/admin/NewProjectPage/NewProjectPage';
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
            <Route path="/Reglamento-Estudiante" element={<ReglamentoEstudiante />} />
            <Route path="/Reglamento-General" element={<ReglamentoGeneral />} />
          </Route>

          {/* 👇 Ruta privada - USA SU PROPIO LAYOUT INTERNO */}
         <Route element={<PrivateRoute />}>
  <Route path="/admin">
    <Route index element={<NewProject />} />
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
