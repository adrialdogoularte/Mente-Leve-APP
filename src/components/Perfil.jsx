import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  User, Calendar, BookOpen, GraduationCap, AlertCircle,
  CheckCircle, Clock, Edit, Save, X, Heart, TrendingUp, BarChart3, Award
} from 'lucide-react';

// Definindo os moods dentro do componente para evitar erro de referência
const moods = [
  { id: 1, label: 'Muito Ruim', emoji: '😞' },
  { id: 2, label: 'Ruim', emoji: '🙁' },
  { id: 3, label: 'Neutro', emoji: '😐' },
  { id: 4, label: 'Bom', emoji: '🙂' },
  { id: 5, label: 'Muito Bom', emoji: '😀' },
];

// Componente para gerenciar a disponibilidade do psicólogo
const DisponibilidadePsicologo = ({ user, api, atualizarUsuario }) => {
  const [disponibilidade, setDisponibilidade] = useState({});
  const [editandoDisponibilidade, setEditandoDisponibilidade] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Carregar disponibilidade do usuário quando o componente montar ou o usuário mudar
  useEffect(() => {
    if (user?.disponibilidade) {
      setDisponibilidade(user.disponibilidade);
    } else {
      // Se não há disponibilidade no user, buscar do backend
      fetchDisponibilidade();
    }
  }, [user]);

  const fetchDisponibilidade = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data?.disponibilidade) {
        setDisponibilidade(response.data.disponibilidade);
      }
    } catch (error) {
      console.warn('Erro ao carregar disponibilidade:', error);
    }
  };

  const diasSemana = [
    { id: 'monday', label: 'Segunda-feira' },
    { id: 'tuesday', label: 'Terça-feira' },
    { id: 'wednesday', label: 'Quarta-feira' },
    { id: 'thursday', label: 'Quinta-feira' },
    { id: 'friday', label: 'Sexta-feira' },
    { id: 'saturday', label: 'Sábado' },
    { id: 'sunday', label: 'Domingo' }
  ];

  const horariosDisponiveis = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const handleToggleHorario = (dia, horario) => {
    setDisponibilidade(prev => {
      const novaDisponibilidade = { ...prev };
      if (!novaDisponibilidade[dia]) {
        novaDisponibilidade[dia] = [];
      }
      
      if (novaDisponibilidade[dia].includes(horario)) {
        novaDisponibilidade[dia] = novaDisponibilidade[dia].filter(h => h !== horario);
      } else {
        novaDisponibilidade[dia] = [...novaDisponibilidade[dia], horario].sort();
      }
      
      // Remove o dia se não há horários
      if (novaDisponibilidade[dia].length === 0) {
        delete novaDisponibilidade[dia];
      }
      
      return novaDisponibilidade;
    });
  };

  const handleSalvarDisponibilidade = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.put('/auth/psicologo/disponibilidade', {
        disponibilidade
      });

      if (response.status === 200) {
        setSuccess('Disponibilidade atualizada com sucesso!');
        setEditandoDisponibilidade(false);
        
        // Atualizar os dados do usuário no contexto para refletir a mudança
        atualizarUsuario({ disponibilidade: disponibilidade });
        
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Erro ao salvar disponibilidade:', error);
      setError('Erro ao atualizar disponibilidade. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarEdicao = () => {
    setEditandoDisponibilidade(false);
    // Restaurar a disponibilidade original
    if (user?.disponibilidade) {
      setDisponibilidade(user.disponibilidade);
    } else {
      fetchDisponibilidade(); // Recarregar do backend se necessário
    }
    setError('');
    setSuccess('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Clock className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Disponibilidade de Atendimento</h2>
        </div>
        {!editandoDisponibilidade && (
          <button
            onClick={() => setEditandoDisponibilidade(true)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Edit className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Mensagens */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
          <span className="text-green-700 text-sm">{success}</span>
        </div>
      )}

      {editandoDisponibilidade ? (
        <div className="space-y-6">
          <p className="text-sm text-gray-600">
            Selecione os dias da semana e horários em que você está disponível para atendimento.
          </p>
          
          {diasSemana.map(dia => (
            <div key={dia.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">{dia.label}</h3>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {horariosDisponiveis.map(horario => (
                  <button
                    key={horario}
                    onClick={() => handleToggleHorario(dia.id, horario)}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      disponibilidade[dia.id]?.includes(horario)
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {horario}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleSalvarDisponibilidade}
              disabled={loading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Salvando...' : 'Salvar Disponibilidade'}</span>
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
          {Object.keys(disponibilidade).length > 0 ? (
            diasSemana.map(dia => {
              const horariosDoDia = disponibilidade[dia.id];
              if (!horariosDoDia || horariosDoDia.length === 0) return null;
              
              return (
                <div key={dia.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{dia.label}</span>
                  <div className="flex flex-wrap gap-1">
                    {horariosDoDia.map(horario => (
                      <span
                        key={horario}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {horario}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma disponibilidade configurada</h3>
              <p className="text-gray-500 mb-4">
                Configure seus horários de atendimento para que os alunos possam agendar consultas
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Perfil = () => {
  const { user, api, atualizarPerfil, atualizarUsuario } = useAuth();
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

                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Período</div>
                          <div className="font-medium text-gray-900">{user.periodo || 'Não informado'}</div>
                        </div>
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
            </div>
          </div>

          {/* Conteúdo Principal (Humor para Alunos ou Disponibilidade para Psicólogos) */}
          <div className="lg:col-span-2">
            {user.tipo_usuario === 'aluno' ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Heart className="h-6 w-6 text-red-500" />
                  <h2 className="text-xl font-semibold text-gray-900">Registro de Humor</h2>
                </div>

                {registrosHumor.length > 0 ? (
                  <div className="space-y-4">
                    {registrosHumor.map(registro => (
                      <div key={registro.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{moods.find(m => m.id === registro.nivel_humor)?.emoji}</span>
                          <div>
                            <div className="font-medium text-gray-900">{moods.find(m => m.id === registro.nivel_humor)?.label}</div>
                            <div className="text-sm text-gray-500">{formatarData(registro.data_criacao)}</div>
                          </div>
                        </div>
                        {registro.anotacoes && (
                          <p className="text-sm text-gray-600 italic">"{registro.anotacoes}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum registro de humor</h3>
                    <p className="text-gray-500 mb-4">
                      Comece a registrar seu humor para acompanhar seu bem-estar
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <DisponibilidadePsicologo user={user} api={api} atualizarUsuario={atualizarUsuario} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Perfil;