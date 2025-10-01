import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, AlertCircle, Send, Monitor, MapPin } from 'lucide-react';
import axios from 'axios'; // Importar axios para fazer requisições HTTP

const API_BASE_URL = 'http://localhost:5000/api'; // Ajuste conforme a URL do seu backend

const Agendamento = () => {
  const [selectedPsychologist, setSelectedPsychologist] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [notes, setNotes] = useState('');
  const [psychologists, setPsychologists] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dados estáticos para horários e modalidades (podem vir do backend no futuro)
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const attendanceModes = [
    {
      id: 'online',
      label: 'Online',
      description: 'Consulta por videochamada',
      icon: Monitor,
      color: 'blue'
    },
    {
      id: 'presencial',
      label: 'Presencial',
      description: 'Consulta no consultório',
      icon: MapPin,
      color: 'green'
    }
  ];

  // Função para buscar psicólogos do backend
  const fetchPsychologists = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/psicologos`);
      setPsychologists(response.data);
    } catch (err) {
      console.error('Erro ao buscar psicólogos:', err);
      setError('Não foi possível carregar a lista de psicólogos.');
    }
  };

  // Função para buscar meus agendamentos do backend
  const fetchMyAppointments = async () => {
    try {
      const token = localStorage.getItem('access_token'); // Assumindo que o token JWT está no localStorage
      if (!token) {
        console.warn('Token de acesso não encontrado. Não foi possível carregar agendamentos.');
        setLoading(false);
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/agendamentos/meus`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMyAppointments(response.data);
    } catch (err) {
      console.error('Erro ao buscar meus agendamentos:', err);
      setError('Não foi possível carregar seus agendamentos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPsychologists();
    fetchMyAppointments();
  }, []);

  const handlePsychologistSelect = (psychologist) => {
    setSelectedPsychologist(psychologist);
    setSelectedMode(''); // Reset mode selection when changing psychologist
  };

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
  };

  const handleSubmit = async () => {
    if (!selectedPsychologist || !selectedDate || !selectedTime || !selectedMode) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Você precisa estar logado para agendar.');
        return;
      }

      const appointmentData = {
        psicologo_id: selectedPsychologist.id,
        data_agendamento: selectedDate,
        hora_agendamento: selectedTime,
        modalidade: selectedMode,
        notas: notes,
      };

      await axios.post(`${API_BASE_URL}/agendamentos`, appointmentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Agendamento solicitado com sucesso!');
      // Atualizar a lista de agendamentos após o sucesso
      fetchMyAppointments();
      // Resetar o formulário
      setSelectedPsychologist(null);
      setSelectedDate('');
      setSelectedTime('');
      setSelectedMode('');
      setNotes('');
    } catch (err) {
      console.error('Erro ao solicitar agendamento:', err);
      alert('Erro ao solicitar agendamento. Tente novamente.');
    }
  };

  // Filter available modes based on selected psychologist
  const getAvailableModes = () => {
    if (!selectedPsychologist) return [];
    return attendanceModes.filter(mode => 
      selectedPsychologist.modes.includes(mode.id)
    );
  };

  if (loading) {
    return <div className="text-center py-8">Carregando agendamentos e psicólogos...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Erro: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Agendamento com Psicólogos
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Conecte-se com psicólogos voluntários especializados em saúde mental universitária
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulário de Agendamento */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Calendar className="h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Solicitar Agendamento
                </h2>
              </div>

              {/* Seleção de Psicólogo */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Selecione um psicólogo: *
                </label>
                <div className="space-y-3">
                  {psychologists.length > 0 ? (
                    psychologists.map((psychologist) => (
                      <div
                        key={psychologist.id}
                        onClick={() => handlePsychologistSelect(psychologist)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedPsychologist?.id === psychologist.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{psychologist.name}</h3>
                            <p className="text-sm text-blue-600 mb-1">{psychologist.specialty}</p>
                            {/* <p className="text-xs text-gray-600 mb-2">
                              Disponível: {psychologist.availability}
                            </p> */}
                            {/* <p className="text-sm text-gray-600 mb-2">{psychologist.description}</p> */}
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-xs text-gray-500">Modalidades:</span>
                              {psychologist.modes && psychologist.modes.length > 0 ? (
                                psychologist.modes.map((mode) => (
                                  <span
                                    key={mode}
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                                      mode === 'online'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-green-100 text-green-700'
                                    }`}
                                  >
                                    {mode === 'online' ? 'Online' : 'Presencial'}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-gray-500">Nenhuma</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Nenhum psicólogo disponível no momento.</p>
                  )}
                </div>
              </div>

              {/* Seleção de Modalidade de Atendimento */}
              {selectedPsychologist && getAvailableModes().length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Modalidade de atendimento: *
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {getAvailableModes().map((mode) => {
                      const IconComponent = mode.icon;
                      return (
                        <div
                          key={mode.id}
                          onClick={() => handleModeSelect(mode.id)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedMode === mode.id
                              ? `border-${mode.color}-500 bg-${mode.color}-50`
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${
                              mode.color === 'blue' ? 'bg-blue-100' : 'bg-green-100'
                            }`}>
                              <IconComponent className={`h-5 w-5 ${
                                mode.color === 'blue' ? 'text-blue-600' : 'text-green-600'
                              }`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{mode.label}</h3>
                              <p className="text-sm text-gray-600">{mode.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Data Preferida */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data preferida: *
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Horário Preferido */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horário preferido: *
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione um horário</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notas */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas (opcional):
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Descreva brevemente o que gostaria de abordar na consulta..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!selectedPsychologist || !selectedDate || !selectedTime || !selectedMode}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  selectedPsychologist && selectedDate && selectedTime && selectedMode
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Send className="h-4 w-4" />
                  <span>Solicitar Agendamento</span>
                </div>
              </button>
            </div>
          </div>

          {/* Sidebar - Meus Agendamentos */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Clock className="h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Meus Agendamentos
                </h2>
              </div>

              <div className="space-y-4">
                {myAppointments.length > 0 ? (
                  myAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{appointment.psicologo_nome}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          appointment.status === 'Confirmado'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                      {/* <p className="text-sm text-gray-600 mb-2">{appointment.specialty}</p> */}
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{appointment.data_agendamento}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.hora_agendamento}</span>
                        </div>
                      </div>
                      {/* Nova seção para mostrar a modalidade */}
                      <div className="flex items-center space-x-2 mb-2">
                        {appointment.modalidade === 'online' ? (
                          <Monitor className="h-4 w-4 text-blue-500" />
                        ) : (
                          <MapPin className="h-4 w-4 text-green-500" />
                        )}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          appointment.modalidade === 'online'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {appointment.modalidade === 'online' ? 'Online' : 'Presencial'}
                        </span>
                      </div>
                      {appointment.notas && <p className="text-sm text-gray-600 italic">"{appointment.notas}"</p>}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Você não possui agendamentos futuros.</p>
                )}
              </div>
            </div>

            {/* Informações Importantes */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Informações Importantes</h3>
              </div>
              
              <div className="space-y-3 text-sm text-blue-800">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Selecione um psicólogo, modalidade e horário de sua preferência</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>O profissional entrará em contato para confirmar</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Consultas online são realizadas por videochamada</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Consultas presenciais são no consultório do profissional</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Serviço gratuito para universitários</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-yellow-800">
                    <p className="font-medium mb-1">Lembre-se:</p>
                    <ul className="space-y-1">
                      <li>• Este é um serviço de apoio, não substitui tratamento médico</li>
                      <li>• Em emergências, procure ajuda imediatamente (CVV: 188)</li>
                      <li>• Seja pontual e respeite os horários agendados</li>
                      <li>• Cancele com antecedência se não puder comparecer</li>
                      <li>• Para consultas online, teste sua conexão previamente</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Agendamento;