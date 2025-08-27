import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen, Clock, Users, Heart, Brain, Activity, User, AlertCircle } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const Dicas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todas');

  const categories = ['Todas', 'Ansiedade', 'Sono', 'Estresse', 'Alimentação', 'Relacionamento', 'Mindfulness', 'Suporte'];

  const articles = [
    {
      id: 1,
      category: 'Ansiedade',
      title: 'Técnicas de Respiração para Ansiedade',
      description: 'A respiração profunda é uma das técnicas mais eficazes para controlar a ansiedade. Experimente a técnica 4-7-8: inspire por 4 segundos, segure por 7 segundos e expire por 8 segundos. Repita 4 vezes. Esta técnica ativa o sistema nervoso parassimpático, promovendo relaxamento e...',
      icon: Brain,
      color: 'bg-blue-100 text-blue-600',
      readTime: '5 min'
    },
    {
      id: 2,
      category: 'Sono',
      title: 'Como Criar uma Rotina de Sono Saudável',
      description: 'Estabeleça horários regulares para dormir e acordar, mesmo nos fins de semana. Evite telas pelo menos 1 hora antes de dormir, pois a luz azul interfere na produção de melatonina. Mantenha o quarto escuro, fresco (entre 18-21°C) e silencioso. Crie um ritual relaxante antes de deitar...',
      icon: Clock,
      color: 'bg-purple-100 text-purple-600',
      readTime: '7 min'
    },
    {
      id: 3,
      category: 'Estresse',
      title: 'Gerenciamento de Estresse Acadêmico',
      description: 'Organize suas tarefas por prioridade usando a matriz de Eisenhower (urgente vs importante). Faça pausas regulares durante o estudo - a técnica Pomodoro (25 min estudo + 5 min pausa) é muito eficaz. Pratique atividade física regularmente, mesmo que seja apenas uma caminhada. Não hesite em buscar ajuda...',
      icon: BookOpen,
      color: 'bg-red-100 text-red-600',
      readTime: '6 min'
    },
    {
      id: 4,
      category: 'Alimentação',
      title: 'Alimentação e Humor: A Conexão',
      description: 'Alimentos ricos em ômega-3, como peixes, nozes e sementes de chia, podem melhorar o humor e reduzir a inflamação cerebral. Evite excesso de açúcar e cafeína, que podem causar picos e quedas de energia. Mantenha refeições regulares para estabilizar o açúcar no sangue...',
      icon: Heart,
      color: 'bg-green-100 text-green-600',
      readTime: '8 min'
    },
    {
      id: 5,
      category: 'Exercício',
      title: 'Exercícios Simples para o Bem-estar',
      description: 'Apenas 15 minutos de caminhada diária podem melhorar significativamente o humor, liberando endorfinas naturais. Experimente yoga para reduzir tensão muscular causada pelo estresse. Alongamentos simples podem reduzir a tensão muscular causada pelo estresse. Dança, natação ou qualquer atividade que você goste...',
      icon: Activity,
      color: 'bg-orange-100 text-orange-600',
      readTime: '4 min'
    },
    {
      id: 6,
      category: 'Relacionamento',
      title: 'Construindo Conexões Sociais Saudáveis',
      description: 'Invista tempo em relacionamentos que te fazem bem e te apoiam. Pratique a escuta ativa - foque completamente na pessoa quando ela estiver falando. Seja empático e tente entender as perspectivas dos outros. Não tenha medo de ser vulnerável com pessoas de confiança...',
      icon: Users,
      color: 'bg-pink-100 text-pink-600',
      readTime: '9 min'
    },
    {
      id: 7,
      category: 'Mindfulness',
      title: 'Mindfulness para Iniciantes',
      description: 'Comece com apenas 5 minutos diários de meditação. Foque na sua respiração e observe seus pensamentos sem julgamento. Use apps como Headspace, Calm ou Insight Timer para guiá-lo. Pratique mindfulness durante atividades cotidianas, como comer ou caminhar...',
      icon: Brain,
      color: 'bg-teal-100 text-teal-600',
      readTime: '6 min'
    },
    {
      id: 8,
      category: 'Suporte',
      title: 'Sinais de Alerta: Quando Buscar Ajuda',
      description: 'Procure ajuda profissional se você sente tristeza persistente por mais de duas semanas, perda de interesse em atividades que antes gostava, mudanças significativas no sono ou apetite, dificuldade extrema de concentração, ou pensamentos de autolesão ou suicídio. Não hesite em buscar...',
      icon: AlertCircle,
      color: 'bg-yellow-100 text-yellow-600',
      readTime: '5 min'
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'Todas' || article.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Dicas e Recursos
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Artigos e dicas práticas para melhorar seu bem-estar e saúde mental
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar dicas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[150px]"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            {filteredArticles.length} resultado{filteredArticles.length !== 1 ? 's' : ''} encontrado{filteredArticles.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {filteredArticles.map((article) => (
            <div key={article.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${article.color} flex-shrink-0`}>
                  <article.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{article.readTime}</span>
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-4">
                    {article.description}
                  </p>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Ler mais →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl p-8 text-center text-white">
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12" fill="currentColor" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Precisa de mais apoio?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Se você está passando por um momento difícil, não hesite em buscar ajuda profissional
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/agendamento"
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Agendar com Psicólogo
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

      <Footer />
    </div>
  );
};

export default Dicas;

