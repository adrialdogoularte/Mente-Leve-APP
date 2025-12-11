import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, Calendar, Zap, Save, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegistroHumor = () => {
  const { api, user } = useAuth();
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [notes, setNotes] = useState('');
  const [emocoes, setEmocoes] = useState([]);
  const [fatoresInfluencia, setFatoresInfluencia] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [atividadesPlanejadas, setAtividadesPlanejadas] = useState([]);
  const [horasSono, setHorasSono] = useState('');
  const [qualidadeSono, setQualidadeSono] = useState(null);
  const [nivelEstresse, setNivelEstresse] = useState(null);
  const [dataRegistro, setDataRegistro] = useState(new Date().toISOString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1);
  const [moodHistory, setMoodHistory] = useState([]);
  const [stats, setStats] = useState({
    total_registros: 0,
    media_humor: 0,
    emocoes_frequentes: [],
    fatores_frequentes: []
  });
  const [pageLoading, setPageLoading] = useState(true);
  
  const TOTAL_STEPS = 4;

  const moods = [
    { id: 1, emoji: '😢', label: 'Muito Ruim', color: 'bg-red-100 border-red-300 text-red-700' },
    { id: 2, emoji: '😞', label: 'Ruim', color: 'bg-orange-100 border-orange-300 text-orange-700' },
    { id: 3, emoji: '😐', label: 'Neutro', color: 'bg-gray-100 border-gray-300 text-gray-700' },
    { id: 4, emoji: '😊', label: 'Bom', color: 'bg-green-100 border-green-300 text-green-700' },
    { id: 5, emoji: '😄', label: 'Muito Bom', color: 'bg-yellow-100 border-yellow-300 text-yellow-700' }
  ];

  const emocoesDisponiveis = ['Feliz', 'Triste', 'Ansioso', 'Calmo', 'Irritado', 'Grato', 'Cansado', 'Motivado', 'Estressado', 'Relaxado', 'Preocupado', 'Confiante', 'Solitário', 'Amado'];
  const fatoresDisponiveis = ['Estudos', 'Trabalho', 'Família', 'Amigos', 'Relacionamento', 'Saúde', 'Exercício', 'Alimentação', 'Sono', 'Clima', 'Finanças', 'Lazer', 'Redes Sociais', 'Notícias'];
  const atividadesDisponiveis = ['Estudar', 'Trabalhar', 'Exercitar-se', 'Meditar', 'Ler', 'Assistir TV/Filmes', 'Ouvir música', 'Cozinhar', 'Sair com amigos', 'Dormir', 'Jogar', 'Arte/Criatividade'];

  useEffect(() => {
    const initializePage = async () => {
      try {
        setPageLoading(true);
        await Promise.all([carregarHistorico(), carregarEstatisticas()]);
      } catch (error) {
        console.error('Erro ao inicializar página:', error);
      } finally {
        setPageLoading(false);
      }
    };
    initializePage();
  }, []);

  const carregarHistorico = async () => {
    try {
      const response = await api.get('/humor?limite=10');
      setMoodHistory(response.data?.registros || []);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      setMoodHistory([]);
    }
  };

  const carregarEstatisticas = async () => {
    try {
      const response = await api.get('/humor/estatisticas');
      setStats(response.data || { total_registros: 0, media_humor: 0, emocoes_frequentes: [], fatores_frequentes: [] });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      setStats({ total_registros: 0, media_humor: 0, emocoes_frequentes: [], fatores_frequentes: [] });
    }
  };

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId);
    setError('');
    setStep(1);
  };

  const handleNextStep = () => {
    if (step < TOTAL_STEPS) {
      setStep(prev => prev + 1);
    }
  };

  const handleEmocoesChange = (emocao) => setEmocoes(prev => prev.includes(emocao) ? prev.filter(e => e !== emocao) : [...prev, emocao]);
  const handleFatoresChange = (fator) => setFatoresInfluencia(prev => prev.includes(fator) ? prev.filter(f => f !== fator) : [...prev, fator]);
  const handleAtividadesChange = (atividade) => setAtividades(prev => prev.includes(atividade) ? prev.filter(a => a !== atividade) : [...prev, atividade]);
  const handleAtividadesPlanejadas = (atividade) => setAtividadesPlanejadas(prev => prev.includes(atividade) ? prev.filter(a => a !== atividade) : [...prev, atividade]);

  const handleSubmit = async () => {
    if (!selectedMood) {
      setError('Por favor, selecione um nível de humor');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const dadosRegistro = { nivel_humor: selectedMood, data_registro: dataRegistro, descricao: notes, emocoes, fatores_influencia: fatoresInfluencia, atividades, atividades_planejadas: atividadesPlanejadas, horas_sono: horasSono ? parseFloat(horasSono) : null, qualidade_sono: qualidadeSono, nivel_estresse: nivelEstresse };
      await api.post('/humor', dadosRegistro);
      setSuccess('Registro de humor salvo com sucesso!');
      setSelectedMood(null);
      setNotes('');
      setEmocoes([]);
      setFatoresInfluencia([]);
      setAtividades([]);
      setAtividadesPlanejadas([]);
      setHorasSono('');
      setQualidadeSono(null);
      setNivelEstresse(null);
      setDataRegistro(new Date().toISOString());
      setStep(1);
      await Promise.all([carregarHistorico(), carregarEstatisticas()]);
    } catch (error) {
      console.error('Erro ao salvar registro:', error);
      setError(error.response?.data?.message || 'Erro ao salvar registro');
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataString) => {
    try {
      if (dataString && dataString.includes('T')) {
        const date = new Date(dataString);
        const dataCorrigida = new Date(date.getTime() - (3 * 60 * 60 * 1000));
        let dataFormatada = dataCorrigida.toLocaleString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
        return dataFormatada.replace(',', '').replace(/\//g, '-');
      }
      const date = new Date(dataString + 'T00:00:00');
      let dataFormatada = date.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' });
      return dataFormatada.replace(/\//g, '-');
    } catch (error) {
      return dataString;
    }
  };

  const obterEmojiHumor = (nivel) => {
    const mood = moods.find(m => m.id === nivel);
    return mood ? mood.emoji : '😐';
  };

  const NextButton = () => (
    <div className="mt-8 flex justify-center">
      <button 
        onClick={handleNextStep} 
        className="py-3 px-6 rounded-lg font-medium transition-colors flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
      >
        <span>Próximo Passo ({step}/{TOTAL_STEPS})</span>
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.tipo_usuario !== 'aluno') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Acesso Restrito</h2>
          <p className="text-gray-600 mb-4">Esta funcionalidade é exclusiva para alunos.</p>
          <button 
            onClick={() => navigate('/')} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            {/* <button onClick={() => navigate('/perfil')} className="mr-4 p-2 text-gray-400 hover:text-gray-600">
              <ArrowLeft className="h-5 w-5" />
            </button> */}
            <h1 className="text-3xl font-bold text-gray-900">Registro de Humor</h1>
          </div>
          <p className="text-gray-600">Acompanhe seu bem-estar emocional diariamente</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <Save className="h-5 w-5 text-green-500" />
            <span className="text-green-700 text-sm">{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Novo Registro</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Como você está se sentindo hoje? *
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {moods.map((mood) => (
                    <button 
                      key={mood.id} 
                      onClick={() => handleMoodSelect(mood.id)} 
                      className={`
                        p-4 rounded-lg border-2 transition-all text-center 
                        ${selectedMood === mood.id ? `${mood.color} border-current` : 'bg-white border-gray-200 hover:border-gray-300'}
                      `}
                    >
                      <div className="text-2xl mb-2">{mood.emoji}</div>
                      <div className="text-xs font-medium">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedMood && (
                <div className="border-t pt-6 mt-6">
                  {step === 1 && (
                    <div className="text-center">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Que emoções você sentiu hoje?
                      </label>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {emocoesDisponiveis.map((emocao) => (
                          <button 
                            key={emocao} 
                            onClick={() => handleEmocoesChange(emocao)} 
                            className={`
                              px-3 py-1 rounded-full text-sm transition-colors 
                              ${emocoes.includes(emocao) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                            `}
                          >
                            {emocao}
                          </button>
                        ))}
                      </div>
                      <NextButton />
                    </div>
                  )}

                  {step === 2 && (
                    <div className="text-center">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        O que influenciou seu humor hoje?
                      </label>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {fatoresDisponiveis.map((fator) => (
                          <button 
                            key={fator} 
                            onClick={() => handleFatoresChange(fator)} 
                            className={`
                              px-3 py-1 rounded-full text-sm transition-colors 
                              ${fatoresInfluencia.includes(fator) ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                            `}
                          >
                            {fator}
                          </button>
                        ))}
                      </div>
                      <NextButton />
                    </div>
                  )}

                  {step === 3 && (
                    <div className="text-center">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Que atividades você fez hoje?
                      </label>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {atividadesDisponiveis.map((atividade) => (
                          <button 
                            key={atividade} 
                            onClick={() => handleAtividadesChange(atividade)} 
                            className={`
                              px-3 py-1 rounded-full text-sm transition-colors 
                              ${atividades.includes(atividade) ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                            `}
                          >
                            {atividade}
                          </button>
                        ))}
                      </div>
                      <NextButton />
                    </div>
                  )}

                  {step === 4 && (
                    <div className="text-center">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Como foi sua noite de sono e seu nível de estresse?
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 max-w-lg mx-auto">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Horas de Sono</label>
                          <input type="number" step="0.5" min="0" max="24" value={horasSono} onChange={(e) => setHorasSono(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="8.5" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Qualidade do Sono</label>
                          <select value={qualidadeSono || ''} onChange={(e) => setQualidadeSono(e.target.value ? parseInt(e.target.value) : null)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option value="">Selecione</option>
                            {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v} - {['Muito Ruim', 'Ruim', 'Regular', 'Bom', 'Excelente'][v-1]}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Nível de Estresse</label>
                          <select value={nivelEstresse || ''} onChange={(e) => setNivelEstresse(e.target.value ? parseInt(e.target.value) : null)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option value="">Selecione</option>
                            {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v} - {['Muito Baixo', 'Baixo', 'Moderado', 'Alto', 'Muito Alto'][v-1]}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-6 mt-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notas adicionais (opcional)
                    </label>
                    <textarea 
                      value={notes} 
                      onChange={(e) => setNotes(e.target.value)} 
                      rows={3} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
                      placeholder="Como foi seu dia? Algo específico que gostaria de registrar?" 
                    />
                  </div>

                  <div className="mt-6">
                    <button 
                      onClick={handleSubmit} 
                      disabled={loading} 
                      className={`
                        w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 
                        ${loading ? 'bg-gray-300 text-gray-500' : 'bg-green-500 hover:bg-green-600 text-white'}
                      `}
                    >
                      <Save className="h-5 w-5" />
                      <span>{loading ? 'Salvando...' : 'Salvar e Finalizar'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-gray-600">Total de registros</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.total_registros}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-600">Humor médio</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.media_humor ? stats.media_humor.toFixed(1) : '0.0'}</span>
                </div>
                {stats.emocoes_frequentes?.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-600 block mb-2">Emoções frequentes</span>
                    <div className="space-y-1">
                      {stats.emocoes_frequentes.slice(0, 3).map(([emocao, count]) => (
                        <div key={emocao} className="flex justify-between text-sm">
                          <span className="text-gray-700">{emocao}</span>
                          <span className="text-gray-500">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Registros Recentes</h3>
              {moodHistory.length > 0 ? (
                <div className="space-y-3">
                  {moodHistory.slice(0, 5).map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{obterEmojiHumor(r.nivel_humor)}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{formatarData(r.data_registro)}</div>
                          {r.descricao && <div className="text-xs text-gray-500 truncate max-w-32">{r.descricao}</div>}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">{r.nivel_humor}/5</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Zap className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Nenhum registro ainda</p>
                </div>
              )}
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Explorar Mais</h3>
              <div className="space-y-3">
                <button onClick={() => navigate("/lembretes")} className="w-full flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  <Calendar className="h-4 w-4 mr-2" /> Lembretes Diários
                </button>
                <button onClick={() => navigate("/analytics")} className="w-full flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                  <TrendingUp className="h-4 w-4 mr-2" /> Análises de Humor
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegistroHumor;