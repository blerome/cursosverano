import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage'; 
import ReglamentoEstudiante from './pages/ReglamentoEstudiante';
import { CoursesProvider } from './context/CoursesContext';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <CoursesProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/Reglamento-Estudiante" element={<ReglamentoEstudiante />} />
          </Routes>
        </Layout>
      </CoursesProvider>
    </Router>
  );
};

export default App;