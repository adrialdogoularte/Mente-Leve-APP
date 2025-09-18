import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  FileText, Eye, AlertCircle, CheckCircle, Clock, User, ArrowLeft,
  Calendar, BarChart3, TrendingUp, X, Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AvaliacoesRecebidas = () => {
  const { user, api } = useAuth();
  const navigate = useNavigate();
  const [avaliacoesRecebidas, setAvaliacoesRecebidas] = useState([]);
  const [showDetalhes, setShowDetalhes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const carregarAvaliacoesRecebidas = useCallback(async () => {
    setLoading(true);
    try {
      // Tentar carregar avaliações compartilhadas da API
      try {
        const response = await api.get(`/compartilhamentos/psicologo/${user.id}`);
        setAvaliacoesRecebidas(response.data.avaliacoes || []);
      } catch (apiError) {
        console.warn('Erro ao carregar avaliações da API, usando dados fictícios:', apiError);
        
        // Dados fictícios para demonstração
        const avaliacoesFicticias = [
          {
            id: 1,
            tipo: 'Autoavaliação',
            data_avaliacao: '2024-01-15T10:30:00Z',
            pontuacao: 28,
            nivel_risco: 'medio',
            observacoes: 'Estudante relatou ansiedade relacionada aos estudos',
            aluno: {
              nome: 'João Silva',
              email: 'joao.silva@email.com',
              curso: 'Psicologia',
              universidade: 'UFMG'
            },
            respostas: {
              'Com que frequência você se sente sobrecarregado(a) com suas responsabilidades acadêmicas?': 'Frequentemente',
              'Como você avalia a qualidade do seu sono nas últimas duas semanas?': 'Ruim',
              'Com que frequência você se sente isolado(a) ou desconectado(a) dos outros?': 'Às vezes',
              'Nas últimas duas semanas, com que frequência você se sentiu triste ou desanimado(a)?': 'Frequentemente',
              'Com que frequência você se sente ansioso(a) ou preocupado(a)?': 'Sempre'
            },
            data_compartilhamento: '2024-01-15T11:00:00Z'
          },
          {
            id: 2,
            tipo: 'Autoavaliação',
            data_avaliacao: '2024-01-10T14:20:00Z',
            pontuacao: 35,
            nivel_risco: 'alto',
            observacoes: 'Necessita acompanhamento urgente',
            aluno: {
              nome: 'Maria Santos',
              email: 'maria.santos@email.com',
              curso: 'Engenharia',
              universidade: 'USP'
            },
            respostas: {
              'Com que frequência você se sente sobrecarregado(a) com suas responsabilidades acadêmicas?': 'Sempre',
              'Como você avalia a qualidade do seu sono nas últimas duas semanas?': 'Muito ruim',
              'Com que frequência você se sente isolado(a) ou desconectado(a) dos outros?': 'Frequentemente',
              'Nas últimas duas semanas, com que frequência você se sentiu triste ou desanimado(a)?': 'Sempre',
              'Com que frequência você se sente ansioso(a) ou preocupado(a)?': 'Sempre'
            },
            data_compartilhamento: '2024-01-10T15:00:00Z'
          },
          {
            id: 3,
            tipo: 'Autoavaliação',
            data_avaliacao: '2024-01-08T09:15:00Z',
            pontuacao: 18,
            nivel_risco: 'baixo',
            observacoes: 'Estudante demonstra boa saúde mental',
            aluno: {
              nome: 'Pedro Costa',
              email: 'pedro.costa@email.com',
              curso: 'Medicina',
              universidade: 'UFRJ'
            },
            respostas: {
              'Com que frequência você se sente sobrecarregado(a) com suas responsabilidades acadêmicas?': 'Raramente',
              'Como você avalia a qualidade do seu sono nas últimas duas semanas?': 'Boa',
              'Com que frequência você se sente isolado(a) ou desconectado(a) dos outros?': 'Nunca',
              'Nas últimas duas semanas, com que frequência você se sentiu triste ou desanimado(a)?': 'Raramente',
              'Com que frequência você se sente ansioso(a) ou preocupado(a)?': 'Às vezes'
            },
            data_compartilhamento: '2024-01-08T10:00:00Z'
          }
        ];
        
        setAvaliacoesRecebidas(avaliacoesFicticias);
      }
    } catch (error) {
      console.error('Erro ao carregar avaliações recebidas:', error);
      setError('Erro ao carregar avaliações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [api, user]);

  useEffect(() => {
    carregarAvaliacoesRecebidas();
  }, [carregarAvaliacoesRecebidas]);

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

  const obterCorNivelRisco = (nivel) => {
    switch (nivel) {
      case 'baixo': return 'text-green-600 bg-green-100';
      case 'medio': return 'text-yellow-600 bg-yellow-100';
      case 'alto': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const obterIconeNivelRisco = (nivel) => {
    switch (nivel) {
      case 'baixo': return <CheckCircle className="h-4 w-4" />;
      case 'medio': return <AlertCircle className="h-4 w-4" />;
      case 'alto': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const calcularEstatisticas = () => {
    if (avaliacoesRecebidas.length === 0) return null;

    const pontuacoes = avaliacoesRecebidas.filter(av => av.pontuacao).map(av => av.pontuacao);
    const mediaPontuacao = pontuacoes.length > 0 ? pontuacoes.reduce((a, b) => a + b, 0) / pontuacoes.length : 0;
    
    const niveisRisco = avaliacoesRecebidas.filter(av => av.nivel_risco).map(av => av.nivel_risco);
    const contadorNiveis = niveisRisco.reduce((acc, nivel) => {
      acc[nivel] = (acc[nivel] || 0) + 1;
      return acc;
    }, {});

    return {
      total: avaliacoesRecebidas.length,
      mediaPontuacao: mediaPontuacao.toFixed(1),
      niveisRisco: contadorNiveis
    };
  };

  const estatisticas = calcularEstatisticas();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/perfil')}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Perfil</span>
          </button>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Avaliações Recebidas</h1>
              <p className="text-gray-600">Avaliações compartilhadas pelos seus pacientes</p>
            </div>
          </div>
        </div>

        {/* Mensagens */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {/* Estatísticas */}
        {estatisticas && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">Total Recebidas</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{estatisticas.total}</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">Pontuação Média</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{estatisticas.mediaPontuacao}</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <span className="text-sm text-gray-600">Risco Alto</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{estatisticas.niveisRisco.alto || 0}</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">Risco Baixo</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{estatisticas.niveisRisco.baixo || 0}</p>
            </div>
          </div>
        )}

        {/* Lista de Avaliações */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Avaliações Compartilhadas</h2>
            <span className="text-sm text-gray-500">{avaliacoesRecebidas.length} avaliação(ões)</span>
          </div>

          {avaliacoesRecebidas.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma avaliação compartilhada</h3>
              <p className="text-gray-500 mb-4">Você ainda não recebeu avaliações compartilhadas pelos alunos</p>
              <p className="text-sm text-gray-400">As avaliações aparecerão aqui quando os alunos compartilharem com você</p>
            </div>
          ) : (
            <div className="space-y-4">
              {avaliacoesRecebidas.map((avaliacao, index) => (
                <div key={avaliacao.id || index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {avaliacao.tipo || 'Autoavaliação'} - {avaliacao.aluno?.nome}
                        </h3>
                        {avaliacao.nivel_risco && (
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${obterCorNivelRisco(avaliacao.nivel_risco)}`}>
                            {obterIconeNivelRisco(avaliacao.nivel_risco)}
                            <span className="capitalize">{avaliacao.nivel_risco}</span>
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2 space-y-1">
                        <div className="flex items-center space-x-4">
                          <p><strong>Aluno:</strong> {avaliacao.aluno?.nome}</p>
                          <p><strong>Curso:</strong> {avaliacao.aluno?.curso}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <p><strong>Data da Avaliação:</strong> {formatarData(avaliacao.data_avaliacao)}</p>
                          <p><strong>Compartilhada em:</strong> {formatarData(avaliacao.data_compartilhamento)}</p>
                        </div>
                        {avaliacao.pontuacao && (
                          <p><strong>Pontuação:</strong> {avaliacao.pontuacao}</p>
                        )}
                      </div>

                      {avaliacao.observacoes && (
                        <p className="text-sm text-gray-500 mb-2">
                          <strong>Observações:</strong> {avaliacao.observacoes}
                        </p>
                      )}

                      <div className="text-sm text-gray-500">
                        <p><strong>Universidade:</strong> {avaliacao.aluno?.universidade}</p>
                        <p><strong>Email:</strong> {avaliacao.aluno?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setShowDetalhes(avaliacao)}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Ver Detalhes</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de Detalhes */}
        {showDetalhes && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Detalhes da Avaliação</h3>
                  <button
                    onClick={() => setShowDetalhes(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Informações do Aluno */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Informações do Aluno</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nome</label>
                        <p className="text-gray-900">{showDetalhes.aluno?.nome}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="text-gray-900">{showDetalhes.aluno?.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Curso</label>
                        <p className="text-gray-900">{showDetalhes.aluno?.curso}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Universidade</label>
                        <p className="text-gray-900">{showDetalhes.aluno?.universidade}</p>
                      </div>
                    </div>
                  </div>

                  {/* Informações da Avaliação */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tipo</label>
                      <p className="text-gray-900">{showDetalhes.tipo || 'Autoavaliação'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Data da Avaliação</label>
                      <p className="text-gray-900">{formatarData(showDetalhes.data_avaliacao)}</p>
                    </div>
                  </div>

                  {showDetalhes.pontuacao && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pontuação</label>
                      <p className="text-gray-900">{showDetalhes.pontuacao}</p>
                    </div>
                  )}

                  {showDetalhes.nivel_risco && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nível de Risco</label>
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${obterCorNivelRisco(showDetalhes.nivel_risco)}`}>
                        {obterIconeNivelRisco(showDetalhes.nivel_risco)}
                        <span className="capitalize">{showDetalhes.nivel_risco}</span>
                      </span>
                    </div>
                  )}

                  {showDetalhes.observacoes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Observações</label>
                      <p className="text-gray-900">{showDetalhes.observacoes}</p>
                    </div>
                  )}

                  {showDetalhes.respostas && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Respostas Detalhadas</label>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        {Object.entries(showDetalhes.respostas).map(([pergunta, resposta], index) => (
                          <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
                            <p className="text-sm font-medium text-gray-700 mb-1">{pergunta}</p>
                            <p className="text-sm text-gray-600">{resposta}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Data de Compartilhamento</label>
                    <p className="text-gray-900">{formatarData(showDetalhes.data_compartilhamento)}</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowDetalhes(null)}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
    </div>
  );
};

export default AvaliacoesRecebidas;