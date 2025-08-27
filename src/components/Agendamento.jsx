import React, { useState } from 'react';
import { Calendar, Clock, User, CheckCircle, AlertCircle, Send } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const Agendamento = () => {
  const [selectedPsychologist, setSelectedPsychologist] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');

  const psychologists = [
    {
      id: 1,
      name: 'Dra. Ana Silva',
      specialty: 'Ansiedade e Estresse Acadêmico',
      availability: 'Segunda, Terça, Quinta, Sexta',
      description: 'Especialista em ansiedade e estresse acadêmico com mais de 8 anos de experiência.'
    },
    {
      id: 2,
      name: 'Dr. Carlos Santos',
      specialty: 'Depressão e Autoestima',
      availability: 'Terça, Quinta',
      description: 'Psicólogo clínico especializado em depressão e questões de autoestima.'
    },
    {
      id: 3,
      name: 'Dra. Maria Oliveira',
      specialty: 'Relacionamentos e Habilidades Sociais',
      availability: 'Segunda, Terça, Quinta, Quinta, Sexta',
      description: 'Especialista em terapia de relacionamentos e desenvolvimento de habilidades sociais.'
    },
    {
      id: 4,
      name: 'Dr. João Costa',
      specialty: 'Transtornos do Sono e Bem-estar',
      availability: 'Quarta, Sexta, Sábado',
      description: 'Psicólogo especializado em transtornos do sono e promoção do bem-estar geral.'
    }
  ];

  const myAppointments = [
    {
      id: 1,
      psychologist: 'Dra. Ana Silva',
      specialty: 'Ansiedade e Estresse Acadêmico',
      date: '24/01/2024',
      time: '14:00',
      status: 'Confirmado',
      notes: 'Primeira consulta'
    },
    {
      id: 2,
      psychologist: 'Dr. Carlos Santos',
      specialty: 'Depressão e Autoestima',
      date: '23/01/2024',
      time: '10:00',
      status: 'Pendente',
      notes: 'Questões de autoestima'
    }
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const handlePsychologistSelect = (psychologist) => {
    setSelectedPsychologist(psychologist);
  };

  const handleSubmit = () => {
    if (selectedPsychologist && selectedDate && selectedTime) {
      console.log('Agendamento solicitado:', {
        psychologist: selectedPsychologist,
        date: selectedDate,
        time: selectedTime,
        notes
      });
      // Reset form
      setSelectedPsychologist(null);
      setSelectedDate('');
      setSelectedTime('');
      setNotes('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
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
                  {psychologists.map((psychologist) => (
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
                          <p className="text-xs text-gray-600 mb-2">
                            Disponível: {psychologist.availability}
                          </p>
                          <p className="text-sm text-gray-600">{psychologist.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

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
                disabled={!selectedPsychologist || !selectedDate || !selectedTime}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  selectedPsychologist && selectedDate && selectedTime
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
                {myAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{appointment.psychologist}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        appointment.status === 'Confirmado'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{appointment.specialty}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 italic">"{appointment.notes}"</p>
                  </div>
                ))}
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
                  <span>Selecione um psicólogo e horário de sua preferência</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>O profissional entrará em contato para confirmar</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>As consultas podem ser presenciais ou online</span>
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
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Agendamento;

