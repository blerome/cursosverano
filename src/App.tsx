import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage'; 
import ReglamentoEstudiante from './pages/ReglamentoEstudiante';
import ReglamentoGeneral from './pages/ReglamentoGeneral';
import { CoursesProvider } from './context/CoursesContext';
import { PrivateRoute } from './components/privateroutes/PrivateRoute';
import { PublicRoute } from './components/privateroutes/PublicRoute';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <CoursesProvider>
        <Layout>
          <Routes>
            {/* 👇 Rutas públicas - SOLO accesibles SIN sesión */}
            <Route element={<PublicRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/Reglamento-Estudiante" element={<ReglamentoEstudiante />} />
              <Route path="/Reglamento-General" element={<ReglamentoGeneral />} />
            </Route>

            {/* 👇 Ruta privada - SOLO accesible CON sesión */}
            <Route element={<PrivateRoute />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>

            {/* Redirección para rutas no encontradas */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
           </Layout>
       
      </CoursesProvider>
    </Router>
  );
};

export default App;
