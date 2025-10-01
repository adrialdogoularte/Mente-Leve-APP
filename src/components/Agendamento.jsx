import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AgendamentoAluno from './AgendamentoAluno';
import AgendamentoPsicologo from './AgendamentoPsicologo';

const Agendamento = () => {
  const { user, loading } = useAuth();

  // Mostrar loading enquanto carrega os dados do usuário
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Verificar se o usuário está logado
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Acesso Restrito</h2>
          <p className="text-gray-600">Você precisa estar logado para acessar esta página.</p>
        </div>
      </div>
    );
  }

  // Renderizar o componente apropriado baseado no tipo de usuário
  if (user.tipo_usuario === 'psicologo') {
    return <AgendamentoPsicologo />;
  } else if (user.tipo_usuario === 'aluno') {
    return <AgendamentoAluno />;
  } else {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Tipo de Usuário Não Reconhecido</h2>
          <p className="text-gray-600">
            Não foi possível determinar o tipo de usuário. Entre em contato com o suporte.
          </p>
        </div>
      </div>
    );
  }
};

export default Agendamento;