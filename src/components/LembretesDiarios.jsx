import React, { useState, useEffect } from 'react';
import { Bell, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LembretesDiarios = () => {
  const { api } = useAuth();
  const [configuracao, setConfiguracao] = useState({
    ativo: false,
    horario: '20:00'
  });
  const [status, setStatus] = useState({
    registrou_hoje: false,
    data_ultimo_registro: null
  });
  const [sugestoes, setSugestoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    carregarStatus();
    carregarSugestoes();
  }, []);

  const carregarStatus = async () => {
    try {
      const response = await api.get('/lembretes/status');
      const data = response.data;
      
      setConfiguracao({
        ativo: data.lembrete_ativo,
        horario: data.horario
      });
      
      setStatus({
        registrou_hoje: data.registrou_hoje,
        data_ultimo_registro: data.data_ultimo_registro
      });
    } catch (error) {
      console.error('Erro ao carregar status:', error);
    }
  };

  const carregarSugestoes = async () => {
    try {
      const response = await api.get('/lembretes/sugestoes');
      setSugestoes(response.data.sugestoes || []);
    } catch (error) {
      console.error('Erro ao carregar sugestões:', error);
    }
  };

  const salvarConfiguracao = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      await api.post('/lembretes/configurar', configuracao);
      setMessage('Configuração salva com sucesso!');
      await carregarStatus();
    } catch (error) {
      setMessage('Erro ao salvar configuração');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLembrete = () => {
    setConfiguracao(prev => ({
      ...prev,
      ativo: !prev.ativo
    }));
  };

  const alterarHorario = (novoHorario) => {
    setConfiguracao(prev => ({
      ...prev,
      horario: novoHorario
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <Bell className="h-6 w-6 text-blue-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Lembretes Diários</h2>
        </div>

        {/* Status do dia */}
        <div className="mb-6 p-4 rounded-lg bg-gray-50">
          <div className="flex items-center mb-2">
            {status.registrou_hoje ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
            )}
            <span className="font-medium">
              {status.registrou_hoje 
                ? 'Você já registrou seu humor hoje!' 
                : 'Ainda não registrou seu humor hoje'
              }
            </span>
          </div>
          {status.data_ultimo_registro && (
            <p className="text-sm text-gray-600">
              Último registro: {new Date(status.data_ultimo_registro).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>

        {/* Configuração do lembrete */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Configurar Lembrete</h3>
          
          <div className="flex items-center justify-between mb-4 p-4 border rounded-lg">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-700">Lembrete diário ativo</span>
            </div>
            <button
              onClick={toggleLembrete}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                configuracao.ativo ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  configuracao.ativo ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {configuracao.ativo && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horário do lembrete
              </label>
              <input
                type="time"
                value={configuracao.horario}
                onChange={(e) => alterarHorario(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <button
            onClick={salvarConfiguracao}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Salvando...' : 'Salvar Configuração'}
          </button>

          {message && (
            <div className={`mt-3 p-3 rounded-lg ${
              message.includes('sucesso') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Sugestões personalizadas */}
        {sugestoes.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Sugestões Personalizadas</h3>
            <div className="space-y-3">
              {sugestoes.map((sugestao, index) => (
                <div key={index} className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                  <p className="text-blue-800">{sugestao}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LembretesDiarios;

