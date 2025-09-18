import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Activity, Brain, Calendar, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AnalyticsHumor = () => {
  const { api } = useAuth();
  const [correlacoes, setCorrelacoes] = useState({
    atividades: [],
    emocoes: [],
    fatores_influencia: []
  });
  const [tendencias, setTendencias] = useState([]);
  const [relatorio, setRelatorio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState(30);
  const [abaSelecionada, setAbaSelecionada] = useState('correlacoes');

  const cores = {
    positivo: '#10B981',
    neutro: '#F59E0B', 
    negativo: '#EF4444'
  };

  const coresPie = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  useEffect(() => {
    carregarDados();
  }, [periodo]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [correlResponse, tendenciasResponse, relatorioResponse] = await Promise.all([
        api.get(`/analytics/correlacao-humor-atividades?dias=${periodo}`),
        api.get(`/analytics/tendencias-humor?dias=${periodo}`),
        api.get('/analytics/relatorio-completo')
      ]);

      setCorrelacoes(correlResponse.data.correlacoes || {});
      setTendencias(tendenciasResponse.data.tendencias || []);
      setRelatorio(relatorioResponse.data);
    } catch (error) {
      console.error('Erro ao carregar dados de analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatarDadosParaGrafico = (dados) => {
    return dados.slice(0, 10).map(item => ({
      nome: item.item.length > 15 ? item.item.substring(0, 15) + '...' : item.item,
      humor: item.media_humor,
      frequencia: item.frequencia,
      cor: cores[item.impacto]
    }));
  };

  const formatarDistribuicaoHumor = () => {
    if (!relatorio?.estatisticas_humor?.distribuicao_percentual) return [];
    
    const labels = {
      '1': 'Muito Ruim',
      '2': 'Ruim', 
      '3': 'Neutro',
      '4': 'Bom',
      '5': 'Muito Bom'
    };

    return Object.entries(relatorio.estatisticas_humor.distribuicao_percentual).map(([nivel, percentual]) => ({
      name: labels[nivel],
      value: percentual,
      nivel: parseInt(nivel)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Análise do Humor</h1>
        <p className="text-gray-600">Insights sobre seus padrões de humor e bem-estar</p>
      </div>

      {/* Controles */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Período de análise</label>
          <select
            value={periodo}
            onChange={(e) => setPeriodo(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value={7}>Últimos 7 dias</option>
            <option value={30}>Últimos 30 dias</option>
            <option value={90}>Últimos 90 dias</option>
          </select>
        </div>
      </div>

      {/* Abas */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'correlacoes', nome: 'Correlações', icone: Activity },
              { id: 'tendencias', nome: 'Tendências', icone: TrendingUp },
              { id: 'relatorio', nome: 'Relatório', icone: FileText }
            ].map(({ id, nome, icone: Icone }) => (
              <button
                key={id}
                onClick={() => setAbaSelecionada(id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  abaSelecionada === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icone className="h-4 w-4 mr-2" />
                {nome}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Conteúdo das abas */}
      {abaSelecionada === 'correlacoes' && (
        <div className="space-y-6">
          {/* Atividades */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Atividades e Humor</h3>
            {correlacoes.atividades?.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={formatarDadosParaGrafico(correlacoes.atividades)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" angle={-45} textAnchor="end" height={80} />
                  <YAxis domain={[1, 5]} />
                  <Tooltip 
                    formatter={(value, name) => [
                      `Humor médio: ${value}`,
                      name === 'humor' ? 'Humor' : name
                    ]}
                  />
                  <Bar dataKey="humor" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">Não há dados suficientes para análise de atividades</p>
            )}
          </div>

          {/* Fatores de Influência */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Fatores de Influência</h3>
            {correlacoes.fatores_influencia?.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={formatarDadosParaGrafico(correlacoes.fatores_influencia)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" angle={-45} textAnchor="end" height={80} />
                  <YAxis domain={[1, 5]} />
                  <Tooltip />
                  <Bar dataKey="humor" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">Não há dados suficientes para análise de fatores</p>
            )}
          </div>
        </div>
      )}

      {abaSelecionada === 'tendencias' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tendência do Humor ao Longo do Tempo</h3>
          {tendencias.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={tendencias}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data_formatada" />
                <YAxis domain={[1, 5]} />
                <Tooltip 
                  formatter={(value) => [`Humor: ${value}`, 'Nível']}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="humor" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Não há dados suficientes para análise de tendências</p>
          )}
        </div>
      )}

      {abaSelecionada === 'relatorio' && relatorio && (
        <div className="space-y-6">
          {/* Estatísticas Gerais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Humor Médio</p>
                  <p className="text-2xl font-bold text-gray-900">{relatorio.estatisticas_humor.media}/5</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Registros</p>
                  <p className="text-2xl font-bold text-gray-900">{relatorio.periodo.total_registros}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Humor Mais Frequente</p>
                  <p className="text-2xl font-bold text-gray-900">{relatorio.estatisticas_humor.mais_frequente}/5</p>
                </div>
              </div>
            </div>
          </div>

          {/* Distribuição do Humor */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribuição do Humor</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={formatarDistribuicaoHumor()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {formatarDistribuicaoHumor().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={coresPie[index % coresPie.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Recomendações */}
          {relatorio.recomendacoes?.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recomendações Personalizadas</h3>
              <div className="space-y-3">
                {relatorio.recomendacoes.map((recomendacao, index) => (
                  <div key={index} className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                    <p className="text-blue-800">{recomendacao}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyticsHumor;

