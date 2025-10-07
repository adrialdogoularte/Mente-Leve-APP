import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, Smile, BookOpen, Calendar, CheckCircle, AlertCircle, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DashboardPsicologo from './DashboardPsicologo'; // Dashboard para psicólogos

const Home = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center p-4">Carregando informações do usuário...</div>;
  }

  // Se for psicólogo, exibir o dashboard
  if (user && user.tipo_usuario === 'psicologo') {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo(a), Dr(a). {user.nome}!
            </h1>
            <p className="text-lg text-gray-600">
              Acompanhe seus agendamentos e estatísticas de atendimento.
            </p>
          </div>
          <DashboardPsicologo />
        </main>
      </div>
    );
  }

  // Layout original para alunos ou usuários não logados
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <img src="logo.png" alt="logo" className="h-40 w-40"></img>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bem-vindo ao <span className="text-blue-600">Mente Leve</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Sua plataforma de apoio à saúde mental. Desenvolvida especialmente para jovens universitários que 
            buscam bem-estar, autoconhecimento e suporte emocional.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/autoavaliacao"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <CheckCircle className="h-5 w-5" />
              <span>Começar Autoavaliação</span>
            </Link>
            <Link 
              to="/registro-humor"
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 transition-colors flex items-center justify-center space-x-2"
            >
              <Smile className="h-5 w-5" />
              <span>Registrar Humor</span>
            </Link>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Entenda a Importância do Cuidado Mental
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 - Benefícios do Registro de Humor */}
            <div className="bg-blue-500 text-white p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Benefícios do Registro de Humor</h3>
              <ul className="space-y-2 text-blue-100">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">Autoconhecimento emocional</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">Identificação de padrões</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">Melhora na comunicação</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">Tomada de decisões conscientes</span>
                </li>
              </ul>
            </div>

            {/* Card 2 - Quando Buscar Ajuda */}
            <div className="bg-purple-500 text-white p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quando Buscar Ajuda</h3>
              <ul className="space-y-2 text-purple-100">
                <li className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">Estresse persistente</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">Perda de interesse</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">Ansiedade excessiva</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">Isolamento social</span>
                </li>
              </ul>
            </div>

            {/* Card 3 - Pilares da Saúde Mental */}
            <div className="bg-teal-500 text-white p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <Activity className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Pilares da Saúde Mental</h3>
              <ul className="space-y-2 text-teal-100">
                <li className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">Sono de qualidade</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">Alimentação equilibrada</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">Exercícios regulares</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">Conexões sociais</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Nossas Funcionalidades
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <Link to="/autoavaliacao" className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Autoavaliação</h3>
              <p className="text-sm text-gray-600">
                Questionário interativo para avaliar seu bem-estar atual
              </p>
            </Link>

            {/* Feature 2 */}
            <Link to="/registro-humor" className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
                <Smile className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Registro de Humor</h3>
              <p className="text-sm text-gray-600">
                Acompanhe suas emoções diariamente e identifique padrões
              </p>
            </Link>

            {/* Feature 3 */}
            <Link to="/dicas" className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Dicas e Recursos</h3>
              <p className="text-sm text-gray-600">
                Artigos e dicas práticas para melhorar seu bem-estar
              </p>
            </Link>

            {/* Feature 4 */}
            <Link to="/agendamento" className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="bg-orange-100 p-3 rounded-full w-fit mx-auto mb-4">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Agendamento</h3>
              <p className="text-sm text-gray-600">
                Conecte-se com psicólogos voluntários disponíveis
              </p>
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Pronto para cuidar da sua saúde mental?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Comece sua jornada de autoconhecimento e bem-estar hoje mesmo. Lembre-se: 
            cuidar da mente é tão importante quanto cuidar do corpo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/autoavaliacao"
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Fazer Autoavaliação
            </Link>
            <Link 
              to="/suporte"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Ver Recursos de Apoio
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
