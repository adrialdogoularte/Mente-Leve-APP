import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Monitor, MapPin, Eye, X, FileText, BarChart3, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const AgendamentoPsicologo = () => {
  const { user, api } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [didAttend, setDidAttend] = useState(true);
  const [prontuario, setProntuario] = useState(''); // Novo estado para o prontuário
  const [studentEvaluations, setStudentEvaluations] = useState([]);
  const [loadingEvaluations, setLoadingEvaluations] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      if (!user || user.tipo_usuario !== 'psicologo') {
        setError('Usuário não é psicólogo ou não está autenticado.');
        setLoading(false);
        return;
      }

      const response = await api.get('/agendamentos/meus');
      setAppointments(response.data);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      setError('Erro ao carregar agendamentos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateShort = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmado':
        return 'bg-green-100 text-green-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      case 'Finalizado':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Confirmado':
        return 'Confirmado';
      case 'Cancelado':
        return 'Cancelado';
      case 'Finalizado':
        return 'Finalizado';
      default:
        return 'Pendente';
    }
  };

  const handleUpdateStatus = async (appointmentId, newStatus, compareceu = null, prontuario = null) => {
    try {
      const data = { status: newStatus };
      if (newStatus === 'Finalizado') {
        data.compareceu = compareceu;
        data.prontuario = prontuario; // Adiciona o prontuário ao payload
      }
      await api.put(`/agendamentos/${appointmentId}/status`, data);
      
      alert(`Status do agendamento atualizado para ${newStatus} com sucesso!`);
      fetchAppointments(); // Recarrega a lista de agendamentos
      closeModal(); // Fecha o modal de detalhes
      setShowFinalizeModal(false); // Fecha o modal de finalização, se estiver aberto
      setShowCancelModal(false); // Adicionado para fechar o modal de cancelamento
    } catch (error) {
		      console.error('Erro ao atualizar status:', error);
		      const errorMessage = error.response?.data?.message || 'Erro ao atualizar status. Tente novamente.';
		      alert(errorMessage);
		    }
		  };
		
  const handleFinalizeClick = (appointment) => {
    console.log('handleFinalizeClick - Definindo selectedAppointment:', appointment);
    setSelectedAppointment(appointment);
    setShowFinalizeModal(true);
  };

  const handleFinalizeSubmit = () => {
    if (selectedAppointment && selectedAppointment.id) {
      // Limpar o estado do prontuário após o envio
      handleUpdateStatus(selectedAppointment.id, 'Finalizado', didAttend, prontuario);
      setProntuario('');
    } else {
      console.error('selectedAppointment eh nulo ou nao tem ID');
      alert('Erro: Agendamento nao foi carregado corretamente');
    }
  };

  const handleCancelClick = (appointment) => {
    setAppointmentToCancel(appointment);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = () => {
    if (appointmentToCancel) {
      handleUpdateStatus(appointmentToCancel.id, 'Cancelado');
    }
  };

  const fetchStudentEvaluations = async (appointmentId) => {
    try {
      setLoadingEvaluations(true);
      
      // Usar o contexto de autenticação em vez de localStorage diretamente
      if (!user || user.tipo_usuario !== 'psicologo') {
        console.warn('Usuário não é psicólogo ou não está autenticado.');
        return;
      }

      const response = await api.get(`/agendamentos/${appointmentId}/avaliacoes`);
      setStudentEvaluations(response.data.avaliacoes || []);
    } catch (error) {
      console.error('Erro ao carregar avaliações do aluno:', error);
      if (error.response?.status === 403) {
        setStudentEvaluations([]);
      }
    } finally {
      setLoadingEvaluations(false);
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
    setStudentEvaluations([]);
    
    // Buscar avaliações se o aluno permitiu acesso
    if (appointment.permitir_acesso_avaliacoes) {
      fetchStudentEvaluations(appointment.id);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  const sortedAppointments = appointments.sort((a, b) => {
    const dateA = new Date(a.data_agendamento + 'T' + a.hora_agendamento);
    const dateB = new Date(b.data_agendamento + 'T' + b.hora_agendamento);
    return dateB - dateA; // Mais recentes primeiro
  });

  const upcomingAppointments = sortedAppointments.filter(app => {
    const appointmentDate = new Date(app.data_agendamento + 'T' + app.hora_agendamento);
    const now = new Date();
    return appointmentDate >= now && app.status !== 'Cancelado' && app.status !== 'Finalizado';
  });

  const pastAppointments = sortedAppointments.filter(app => {
    const appointmentDate = new Date(app.data_agendamento + 'T' + app.hora_agendamento);
    const now = new Date();
    return appointmentDate < now || app.status === 'Finalizado' || app.status === 'Cancelado';
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando consultas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <X className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-red-600">{error}</p>
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
              <Calendar className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Consultas Agendadas</h1>
          <p className="text-gray-600">Visualize e gerencie suas consultas agendadas pelos alunos</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Próximas Consultas</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Consultas Realizadas</p>
                <p className="text-2xl font-bold text-gray-900">{pastAppointments.filter(app => app.status === 'Finalizado').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total de Consultas</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Próximas Consultas */}
        {upcomingAppointments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Próximas Consultas</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="divide-y divide-gray-200">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <User className="h-8 w-8 text-blue-500 bg-blue-50 rounded-full p-1" />
                        </div>
                        <div>
                          <p className="text-base font-medium text-gray-900">Consulta com {appointment.aluno_nome}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            {appointment.modalidade === 'online' ? (
                              <div className="flex items-center">
                                <Monitor className="h-4 w-4 mr-1 text-blue-500" />
                                <a href={appointment.link_videochamada} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">Acessar Videochamada</a>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1 text-green-500" />
                                <span>Presencial</span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{formatDateShort(appointment.data_agendamento)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{appointment.hora_agendamento}</span>
                            </div>
                            {appointment.modalidade === 'online' && (
                              <div className="flex items-center">
                                <Monitor className="h-4 w-4 mr-1" />
                                <span>Online</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                        <button
                          onClick={() => handleViewDetails(appointment)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Histórico de Consultas */}
        {pastAppointments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Histórico de Consultas</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="divide-y divide-gray-200">
                {pastAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <User className="h-8 w-8 text-blue-500 bg-blue-50 rounded-full p-1" />
                        </div>
                        <div>
                          <p className="text-base font-medium text-gray-900">Consulta com {appointment.aluno_nome}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            {appointment.modalidade === 'online' ? (
                              <div className="flex items-center">
                                <Monitor className="h-4 w-4 mr-1 text-blue-500" />
                                <a href={appointment.link_videochamada} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">Acessar Videochamada</a>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1 text-green-500" />
                                <span>Presencial</span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{formatDateShort(appointment.data_agendamento)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{appointment.hora_agendamento}</span>
                            </div>
                            {appointment.modalidade === 'online' && (
                              <div className="flex items-center">
                                <Monitor className="h-4 w-4 mr-1" />
                                <span>Online</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                        <button
                          onClick={() => handleViewDetails(appointment)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal de Detalhes do Agendamento */}
        {showModal && selectedAppointment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-8 border w-full max-w-2xl shadow-lg rounded-xl bg-white">
              <div className="flex items-start justify-between pb-4 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">Detalhes do Agendamento</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="py-6">
                {/* Ações */}
                {selectedAppointment.status === 'Pendente' && (
                  <div className="flex space-x-3 mb-4">
                    <button
                      onClick={() => handleUpdateStatus(selectedAppointment.id, 'Confirmado')}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Confirmar Agendamento
                    </button>
                    <button
                      onClick={() => handleCancelClick(selectedAppointment)}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Cancelar Agendamento
                    </button>
                  </div>
                )}

                {selectedAppointment.status === 'Confirmado' && (
                  <div className="flex space-x-3 mb-4">
                    <button
                      onClick={() => handleFinalizeClick(selectedAppointment)}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Finalizar Consulta
                    </button>
                    <button
                      onClick={() => handleCancelClick(selectedAppointment)}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Cancelar Agendamento
                    </button>
                  </div>
                )}
                
                {selectedAppointment.status === 'Finalizado' && (
                  <div className="mb-4 p-3 rounded-md bg-gray-100">
                    <p className="text-sm font-medium text-gray-700">
                      Consulta Finalizada. Aluno Compareceu: <span className={`font-bold ${selectedAppointment.compareceu ? 'text-green-600' : 'text-red-600'}`}>{selectedAppointment.compareceu ? 'Sim' : 'Não'}</span>
                    </p>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Aluno</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAppointment.aluno_nome || 'Nome não disponível'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ID do Aluno</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAppointment.aluno_id || 'ID não disponível'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Data</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(selectedAppointment.data_agendamento)}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Horário</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAppointment.hora_agendamento}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Modalidade</label>
                      <div className="mt-1 flex items-center">
                        {selectedAppointment.modalidade === 'online' ? (
                          <>
                            <Monitor className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="text-sm text-blue-600">Online</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="h-4 w-4 mr-2 text-green-500" />
                            <span className="text-sm text-green-600">Presencial</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAppointment.status || 'Pendente')}`}>
                        {getStatusText(selectedAppointment.status || 'Pendente')}
                      </span>
                    </div>
	                  </div>
	                  
	                  {/* Novo Bloco: Prontuário (Visível apenas se Finalizado) */}
	                  {selectedAppointment.status === 'Finalizado' && selectedAppointment.prontuario && (
	                    <div className="mt-4">
	                      <label className="block text-sm font-medium text-gray-700 mb-2">
	                        <FileText className="h-4 w-4 inline mr-1" />
	                        Prontuário do Atendimento
	                      </label>
	                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
	                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedAppointment.prontuario}</p>
	                      </div>
	                    </div>
	                  )}
	                  
	                  {selectedAppointment.notas && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FileText className="h-4 w-4 inline mr-1" />
                        Observações do Aluno
                      </label>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-900">{selectedAppointment.notas}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Seção de Avaliações do Aluno */}
                  {selectedAppointment.permitir_acesso_avaliacoes && (
                    <div className="mt-6 border-t pt-4">
                      <div className="flex items-center mb-3">
                        <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
                        <h4 className="text-lg font-medium text-gray-900">Autoavaliações do Aluno</h4>
                      </div>
                      
                      {loadingEvaluations ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                          <p className="text-sm text-gray-500 mt-2">Carregando avaliações...</p>
                        </div>
                      ) : studentEvaluations.length > 0 ? (
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {studentEvaluations.slice(0, 10).map((evaluation, index) => (
                            <div key={evaluation.id || index} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                  {new Date(evaluation.data_criacao).toLocaleDateString('pt-BR')}
                                </span>
                                <div className="flex items-center">
                                  <TrendingUp className="h-4 w-4 text-gray-400 mr-1" />
                                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                                    evaluation.nivel_risco === 'baixo' ? 'bg-green-100 text-green-800' :
                                    evaluation.nivel_risco === 'medio' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {evaluation.nivel_risco === 'baixo' ? 'Baixo Risco' :
                                     evaluation.nivel_risco === 'medio' ? 'Médio Risco' : 'Alto Risco'}
                                  </span>
                                </div>
                              </div>
                              <div className="mb-2">
                                <span className="text-xs text-gray-500">Pontuação Total: </span>
                                <span className="text-sm font-medium text-gray-700">{evaluation.pontuacao_total}</span>
                              </div>
                              {evaluation.categorias_pontuacao && Object.keys(evaluation.categorias_pontuacao).length > 0 && (
                                <div className="grid grid-cols-2 gap-1 text-xs text-gray-600 mb-2">
                                  {Object.entries(evaluation.categorias_pontuacao).slice(0, 4).map(([categoria, pontuacao]) => (
                                    <div key={categoria}>
                                      {categoria.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}: {pontuacao}
                                    </div>
                                  ))}
                                </div>
                              )}
                              {evaluation.recomendacoes && evaluation.recomendacoes.length > 0 && (
                                <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                                  <span className="font-medium text-blue-800">Principais recomendações:</span>
                                  <ul className="text-blue-700 mt-1 list-disc list-inside">
                                    {evaluation.recomendacoes.slice(0, 2).map((rec, idx) => (
                                      <li key={idx}>{rec}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <BarChart3 className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Nenhuma autoavaliação encontrada</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!selectedAppointment.permitir_acesso_avaliacoes && (
                    <div className="mt-6 border-t pt-4">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center">
                          <Eye className="h-5 w-5 text-yellow-500 mr-2" />
                          <p className="text-sm text-yellow-700">
                            O aluno não permitiu o acesso às suas autoavaliações para esta consulta.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmação de Cancelamento */}
        {showCancelModal && appointmentToCancel && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Confirmar Cancelamento</h3>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <p className="text-sm text-gray-700 mb-6">
                Tem certeza que deseja cancelar a consulta com <strong>{appointmentToCancel.aluno_nome}</strong> agendada para <strong>{formatDateShort(appointmentToCancel.data_agendamento)}</strong> às <strong>{appointmentToCancel.hora_agendamento}</strong>?
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Não, Voltar
                </button>
                <button
                  onClick={handleCancelConfirm}
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sim, Cancelar Consulta
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Adicionando o Modal de Finalização */}
      <FinalizeModal
        show={showFinalizeModal}
        onClose={() => setShowFinalizeModal(false)}
        onSubmit={handleFinalizeSubmit}
        appointment={selectedAppointment}
        didAttend={didAttend}
        setDidAttend={setDidAttend}
        prontuario={prontuario}
        setProntuario={setProntuario}
        formatDateShort={formatDateShort}
      />
    </div>
  );
};

// Modal de Finalização de Consulta
const FinalizeModal = ({ show, onClose, onSubmit, appointment, didAttend, setDidAttend, prontuario, setProntuario, formatDateShort }) => {
  if (!show || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Finalizar Consulta</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <p className="text-sm text-gray-700 mb-4">
          Confirme a finalização da consulta com <strong>{appointment.aluno_nome}</strong> agendada para <strong>{formatDateShort(appointment.data_agendamento)}</strong> às <strong>{appointment.hora_agendamento}</strong>.
        </p>
        
        {/* Campo Prontuário */}
        <div className="mb-6">
          <label htmlFor="prontuario" className="block text-sm font-medium text-gray-700 mb-2">
            Prontuário
          </label>
          <textarea
            id="prontuario"
            name="prontuario"
            rows="6"
            value={prontuario}
            onChange={(e) => setProntuario(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Registre aqui o prontuário da consulta..."
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">O aluno compareceu à consulta?</label>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-green-600"
                name="didAttend"
                value="true"
                checked={didAttend === true}
                onChange={() => setDidAttend(true)}
              />
              <span className="ml-2 text-sm text-gray-700">Sim, Compareceu</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-red-600"
                name="didAttend"
                value="false"
                checked={didAttend === false}
                onChange={() => setDidAttend(false)}
              />
              <span className="ml-2 text-sm text-gray-700">Não, Faltou</span>
            </label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Voltar
          </button>
          <button
            onClick={onSubmit}
            disabled={!prontuario} // Desabilita se o prontuário estiver vazio
            className={`inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors ${
              !prontuario
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            Finalizar Consulta
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgendamentoPsicologo;