import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, AlertCircle, Send, Monitor, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AgendamentoAluno = () => {
  const { api } = useAuth();
  const [selectedPsychologist, setSelectedPsychologist] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [notes, setNotes] = useState('');
  const [allowEvaluationAccess, setAllowEvaluationAccess] = useState(false);
  const [psychologists, setPsychologists] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para calcular horários disponíveis baseados na disponibilidade do psicólogo e data selecionada
  const calculateAvailableTimes = (psychologist, date) => {
    const currentPsychologist = psychologist || selectedPsychologist;
    const currentDate = date || selectedDate;

    if (!currentPsychologist || !currentDate) {
      setAvailableTimes([]);
      return;
    }

    try {
      // Obter o dia da semana da data selecionada
      const dateObj = new Date(currentDate + 'T00:00:00');
      const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      
      const psychologistAvailability = currentPsychologist.availability || {};
      
      // 1. Acessar a disponibilidade para o dia da semana
      const dayAvailability = psychologistAvailability[dayOfWeek];
      
      if (!dayAvailability) {
        setAvailableTimes([]);
        return;
      }
      
      // 2. Acessar os horários disponíveis para a data específica
      const timesForSelectedDate = dayAvailability[currentDate] || [];
      
      setAvailableTimes(timesForSelectedDate);
      
    } catch (error) {
      console.error('Erro ao calcular horários disponíveis:', error);
      setAvailableTimes([]);
    }
  };

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
      const response = await api.get("/psicologos");
      setPsychologists(response.data);
    } catch (err) {
      console.error('Erro ao buscar psicólogos:', err);
      setError('Não foi possível carregar a lista de psicólogos.');
    }
  };

  // Função para buscar meus agendamentos do backend
  const fetchMyAppointments = async () => {
    try {
      const response = await api.get("/agendamentos/meus");
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

  // Recalcular horários disponíveis quando a data ou psicólogo mudar
  useEffect(() => {
    calculateAvailableTimes(selectedPsychologist, selectedDate);
  }, [selectedDate, selectedPsychologist]);

  const handlePsychologistSelect = (psychologist) => {
    setSelectedPsychologist(psychologist);
    setSelectedMode(''); // Reset mode selection when changing psychologist
    setSelectedTime(''); // Reset time selection when changing psychologist
    calculateAvailableTimes(psychologist, selectedDate);
  };

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time selection when changing date
  };

  const handleSubmit = async () => {
    if (!selectedPsychologist || !selectedDate || !selectedTime || !selectedMode) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const appointmentData = {
        psicologo_id: selectedPsychologist.id,
        data_agendamento: selectedDate,
        hora_agendamento: selectedTime,
        modalidade: selectedMode,
        notas: notes,
        permitir_acesso_avaliacoes: allowEvaluationAccess,
      };

      await api.post("/agendamentos", appointmentData);

      alert('Agendamento solicitado com sucesso!');
      // Atualizar a lista de agendamentos e a lista de psicólogos (para recarregar a disponibilidade)
      await fetchMyAppointments();
      await fetchPsychologists();
      // Resetar o formulário
      setSelectedPsychologist(null);
      setSelectedDate('');
      setSelectedTime('');
      setSelectedMode('');
      setNotes('');
      setAllowEvaluationAccess(false);
        } catch (err) {
      console.error('Erro ao solicitar agendamento:', err);
      // Tenta extrair a mensagem de erro do backend
      const errorMessage = err.response?.data?.message || 'Erro ao solicitar agendamento. Tente novamente.';
      alert(errorMessage);
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
                            <span className="text-xs text-gray-500">Especialidades:&nbsp;</span>
                            <label className="text-sm text-blue-600 mb-1">{psychologist.specialty}</label>
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
                    onChange={(e) => handleDateChange(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Horário Preferido */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horário Disponivél: *
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!selectedPsychologist || !selectedDate}
                  >
                    <option value="">
                      {!selectedPsychologist || !selectedDate 
                        ? "Selecione um psicólogo e data primeiro" 
                        : availableTimes.length === 0 
                          ? "Nenhum horário disponível para esta data"
                          : "Selecione um horário"
                      }
                    </option>
                    {availableTimes.map((time) => (
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

              {/* Flag de Permissão de Acesso às Autoavaliações */}
              <div className="flex items-start space-x-2">
                <label className="flex items-center space-x-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={allowEvaluationAccess}
                    onChange={(e) => setAllowEvaluationAccess(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Permitir que o psicólogo acesse minhas autoavaliações para esta consulta.</span>
                </label>
              </div>
              <br />

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
                  <Send className="h-5 w-5" />
                  <span>Solicitar Agendamento</span>
                </div>
              </button>
            </div>
          </div>

          {/* Meus Agendamentos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Clock className="h-5 w-5 text-purple-500" />
                <h2 className="text-lg font-semibold text-gray-900">Meus Agendamentos</h2>
              </div>
              <div className="space-y-4">
                {myAppointments.length > 0 ? (
                  myAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex flex-col">
                          <h3 className="font-semibold text-gray-900">
                            Consulta com {appointment.psicologo_nome || 'Psicólogo'}
                          </h3>
                          {appointment.modalidade === 'online' && appointment.link_videoconferencia && (
                            <a 
                              href={appointment.link_videoconferencia} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-500 hover:underline flex items-center mt-1"
                            >
                              <Monitor className="h-4 w-4 mr-1" /> Acessar Videochamada
                            </a>
                          )}
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment.status === 'Pendente'
                              ? 'bg-yellow-100 text-yellow-800'
                              : appointment.status === 'Confirmado'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {appointment.status || 'Pendente'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{appointment.data_agendamento ? new Date(appointment.data_agendamento + 'T00:00:00').toLocaleDateString('pt-BR') : 'Data inválida'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{appointment.hora_agendamento || 'Horário não definido'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {appointment.modalidade === 'online' ? (
                          <Monitor className="h-4 w-4 text-blue-500" />
                        ) : (
                          <MapPin className="h-4 w-4 text-green-500" />
                        )}
                        <span>{appointment.modalidade === 'online' ? 'Online' : 'Presencial'}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Você não possui agendamentos.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgendamentoAluno;