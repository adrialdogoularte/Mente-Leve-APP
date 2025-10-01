import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Monitor, MapPin, Eye, X, FileText } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const AgendamentoPsicologo = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Token de acesso não encontrado. Faça login novamente.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/agendamentos/meus`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      case 'agendado':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      case 'concluido':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'agendado':
        return 'Agendado';
      case 'cancelado':
        return 'Cancelado';
      case 'concluido':
        return 'Concluído';
      default:
        return 'Pendente';
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
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
    return appointmentDate >= now && app.status !== 'cancelado';
  });

  const pastAppointments = sortedAppointments.filter(app => {
    const appointmentDate = new Date(app.data_agendamento + 'T' + app.hora_agendamento);
    const now = new Date();
    return appointmentDate < now || app.status === 'concluido';
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
                <p className="text-2xl font-bold text-gray-900">{pastAppointments.length}</p>
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
                          <div className="bg-blue-100 p-3 rounded-full">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            Consulta com {appointment.aluno_nome || 'Aluno'}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDateShort(appointment.data_agendamento)}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {appointment.hora_agendamento}
                            </span>
                            <span className="flex items-center">
                              {appointment.modalidade === 'online' ? (
                                <>
                                  <Monitor className="h-4 w-4 mr-1 text-blue-500" />
                                  <span className="text-blue-600">Online</span>
                                </>
                              ) : (
                                <>
                                  <MapPin className="h-4 w-4 mr-1 text-green-500" />
                                  <span className="text-green-600">Presencial</span>
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status || 'agendado')}`}>
                          {getStatusText(appointment.status || 'agendado')}
                        </span>
                        <button
                          onClick={() => handleViewDetails(appointment)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Histórico de Consultas</h2>
          {pastAppointments.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="divide-y divide-gray-200">
                {pastAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="bg-gray-100 p-3 rounded-full">
                            <User className="h-6 w-6 text-gray-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            Consulta com {appointment.aluno_nome || 'Aluno'}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDateShort(appointment.data_agendamento)}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {appointment.hora_agendamento}
                            </span>
                            <span className="flex items-center">
                              {appointment.modalidade === 'online' ? (
                                <>
                                  <Monitor className="h-4 w-4 mr-1 text-blue-500" />
                                  <span className="text-blue-600">Online</span>
                                </>
                              ) : (
                                <>
                                  <MapPin className="h-4 w-4 mr-1 text-green-500" />
                                  <span className="text-green-600">Presencial</span>
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status || 'concluido')}`}>
                          {getStatusText(appointment.status || 'concluido')}
                        </span>
                        <button
                          onClick={() => handleViewDetails(appointment)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma consulta realizada</h3>
                <p className="text-gray-500">
                  Quando você realizar consultas, elas aparecerão aqui no histórico.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Mensagem quando não há consultas */}
        {appointments.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma consulta agendada</h3>
              <p className="text-gray-500">
                Quando os alunos agendarem consultas com você, elas aparecerão aqui.
              </p>
            </div>
          </div>
        )}

        {/* Modal de Detalhes */}
        {showModal && selectedAppointment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Detalhes da Consulta</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
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
                    <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAppointment.status || 'agendado')}`}>
                      {getStatusText(selectedAppointment.status || 'agendado')}
                    </span>
                  </div>
                </div>
                
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
        )}
      </main>
    </div>
  );
};

export default AgendamentoPsicologo;