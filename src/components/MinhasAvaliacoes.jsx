import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  FileText, Share2, Eye, AlertCircle, CheckCircle, Clock, Users, X,
  Calendar, BarChart3, TrendingUp, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MinhasAvaliacoes = () => {
  const { user, api } = useAuth();
  const navigate = useNavigate();
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [psicologos, setPsicologos] = useState([]);
  const [showCompartilhamento, setShowCompartilhamento] = useState(null);
  const [showDetalhes, setShowDetalhes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const carregarDados = useCallback(async () => {
    setLoading(true);
    try {
      // Carregar avaliações apenas da API
      try {
        const avaliacoesResponse = await api.get('/avaliacoes');
        const avaliacoesAPI = avaliacoesResponse.data.avaliacoes || [];
        setAvaliacoes(avaliacoesAPI);
      } catch (apiError) {
        console.error('Erro ao carregar avaliações da API:', apiError);
        setAvaliacoes([]);
        setError('Erro ao carregar avaliações. Tente novamente.');
      }

      // Carregar lista de psicólogos para compartilhamento
      try {
        const psicologosResponse = await api.get('/psicologos');
        setPsicologos(psicologosResponse.data.psicologos || []);
      } catch (psicError) {
        console.warn('Erro ao carregar psicólogos:', psicError);
        // Lista de psicólogos fictícios para demonstração
        setPsicologos([
          { 
            id: 1, 
            nome: 'Dr. Ana Silva', 
            especialidade: 'Psicologia Clínica', 
            crp: '12345',
            disponivel: true
          },
          { 
            id: 2, 
            nome: 'Dr. João Santos', 
            especialidade: 'Psicologia Educacional', 
            crp: '67890',
            disponivel: false
          },
          { 
            id: 3, 
            nome: 'Dra. Maria Costa', 
            especialidade: 'Psicologia Cognitiva', 
            crp: '54321',
            disponivel: true
          },
          { 
            id: 4, 
            nome: 'Dr. Carlos Oliveira', 
            especialidade: 'Psicologia Comportamental', 
            crp: '98765',
            disponivel: false
          }
        ]);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const handleCompartilharAvaliacao = async (avaliacaoId, psicologoId) => {
    try {
      await api.post('/compartilhamentos', {
        avaliacao_id: avaliacaoId,
        psicologo_id: psicologoId
      });

      setSuccess('Avaliação compartilhada com sucesso!');
      setShowCompartilhamento(null);
      
      // Atualizar o status da avaliação como compartilhada
      setAvaliacoes(prev => prev.map(av => 
        av.id === avaliacaoId 
          ? { ...av, compartilhada: true, compartilhada_com: psicologos.find(p => p.id === psicologoId)?.nome }
          : av
      ));
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao compartilhar avaliação');
    }
  };

  const formatarData = (dataString) => {
    if (!dataString || dataString === 'Data não disponível') {
      return 'Data não disponível';
    }
    
    try {
      const data = new Date(dataString);
      // Verificar se a data é válida
      if (isNaN(data.getTime())) {
        return 'Data inválida';
      }
      
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
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
    if (avaliacoes.length === 0) return null;

    const pontuacoes = avaliacoes.filter(av => av.pontuacao).map(av => av.pontuacao);
    const mediaPontuacao = pontuacoes.length > 0 ? pontuacoes.reduce((a, b) => a + b, 0) / pontuacoes.length : 0;
    
    const niveisRisco = avaliacoes.filter(av => av.nivel_risco).map(av => av.nivel_risco);
    const contadorNiveis = niveisRisco.reduce((acc, nivel) => {
      acc[nivel] = (acc[nivel] || 0) + 1;
      return acc;
    }, {});

    return {
      total: avaliacoes.length,
      mediaPontuacao: mediaPontuacao.toFixed(1),
      niveisRisco: contadorNiveis,
      compartilhadas: avaliacoes.filter(av => av.compartilhada).length
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
            <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-3 rounded-full">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Minhas Avaliações</h1>
              <p className="text-gray-600">Acompanhe suas avaliações e compartilhe com psicólogos</p>
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

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="text-green-700 text-sm">{success}</span>
          </div>
        )}

        {/* Estatísticas */}
        {estatisticas && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">Total</span>
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
                <Share2 className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-gray-600">Compartilhadas</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{estatisticas.compartilhadas}</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <span className="text-sm text-gray-600">Risco Alto</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{estatisticas.niveisRisco.alto || 0}</p>
            </div>
          </div>
        )}

        {/* Lista de Avaliações */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Suas Avaliações</h2>
            <span className="text-sm text-gray-500">{avaliacoes.length} avaliação(ões)</span>
          </div>

          {avaliacoes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma avaliação encontrada</h3>
              <p className="text-gray-500 mb-4">Você ainda não realizou nenhuma avaliação</p>
              <button
                onClick={() => navigate('/autoavaliacao')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Fazer Primeira Avaliação
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {avaliacoes.map((avaliacao, index) => (
                <div key={avaliacao.id || index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {avaliacao.tipo || 'Autoavaliação'} #{avaliacao.id || index + 1}
                        </h3>
                        {avaliacao.nivel_risco && (
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${obterCorNivelRisco(avaliacao.nivel_risco)}`}>
                            {obterIconeNivelRisco(avaliacao.nivel_risco)}
                            <span className="capitalize">{avaliacao.nivel_risco}</span>
                          </span>
                        )}
                        {avaliacao.compartilhada && (
                          <span className="inline-flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                            <Share2 className="h-3 w-3" />
                            <span>Compartilhada</span>
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <p><strong>Data:</strong> {formatarData(avaliacao.data_criacao || avaliacao.data_avaliacao || avaliacao.timestamp || 'Data não disponível')}</p>
                        {avaliacao.pontuacao && (
                          <p><strong>Pontuação:</strong> {avaliacao.pontuacao}</p>
                        )}
                        {avaliacao.compartilhada_com && (
                          <p><strong>Compartilhada com:</strong> {avaliacao.compartilhada_com}</p>
                        )}
                      </div>

                      {avaliacao.observacoes && (
                        <p className="text-sm text-gray-500 mb-2">
                          <strong>Observações:</strong> {avaliacao.observacoes}
                        </p>
                      )}

                      {avaliacao.respostas && (
                        <div className="text-sm text-gray-500">
                          <p><strong>Respostas:</strong> {Object.keys(avaliacao.respostas).length} questão(ões) respondida(s)</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setShowDetalhes(avaliacao)}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Ver Detalhes</span>
                      </button>
                      
                      <button
                        onClick={() => setShowCompartilhamento(avaliacao.id || index)}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                      >
                        <Share2 className="h-4 w-4" />
                        <span>Compartilhar</span>
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
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
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

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tipo</label>
                      <p className="text-gray-900">{showDetalhes.tipo || 'Autoavaliação'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Data</label>
                      <p className="text-gray-900">{formatarData(showDetalhes.data_criacao || showDetalhes.data_avaliacao || showDetalhes.timestamp || 'Data não disponível')}</p>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Respostas</label>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        {Object.entries(showDetalhes.respostas).map(([pergunta, resposta], index) => (
                          <div key={index} className="border-b border-gray-200 pb-2 last:border-b-0">
                            <p className="text-sm font-medium text-gray-700">{pergunta}</p>
                            <p className="text-sm text-gray-600">{resposta}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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

        {/* Modal de Compartilhamento */}
        {showCompartilhamento !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Compartilhar Avaliação</h3>
                  <button
                    onClick={() => setShowCompartilhamento(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <p className="text-gray-600 mb-4">
                  Selecione um psicólogo para compartilhar sua avaliação:
                </p>

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {psicologos.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Nenhum psicólogo disponível</p>
                  ) : (
                    psicologos.map((psicologo) => (
                      <button
                        key={psicologo.id}
                        onClick={() => handleCompartilharAvaliacao(showCompartilhamento, psicologo.id)}
                        className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Users className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900">{psicologo.nome}</p>
                              <p className="text-sm text-gray-500">{psicologo.especialidade}</p>
                              <p className="text-xs text-gray-400">CRP: {psicologo.crp}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {psicologo.disponivel ? (
                              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Online
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                Offline
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => setShowCompartilhamento(null)}
                    className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Cancelar
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

export default MinhasAvaliacoes;