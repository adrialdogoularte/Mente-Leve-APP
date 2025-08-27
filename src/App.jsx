import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Componentes
import Home from './components/Home';
import Login from './components/Login';
import Registro from './components/Registro';
import Autoavaliacao from './components/Autoavaliacao';
import RegistroHumor from './components/RegistroHumor';
import Dicas from './components/Dicas';
import Agendamento from './components/Agendamento';
import Suporte from './components/Suporte';
import Perfil from './components/Perfil';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Componente para redirecionar baseado na autenticação
const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/registro" element={user ? <Navigate to="/" replace /> : <Registro />} />
      
      {/* Rotas protegidas */}
      <Route path="/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/inicio" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/autoavaliacao" element={
        <ProtectedRoute requiredUserType="aluno">
          <Autoavaliacao />
        </ProtectedRoute>
      } />
      <Route path="/registro-humor" element={
        <ProtectedRoute requiredUserType="aluno">
          <RegistroHumor />
        </ProtectedRoute>
      } />
      <Route path="/dicas" element={
        <ProtectedRoute>
          <Dicas />
        </ProtectedRoute>
      } />
      <Route path="/agendamento" element={
        <ProtectedRoute>
          <Agendamento />
        </ProtectedRoute>
      } />
      <Route path="/suporte" element={
        <ProtectedRoute>
          <Suporte />
        </ProtectedRoute>
      } />
      <Route path="/perfil" element={
        <ProtectedRoute>
          <Perfil />
        </ProtectedRoute>
      } />
      
      {/* Rota padrão - redireciona para login se não autenticado */}
      <Route path="*" element={user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

