import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Calendar, BookOpen, GraduationCap, Share2, Eye, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const Perfil = () => {
  const { user } = useAuth();
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [psicologos, setPsicologos] = useState([]);
  const [showCompartilhamento, setShowCompartilhamento] = useState(null);

  // Mock data para desenvolvimento
  const mockAvaliacoes = [
    {
      id: 1,
      pontuacao_total: 24,
      nivel_risco: 'medio',
      data_criacao: '2024-01-15T10:30:00',
      compartilhada: false,
      recomendacoes: [
        'Considere implementar técnicas de relaxamento em sua rotina.',
        'Busque apoio de amigos, família ou profissionais quando necessário.',
        'Avalie sua carga de trabalho e organize melhor seu tempo.'
      ]
    },
    {
      id: 2,
      pontuacao_total: 18,
      nivel_risco: 'baixo',
      data_criacao: '2024-01-10T14:20:00',
      compartilhada: true,
      recomendacoes: [
        'Continue mantendo seus bons hábitos de bem-estar mental.',
        'Pratique atividades que te dão prazer regularmente.',
        'Mantenha uma rotina de sono saudável.'
      ]
    },
    {
      id: 3,
      pontuacao_total: 32,
      nivel_risco: 'alto',
      data_criacao: '2024-01-05T09:15:00',
      compartilhada: true,
      recomendacoes: [
        'É recomendável buscar apoio profissional de um psicólogo.',
        'Considere conversar com alguém de confiança sobre como se sente.',
        'Pratique técnicas de respiração e mindfulness.',
        'Não hesite em procurar ajuda imediata se necessário.'
      ]
    }
  ];

  const mockPsicologos = [
    {
      id: 1,
      nome: 'Dra. Ana Silva',
      especialidade: 'Ansiedade e Estresse Acadêmico',
      crp: 'CRP 05/12345'
    },
    {
      id: 2,
      nome: 'Dr. Carlos Santos',
      especialidade: 'Depressão e Autoestima',
      crp: 'CRP 05/67890'
    },
    {
      id: 3,
      nome: 'Dra. Maria Oliveira',
      especialidade: 'Relacionamentos e Habilidades Sociais',
      crp: 'CRP 05/54321'
    }
  ];

  useEffect(() => {
    // Carregar avaliações do localStorage ou usar mock
    const storedAvaliacoes = localStorage.getItem('avaliacoes');
    if (storedAvaliacoes) {
      setAvaliacoes(JSON.parse(storedAvaliacoes));
    } else {
      setAvaliacoes(mockAvaliacoes);
      localStorage.setItem('avaliacoes', JSON.stringify(mockAvaliacoes));
    }
    
    setPsicologos(mockPsicologos);
  }, []);

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const obterCorNivel = (nivel) => {
    switch (nivel) {
      case 'baixo': return 'text-green-600 bg-green-100';
      case 'medio': return 'text-yellow-600 bg-yellow-100';
      case 'alto': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const obterIconeNivel = (nivel) => {
    switch (nivel) {
      case 'baixo': return <CheckCircle className="w-4 h-4" />;
      case 'medio': return <Clock className="w-4 h-4" />;
      case 'alto': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const compartilharAvaliacao = (avaliacaoId, psicologoId) => {
    const avaliacoesAtualizadas = avaliacoes.map(av => 
      av.id === avaliacaoId ? { ...av, compartilhada: true } : av
    );
    
    setAvaliacoes(avaliacoesAtualizadas);
    localStorage.setItem('avaliacoes', JSON.stringify(avaliacoesAtualizadas));
    setShowCompartilhamento(null);
    
    // Mostrar feedback
    alert('Avaliação compartilhada com sucesso!');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h2>
          <p className="text-gray-600">Você precisa estar logado para ver seu perfil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header do Perfil */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.nome}</h1>
              <p className="text-gray-600">{user.email}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                {user.tipo_usuario === 'aluno' ? 'Aluno' : 'Psicólogo'}
              </span>
            </div>
          </div>
        </div>

        {/* Informações Acadêmicas/Profissionais */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {user.tipo_usuario === 'aluno' ? 'Informações Acadêmicas' : 'Informações Profissionais'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.tipo_usuario === 'aluno' ? (
              <>
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Universidade</p>
                    <p className="font-medium text-gray-900">{user.universidade}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Curso</p>
                    <p className="font-medium text-gray-900">{user.curso}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Período</p>
                    <p className="font-medium text-gray-900">{user.periodo}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">CRP</p>
                    <p className="font-medium text-gray-900">{user.crp}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Especialidade</p>
                    <p className="font-medium text-gray-900">{user.especialidade}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Histórico de Avaliações (apenas para alunos) */}
        {user.tipo_usuario === 'aluno' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Histórico de Avaliações</h2>
            
            {avaliacoes.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Você ainda não realizou nenhuma avaliação.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {avaliacoes.map((avaliacao) => (
                  <div key={avaliacao.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${obterCorNivel(avaliacao.nivel_risco)}`}>
                          {obterIconeNivel(avaliacao.nivel_risco)}
                          <span className="ml-1 capitalize">{avaliacao.nivel_risco} Risco</span>
                        </span>
                        <span className="text-sm text-gray-500">
                          Pontuação: {avaliacao.pontuacao_total}/40
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {avaliacao.compartilhada ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Share2 className="w-3 h-3 mr-1" />
                            Compartilhada
                          </span>
                        ) : (
                          <button
                            onClick={() => setShowCompartilhamento(avaliacao.id)}
                            className="inline-flex items-center px-3 py-1 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                          >
                            <Share2 className="w-3 h-3 mr-1" />
                            Compartilhar
                          </button>
                        )}
                        <span className="text-sm text-gray-500">
                          {formatarData(avaliacao.data_criacao)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-md p-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Recomendações:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {avaliacao.recomendacoes.map((recomendacao, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {recomendacao}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal de Compartilhamento */}
        {showCompartilhamento && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Compartilhar Avaliação
              </h3>
              <p className="text-gray-600 mb-4">
                Selecione um psicólogo para compartilhar sua avaliação:
              </p>
              
              <div className="space-y-3 mb-6">
                {psicologos.map((psicologo) => (
                  <button
                    key={psicologo.id}
                    onClick={() => compartilharAvaliacao(showCompartilhamento, psicologo.id)}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{psicologo.nome}</div>
                    <div className="text-sm text-gray-500">{psicologo.especialidade}</div>
                    <div className="text-xs text-gray-400">{psicologo.crp}</div>
                  </button>
                ))}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCompartilhamento(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Perfil;

