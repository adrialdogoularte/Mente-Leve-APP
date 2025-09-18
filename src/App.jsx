import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Componentes
import Home from './components/Home';
import Login from './components/Login';
import Registro from './components/Registro';
import Autoavaliacao from './components/Autoavaliacao';
import RegistroHumor from './components/RegistroHumor';
import LembretesDiarios from './components/LembretesDiarios';
import AnalyticsHumor from './components/AnalyticsHumor';
import Dicas from './components/Dicas';
import Agendamento from './components/Agendamento';
import Suporte from './components/Suporte';
import Perfil from './components/Perfil';
import MinhasAvaliacoes from './components/MinhasAvaliacoes';
import AvaliacoesRecebidas from './components/AvaliacoesRecebidas';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
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
          <Layout>
            <Home />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/inicio" element={
        <ProtectedRoute>
          <Layout>
            <Home />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/autoavaliacao" element={
        <ProtectedRoute requiredUserType="aluno">
          <Layout>
            <Autoavaliacao />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/registro-humor" element={
        <ProtectedRoute requiredUserType="aluno">
          <Layout>
            <RegistroHumor />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/lembretes" element={
        <ProtectedRoute requiredUserType="aluno">
          <Layout>
            <LembretesDiarios />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute requiredUserType="aluno">
          <Layout>
            <AnalyticsHumor />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/dicas" element={
        <ProtectedRoute>
          <Layout>
            <Dicas />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/agendamento" element={
        <ProtectedRoute>
          <Layout>
            <Agendamento />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/suporte" element={
        <ProtectedRoute>
          <Layout>
            <Suporte />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/perfil" element={
        <ProtectedRoute>
          <Layout>
            <Perfil />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/minhas-avaliacoes" element={
        <ProtectedRoute requiredUserType="aluno">
          <Layout>
            <MinhasAvaliacoes />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/avaliacoes-recebidas" element={
        <ProtectedRoute requiredUserType="psicologo">
          <Layout>
            <AvaliacoesRecebidas />
          </Layout>
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