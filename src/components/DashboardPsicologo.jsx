import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, Users, Clock, TrendingUp, CheckCircle, AlertCircle, Activity, Heart } from 'lucide-react';

const DashboardPsicologo = () => {
  const { api } = useAuth();
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pendentes: 0,
    confirmados: 0,
    concluidos: 0,
    cancelados: 0
  });

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  const fetchAgendamentos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/agendamentos/psicologo');
      const agendamentosData = response.data;
      setAgendamentos(agendamentosData);
      
      // Calcular estatísticas
      const stats = {
        total: agendamentosData.length,
        pendentes: agendamentosData.filter(a => a.status === 'Pendente').length,
        confirmados: agendamentosData.filter(a => a.status === 'Confirmado').length,
        concluidos: agendamentosData.filter(a => a.status === 'Finalizado').length,
        cancelados: agendamentosData.filter(a => a.status === 'Cancelado').length
      };
      setStats(stats);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Preparar dados para os gráficos
  const prepararDadosGraficos = () => {
    // Dados para gráfico de barras - agendamentos por dia da semana
    const agendamentosPorDia = {};
    const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
    
    diasSemana.forEach(dia => {
      agendamentosPorDia[dia] = 0;
    });
    // USAR QUANDO FOR USAR TODOS OS DIAS DA SEMANA, DE DOMINGO A SEGUNDA.
    // agendamentos.forEach(agendamento => {
    //   if (agendamento.data_agendamento) {
    //     const data = new Date(agendamento.data_agendamento);
    //     const [year, month, day] = agendamento.data_agendamento.split('-').map(Number);
    //     const dataLocal = new Date(year, month - 1, day); // month - 1 porque é 0-indexed
    //     const diaSemana = diasSemana[dataLocal.getDay()];
    //     agendamentosPorDia[diaSemana]++;
    //   }
    // });

    // USAR QUANDO FOR SÓ DIAS UTEIS
      agendamentos.forEach(agendamento => {
      if (agendamento.data_agendamento) {
        const data = new Date(agendamento.data_agendamento);
        const [year, month, day] = agendamento.data_agendamento.split('-').map(Number);
        const dataLocal = new Date(year, month - 1, day); // month - 1 porque é 0-indexed
        const diaIndex = dataLocal.getDay();

        if (diaIndex >= 1 && diaIndex <= 5) { // Apenas dias úteis (Segunda a Sexta)
          const diaSemana = diasSemana[diaIndex - 1];
          agendamentosPorDia[diaSemana]++;
        }
      }
    });

    const dadosBarras = Object.entries(agendamentosPorDia).map(([dia, quantidade]) => ({
      dia,
      quantidade
    }));

    // Dados para gráfico de pizza - status dos agendamentos
    const dadosPizza = [
      { name: 'Pendentes', value: stats.pendentes, color: '#f59e0b' },
      { name: 'Confirmados', value: stats.confirmados, color: '#3b82f6' },
      { name: 'Concluídos', value: stats.concluidos, color: '#10b981' },
      { name: 'Cancelados', value: stats.cancelados, color: '#ef4444' }
    ].filter(item => item.value > 0);

    // Dados para gráfico de linha - agendamentos nos últimos 7 dias
    const hoje = new Date();
    const ultimosSete = [];
    
    for (let i = 6; i >= 0; i--) {
      const data = new Date(hoje);
      data.setDate(data.getDate() - i);
      const dataStr = data.toISOString().split('T')[0];
      
      const agendamentosNoDia = agendamentos.filter(a => {
        if (!a.data_agendamento) return false;
        const agendData = new Date(a.data_agendamento).toISOString().split('T')[0];
        return agendData === dataStr;
      }).length;

      ultimosSete.push({
        data: data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        agendamentos: agendamentosNoDia
      });
    }

    return { dadosBarras, dadosPizza, ultimosSete };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const { dadosBarras, dadosPizza, ultimosSete } = prepararDadosGraficos();

  return (
    <div className="space-y-8">
      {/* Cards de Estatísticas - Seguindo o padrão de cores do aluno */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total de Agendamentos</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 p-3 rounded-full">
              <Calendar className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Pendentes</p>
              <p className="text-3xl font-bold">{stats.pendentes}</p>
            </div>
            <div className="bg-orange-400 bg-opacity-30 p-3 rounded-full">
              <Clock className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Confirmados</p>
              <p className="text-3xl font-bold">{stats.confirmados}</p>
            </div>
            <div className="bg-green-400 bg-opacity-30 p-3 rounded-full">
              <CheckCircle className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Concluídos</p>
              <p className="text-3xl font-bold">{stats.concluidos}</p>
            </div>
            <div className="bg-purple-400 bg-opacity-30 p-3 rounded-full">
              <Users className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Barras - Agendamentos por Dia da Semana */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <BarChart className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Agendamentos por Dia da Semana</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosBarras}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="dia" 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="quantidade" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Pizza - Status dos Agendamentos */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Status dos Agendamentos</h3>
          </div>
          {dadosPizza.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosPizza}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosPizza.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Activity className="h-12 w-12 mb-4 text-gray-300" />
              <p className="text-lg font-medium">Nenhum agendamento encontrado</p>
              <p className="text-sm">Os dados aparecerão aqui quando houver agendamentos</p>
            </div>
          )}
        </div>
      </div>

      {/* Gráfico de Linha - Últimos 7 Dias */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="bg-purple-100 p-2 rounded-lg mr-3">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Tendência dos Últimos 7 Dias</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ultimosSete}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="data" 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="agendamentos" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

	      {/* Lista de Próximos Agendamentos */}
	      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
	        <div className="flex items-center mb-6">
	          <div className="bg-teal-100 p-2 rounded-lg mr-3">
	            <Calendar className="h-6 w-6 text-teal-600" />
	          </div>
	          <h3 className="text-xl font-semibold text-gray-900">Próximos Agendamentos</h3>
	        </div>
{agendamentos
          .filter(a => {
            if (a.status !== 'Confirmado') return false;
            
            // Combina data e hora para criar um objeto Date completo
            const [year, month, day] = a.data_agendamento.split('-').map(Number);
            const [hour, minute] = a.hora_agendamento.substring(0, 5).split(':').map(Number);
            const agendamentoDateTime = new Date(year, month - 1, day, hour, minute);

            // Compara com a hora atual
            return agendamentoDateTime >= new Date();
          })
          .sort((a, b) => new Date(a.data_agendamento) - new Date(b.data_agendamento))
          .slice(0, 5)
          .length > 0 ? (
          <div className="space-y-4">
            {agendamentos
              .filter(a => {
            if (a.status !== 'Confirmado') return false;
            
            // Combina data e hora para criar um objeto Date completo
            const [year, month, day] = a.data_agendamento.split('-').map(Number);
            const [hour, minute] = a.hora_agendamento.substring(0, 5).split(':').map(Number);
            const agendamentoDateTime = new Date(year, month - 1, day, hour, minute);

            // Compara com a hora atual
            return agendamentoDateTime >= new Date();
          })
              .sort((a, b) => new Date(a.data_agendamento) - new Date(b.data_agendamento))
              .slice(0, 5)
              .map((agendamento, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Heart className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{agendamento.aluno_nome}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(agendamento.data_agendamento + 'T' + agendamento.hora_agendamento).toLocaleDateString('pt-BR', { 
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })} às {agendamento.hora_agendamento.substring(0, 5)}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {agendamento.modalidade}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Confirmado
                    </span>
                  </div>
                </div>
              ))}
          </div>
	        ) : (
	          <div className="text-center py-12">
	            <div className="bg-gray-100 p-4 rounded-full w-fit mx-auto mb-4">
	              <Calendar className="h-12 w-12 text-gray-400" />
	            </div>
	            <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhum agendamento confirmado</h4>
	            <p className="text-gray-500">Os próximos agendamentos aparecerão aqui quando forem confirmados</p>
	          </div>
	        )}
      </div>

      {/* Seção de Resumo Motivacional */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl p-8 text-white">
        <div className="text-center">
          <div className="bg-white bg-opacity-20 p-3 rounded-full w-fit mx-auto mb-4">
            <Heart className="h-8 w-8" fill="currentColor" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Impacto Positivo</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Você já realizou <span className="font-bold text-white">{stats.concluidos}</span> consultas, 
            ajudando estudantes universitários em sua jornada de bem-estar mental. 
            Seu trabalho faz a diferença na vida de muitas pessoas!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white bg-opacity-20 px-6 py-3 rounded-lg">
              <p className="text-sm text-gray-900">Total de Atendimentos</p>
              <p className="text-black text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-white bg-opacity-20 px-6 py-3 rounded-lg">
              <p className="text-sm text-gray-900">Taxa de Conclusão</p>
              <p className="text-black text-2xl font-bold">
                {stats.total > 0 ? Math.round((stats.concluidos / stats.total) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPsicologo;