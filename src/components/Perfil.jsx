import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  User, Calendar, BookOpen, GraduationCap, AlertCircle,
  CheckCircle, Clock, Edit, Save, X, Heart, TrendingUp, BarChart3, Award
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

// Definindo os moods dentro do componente para evitar erro de referência
const moods = [
  { id: 1, label: 'Muito Ruim', emoji: '😞' },
  { id: 2, label: 'Ruim', emoji: '🙁' },
  { id: 3, label: 'Neutro', emoji: '😐' },
  { id: 4, label: 'Bom', emoji: '🙂' },
  { id: 5, label: 'Muito Bom', emoji: '😀' },
];

const Perfil = () => {
  const { user, api, atualizarPerfil } = useAuth();
  const [registrosHumor, setRegistrosHumor] = useState([]);
  const [estatisticasHumor, setEstatisticasHumor] = useState({});
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [dadosPerfil, setDadosPerfil] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    universidade: user?.universidade || '',
    curso: user?.curso || '',
    periodo: user?.periodo || '',
    crp: user?.crp || '',
    especialidades: Array.isArray(user?.especialidades) ? user.especialidades.join(', ') : (user?.especialidades || '')
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Função para carregar dados sem dependência de logout
  const carregarDados = useCallback(async () => {
    if (!user || user.tipo_usuario !== 'aluno') return;

    try {
      // Carregar registros de humor apenas para alunos
      const humorResponse = await api.get('/humor?limite=30');
      setRegistrosHumor(humorResponse.data.registros || []);

      // Carregar estatísticas de humor
      const statsResponse = await api.get('/humor/estatisticas');
      setEstatisticasHumor(statsResponse.data);
    } catch (error) {
      console.warn('Erro ao carregar dados de humor:', error);
      // Usar dados fictícios se a API falhar
      setRegistrosHumor([]);
      setEstatisticasHumor({});
    }
  }, [user, api]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Atualizar dados do perfil quando o usuário mudar
  useEffect(() => {
    if (user) {
      setDadosPerfil({
        nome: user.nome || '',
        email: user.email || '',
        universidade: user.universidade || '',
        curso: user.curso || '',
        periodo: user.periodo || '',
        crp: user.crp || '',
        especialidades: Array.isArray(user.especialidades) ? user.especialidades.join(', ') : (user.especialidades || '')
      });
    }
  }, [user]);

  const handleEditarPerfil = () => {
    setEditandoPerfil(true);
    setError('');
    setSuccess('');
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
        // Limpar mensagem de sucesso após 3 segundos
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      setError('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarEdicao = () => {
    setEditandoPerfil(false);
    setError('');
    setSuccess('');
    // Restaurar dados originais
    if (user) {
      setDadosPerfil({
        nome: user.nome || '',
        email: user.email || '',
        universidade: user.universidade || '',
        curso: user.curso || '',
        periodo: user.periodo || '',
        crp: user.crp || '',
        especialidades: Array.isArray(user.especialidades) ? user.especialidades.join(', ') : (user.especialidades || '')
      });
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

  // Função para formatar especialidades (caso venham como string separada por vírgulas)
  const formatarEspecialidades = (especialidade) => {
    if (!especialidade) return [];
    if (Array.isArray(especialidade)) return especialidade;
    return especialidade.split(',').map(esp => esp.trim()).filter(esp => esp.length > 0);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

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

                  {user.tipo_usuario === 'aluno' && (
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

                  {user.tipo_usuario === 'psicologo' && (
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Especialidades</label>
                        <input
                          type="text"
                          value={dadosPerfil.especialidades}
                          onChange={(e) => setDadosPerfil({...dadosPerfil, especialidades: e.target.value})}
                          placeholder="Ex: Psicologia Clínica, Terapia Cognitivo-Comportamental"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Separe múltiplas especialidades com vírgulas</p>
                      </div>
                    </>
                  )}

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleSalvarPerfil}
                      disabled={loading}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="h-4 w-4" />
                      <span>{loading ? 'Salvando...' : 'Salvar'}</span>
                    </button>
                    <button
                      onClick={handleCancelarEdicao}
                      disabled={loading}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <div className="font-medium text-gray-900">{user.nome || 'Não informado'}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium text-gray-900">{user.email || 'Não informado'}</div>
                    </div>
                  </div>

                  {user.tipo_usuario === 'aluno' && (
                    <>
                      <div className="flex items-center space-x-3">
                        <GraduationCap className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Universidade</div>
                          <div className="font-medium text-gray-900">{user.universidade || 'Não informado'}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Curso</div>
                          <div className="font-medium text-gray-900">{user.curso || 'Não informado'}</div>
                        </div>
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

                  {user.tipo_usuario === 'psicologo' && (
                    <>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">CRP</div>
                          <div className="font-medium text-gray-900">{user.crp || 'Não informado'}</div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Award className="h-5 w-5 text-gray-400 mt-1" />
                        <div className="flex-1">
                          <div className="text-sm text-gray-500 mb-2">Especialidades</div>
                          {user.especialidades && Array.isArray(user.especialidades) && user.especialidades.length > 0 ? (
                            <div className="space-y-1">
                              {user.especialidades.map((esp, index) => (
                                <span
                                  key={index}
                                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                                >
                                  {esp}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="font-medium text-gray-500 italic">Não informado</div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Estatísticas de Humor - apenas para alunos */}
              {user.tipo_usuario === 'aluno' && Object.keys(estatisticasHumor).length > 0 && (
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
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Emoções mais frequentes</div>
                        <div className="flex flex-wrap gap-1">
                          {estatisticasHumor.emocoes_frequentes.slice(0, 3).map((emocao, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {emocao}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Registros de Humor Recentes - apenas para alunos */}
            {user.tipo_usuario === 'aluno' && registrosHumor.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Heart className="h-6 w-6 text-pink-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Registros de Humor Recentes</h2>
                  </div>
                  <span className="text-sm text-gray-500">Últimos {Math.min(registrosHumor.length, 10)} registros</span>
                </div>

                <div className="space-y-3">
                  {registrosHumor.slice(0, 10).map((registro, index) => (
                    <div key={registro.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{moods.find(m => m.id === registro.nivel_humor)?.emoji}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{moods.find(m => m.id === registro.nivel_humor)?.label}</p>
                          <p className="text-xs text-gray-500">{formatarData(registro.data_registro)}</p>
                        </div>
                      </div>
                      {registro.descricao && (
                        <span className="text-xs text-gray-500 truncate max-w-[200px]">{registro.descricao}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mensagem para quando não há registros de humor - apenas para alunos */}
            {user.tipo_usuario === 'aluno' && registrosHumor.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum registro de humor encontrado</h3>
                  <p className="text-gray-500 mb-4">Comece a registrar seu humor diário para acompanhar seu bem-estar</p>
                </div>
              </div>
            )}

            {/* Informações adicionais para psicólogos */}
            {user.tipo_usuario === 'psicologo' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Perfil Profissional</h3>
                  <p className="text-gray-500 mb-4">
                    Mantenha suas informações profissionais atualizadas para oferecer o melhor atendimento aos seus pacientes
                  </p>
                  {!user.especialidade && (
                    <p className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                      Complete suas especialidades para que os alunos possam encontrá-lo mais facilmente
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Perfil;