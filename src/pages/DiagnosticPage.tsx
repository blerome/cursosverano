import React, { useState } from 'react';
import { useAllCareersAndSubjects } from '../hooks/useAllCareersAndSubjects';
import { useGetAuthProfile } from '../generated/api/auth/auth';
import { useGetStudents } from '../generated/api/students/students';
import { useMsal } from '@azure/msal-react';
import styles from './DiagnosticPage.module.css';

const DiagnosticPage: React.FC = () => {
  const { accounts } = useMsal();
  const { data: profileData, isLoading: profileLoading, error: profileError } = useGetAuthProfile();
  const userData = profileData?.data;

  const { 
    data: studentsData, 
    isLoading: studentsLoading, 
    error: studentsError 
  } = useGetStudents(
    { userId: userData?.id_user || 0 },
    {
      query: {
        enabled: !!userData?.id_user,
        retry: false,
      },
    }
  );

  const { 
    careers, 
    subjects: allSubjects,
    isLoading: careersAndSubjectsLoading, 
    careersError, 
    subjectsError 
  } = useAllCareersAndSubjects();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Página de Diagnóstico</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h2>🔐 Autenticación MSAL</h2>
        <p><strong>Cuentas conectadas:</strong> {accounts?.length || 0}</p>
        {accounts && accounts.length > 0 && (
          <p><strong>Usuario actual:</strong> {accounts[0].username}</p>
        )}
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h2>👤 Perfil de Usuario</h2>
        <p><strong>Estado:</strong> {profileLoading ? '⏳ Cargando...' : profileError ? '❌ Error' : '✅ Cargado'}</p>
        {profileError && <p style={{ color: 'red' }}><strong>Error:</strong> {JSON.stringify(profileError)}</p>}
        {userData && (
          <div>
            <p><strong>ID:</strong> {userData.id_user}</p>
            <p><strong>Nombre:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h2>🎓 Datos de Estudiante</h2>
        <p><strong>Estado:</strong> {studentsLoading ? '⏳ Cargando...' : studentsError ? '❌ Error (normal si no es estudiante)' : '✅ Cargado'}</p>
        {studentsError && <p style={{ color: 'orange' }}><strong>Error:</strong> {JSON.stringify(studentsError)}</p>}
        {studentsData?.data && (
          <div>
            <p><strong>ID Estudiante:</strong> {studentsData.data.id_student}</p>
            <p><strong>Número de Control:</strong> {studentsData.data.control_number}</p>
            <p><strong>Carrera:</strong> {studentsData.data.career}</p>
            <p><strong>ID Carrera:</strong> {studentsData.data.id_career}</p>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h2>🏫 Carreras</h2>
        <p><strong>Estado:</strong> {careersAndSubjectsLoading ? '⏳ Cargando...' : careersError ? '❌ Error' : '✅ Cargado'}</p>
        {careersError && <p style={{ color: 'red' }}><strong>Error:</strong> {JSON.stringify(careersError)}</p>}
        {careers && careers.length > 0 && (
          <p><strong>Carreras disponibles:</strong> {careers.length}</p>
        )}
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h2>📚 Materias</h2>
        <p><strong>Estado:</strong> {careersAndSubjectsLoading ? '⏳ Cargando...' : subjectsError ? '❌ Error' : '✅ Cargado'}</p>
        {subjectsError && <p style={{ color: 'red' }}><strong>Error:</strong> {JSON.stringify(subjectsError)}</p>}
        {allSubjects && allSubjects.length > 0 && (
          <p><strong>Materias disponibles:</strong> {allSubjects.length}</p>
        )}
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h3>📋 Resumen del Estado</h3>
        <ul>
          <li>Autenticación: {accounts && accounts.length > 0 ? '✅ OK' : '❌ No autenticado'}</li>
          <li>Perfil: {userData ? '✅ OK' : '❌ No cargado'}</li>
          <li>Estudiante: {studentsData?.data ? '✅ Registrado' : '⚠️ No registrado como estudiante'}</li>
          <li>Carreras: {careers.length > 0 ? '✅ OK' : '❌ No cargadas'}</li>
          <li>Materias: {allSubjects.length > 0 ? '✅ OK' : '❌ No cargadas'}</li>
        </ul>
      </div>
    </div>
  );
};

export default DiagnosticPage; 