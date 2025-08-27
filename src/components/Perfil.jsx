import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  User, Calendar, BookOpen, GraduationCap, Share2, Eye, AlertCircle,
  CheckCircle, Clock, Edit, Save, X, Heart, TrendingUp, BarChart3
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const Perfil = () => {
  const { user, api, atualizarPerfil, logout } = useAuth();
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [registrosHumor, setRegistrosHumor] = useState([]);
  const [estatisticasHumor, setEstatisticasHumor] = useState({});
  const [psicologos, setPsicologos] = useState([]);
  const [showCompartilhamento, setShowCompartilhamento] = useState(null);
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [dadosPerfil, setDadosPerfil] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    universidade: user?.universidade || '',
    curso: user?.curso || '',
    periodo: user?.periodo || '',
    crp: user?.crp || '',
    especialidade: user?.especialidade || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const carregarDados = useCallback(async () => {
    if (!user) return; // Não carrega dados se o usuário não estiver logado

    try {
      // Carregar avaliações
      const avaliacoesSalvas = JSON.parse(localStorage.getItem('avaliacoes') || '[]');
      setAvaliacoes(avaliacoesSalvas);

      // Carregar registros de humor
      const humorResponse = await api.get('/humor?limite=30');
      setRegistrosHumor(humorResponse.data.registros || []);

      // Carregar estatísticas de humor
      const statsResponse = await api.get('/humor/estatisticas');
      setEstatisticasHumor(statsResponse.data);

      // Se for psicólogo, carregar lista de psicólogos para compartilhamento
      if (user?.tipo_usuario === 'aluno') {
        // Aqui você pode implementar uma rota para listar psicólogos disponíveis
        // const psicologosResponse = await api.get('/psicologos');
        // setPsicologos(psicologosResponse.data.psicologos || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do perfil:', error);
      if (error.response && error.response.status === 401) {
        logout(); // Redireciona para login se não autorizado
      } else {
        setError('Erro ao carregar dados. Tente novamente.');
      }
    }
  }, [user, api, logout]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const handleEditarPerfil = () => {
    setEditandoPerfil(true);
    setDadosPerfil({
      nome: user?.nome || '',
      email: user?.email || '',
      universidade: user?.universidade || '',
      curso: user?.curso || '',
      periodo: user?.periodo || '',
      crp: user?.crp || '',
      especialidade: user?.especialidade || ''
    });
  };

  const handleSalvarPerfil = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await atualizarPerfil(dadosPerfil);

      if (result.success) {
        setSuccess('Perfil atualizado com sucesso!');
        setEditandoPerfil(false);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCompartilharAvaliacao = async (avaliacaoId, psicologoId) => {
    try {
      await api.post('/compartilhamentos', {
        avaliacao_id: avaliacaoId,
        psicologo_id: psicologoId
      });

      setSuccess('Avaliação compartilhada com sucesso!');
      setShowCompartilhamento(null);
      carregarDados(); // Recarregar para atualizar status
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao compartilhar avaliação');
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-4 rounded-full">
              <User className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
          <p className="text-gray-600">Gerencie suas informações e acompanhe seu progresso</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações do Perfil */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Informações Pessoais</h2>
                {!editandoPerfil && (
                  <button
                    onClick={handleEditarPerfil}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                )}
              </div>

              {editandoPerfil ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                      type="text"
                      value={dadosPerfil.nome}
                      onChange={(e) => setDadosPerfil({...dadosPerfil, nome: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={dadosPerfil.email}
                      onChange={(e) => setDadosPerfil({...dadosPerfil, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {user?.tipo_usuario === 'aluno' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Universidade</label>
                        <input
                          type="text"
                          value={dadosPerfil.universidade}
                          onChange={(e) => setDadosPerfil({...dadosPerfil, universidade: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
                        <input
                          type="text"
                          value={dadosPerfil.curso}
                          onChange={(e) => setDadosPerfil({...dadosPerfil, curso: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                        <input
                          type="text"
                          value={dadosPerfil.periodo}
                          onChange={(e) => setDadosPerfil({...dadosPerfil, periodo: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </>
                  )}

                  {user?.tipo_usuario === 'psicologo' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CRP</label>
                        <input
                          type="text"
                          value={dadosPerfil.crp}
                          onChange={(e) => setDadosPerfil({...dadosPerfil, crp: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
                        <input
                          type="text"
                          value={dadosPerfil.especialidade}
                          onChange={(e) => setDadosPerfil({...dadosPerfil, especialidade: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleSalvarPerfil}
                      disabled={loading}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>{loading ? 'Salvando...' : 'Salvar'}</span>
                    </button>
                    <button
                      onClick={() => setEditandoPerfil(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancelar</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Nome</div>
                      <div className="font-medium text-gray-900">{user?.nome}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium text-gray-900">{user?.email}</div>
                    </div>
                  </div>

                  {user?.tipo_usuario === 'aluno' && (
                    <>
                      <div className="flex items-center space-x-3">
                        <GraduationCap className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Universidade</div>
                          <div className="font-medium text-gray-900">{user?.universidade}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Curso</div>
                          <div className="font-medium text-gray-900">{user?.curso}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Período</div>
                          <div className="font-medium text-gray-900">{user?.periodo}</div>
                        </div>
                      </div>
                    </>
                  )}

                  {user?.tipo_usuario === 'psicologo' && (
                    <>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">CRP</div>
                          <div className="font-medium text-gray-900">{user?.crp}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Heart className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Especialidade</div>
                          <div className="font-medium text-gray-900">{user?.especialidade}</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Estatísticas de Humor */}
              {user?.tipo_usuario === 'aluno' && Object.keys(estatisticasHumor).length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas de Humor</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-600">Total de registros</span>
                      </div>
                      <span className="font-semibold text-gray-900">{estatisticasHumor.total_registros}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-600">Humor médio</span>
                      </div>
                      <span className="font-semibold text-gray-900">{estatisticasHumor.media_humor?.toFixed(1)}</span>
                    </div>

                    {estatisticasHumor.emocoes_frequentes?.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Emoções mais frequentes:</p>
                        <ul className="list-disc list-inside text-sm text-gray-800">
                          {estatisticasHumor.emocoes_frequentes.map((emocao, index) => (
                            <li key={index}>{emocao.emocao} ({emocao.contagem} vezes)</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Registros de Humor Recentes */}
              {user?.tipo_usuario === 'aluno' && registrosHumor.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Registros de Humor Recentes</h3>
                  <div className="space-y-4">
                    {registrosHumor.map((registro) => (
                      <div key={registro.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{formatarData(registro.data_registro)}</span>
                          <span className="text-sm font-semibold text-blue-600">Humor: {registro.humor}</span>
                        </div>
                        <p className="text-gray-800 text-sm">{registro.observacoes || 'Nenhuma observação.'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Avaliações de Autoavaliação */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Minhas Autoavaliações</h2>

              {avaliacoes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Você ainda não realizou nenhuma autoavaliação.</p>
                  <p className="mt-2">Comece agora para acompanhar seu bem-estar!</p>
                  <button
                    onClick={() => window.location.href = '/autoavaliacao'}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Fazer Autoavaliação
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {avaliacoes.map((avaliacao) => (
                    <div key={avaliacao.id} className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Avaliação de {formatarData(avaliacao.data_criacao)}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${obterCorNivelRisco(avaliacao.nivel_risco)}`}>
                          {obterIconeNivelRisco(avaliacao.nivel_risco)} {avaliacao.nivel_risco.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-800 mb-3">Pontuação Total: <span className="font-semibold">{avaliacao.pontuacao_total}</span></p>
                      <p className="text-gray-700 text-sm">Recomendações:</p>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mt-2">
                        {avaliacao.recomendacoes.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                      {user?.tipo_usuario === 'aluno' && psicologos.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          {showCompartilhamento === avaliacao.id ? (
                            <div className="flex flex-col space-y-2">
                              <select
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                onChange={(e) => handleCompartilharAvaliacao(avaliacao.id, e.target.value)}
                              >
                                <option value="">Selecionar Psicólogo</option>
                                {psicologos.map(psicologo => (
                                  <option key={psicologo.id} value={psicologo.id}>{psicologo.nome}</option>
                                ))}
                              </select>
                              <button
                                onClick={() => setShowCompartilhamento(null)}
                                className="text-sm text-gray-500 hover:text-gray-700"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowCompartilhamento(avaliacao.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                            >
                              <Share2 className="h-4 w-4 mr-2" />
                              Compartilhar com Psicólogo
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Perfil;
