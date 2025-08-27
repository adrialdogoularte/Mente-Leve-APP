import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Clock } from 'lucide-react';


const Autoavaliacao = () => {
  const navigate = useNavigate();
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState({});
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const perguntas = [
    {
      id: 1,
      categoria: 'Estresse Acadêmico',
      texto: 'Com que frequência você se sente sobrecarregado(a) com suas responsabilidades acadêmicas?',
      opcoes: [
        { valor: 1, texto: 'Nunca' },
        { valor: 2, texto: 'Raramente' },
        { valor: 3, texto: 'Às vezes' },
        { valor: 4, texto: 'Frequentemente' },
        { valor: 5, texto: 'Sempre' }
      ]
    },
    {
      id: 2,
      categoria: 'Sono e Descanso',
      texto: 'Como você avalia a qualidade do seu sono nas últimas duas semanas?',
      opcoes: [
        { valor: 1, texto: 'Excelente' },
        { valor: 2, texto: 'Boa' },
        { valor: 3, texto: 'Regular' },
        { valor: 4, texto: 'Ruim' },
        { valor: 5, texto: 'Muito ruim' }
      ]
    },
    {
      id: 3,
      categoria: 'Relacionamentos',
      texto: 'Com que frequência você se sente isolado(a) ou desconectado(a) dos outros?',
      opcoes: [
        { valor: 1, texto: 'Nunca' },
        { valor: 2, texto: 'Raramente' },
        { valor: 3, texto: 'Às vezes' },
        { valor: 4, texto: 'Frequentemente' },
        { valor: 5, texto: 'Sempre' }
      ]
    },
    {
      id: 4,
      categoria: 'Humor e Emoções',
      texto: 'Nas últimas duas semanas, com que frequência você se sentiu triste ou desanimado(a)?',
      opcoes: [
        { valor: 1, texto: 'Nunca' },
        { valor: 2, texto: 'Raramente' },
        { valor: 3, texto: 'Às vezes' },
        { valor: 4, texto: 'Frequentemente' },
        { valor: 5, texto: 'Sempre' }
      ]
    },
    {
      id: 5,
      categoria: 'Ansiedade',
      texto: 'Com que frequência você se sente ansioso(a) ou preocupado(a)?',
      opcoes: [
        { valor: 1, texto: 'Nunca' },
        { valor: 2, texto: 'Raramente' },
        { valor: 3, texto: 'Às vezes' },
        { valor: 4, texto: 'Frequentemente' },
        { valor: 5, texto: 'Sempre' }
      ]
    },
    {
      id: 6,
      categoria: 'Autocuidado',
      texto: 'Com que frequência você dedica tempo para atividades que gosta e te fazem bem?',
      opcoes: [
        { valor: 5, texto: 'Nunca' },
        { valor: 4, texto: 'Raramente' },
        { valor: 3, texto: 'Às vezes' },
        { valor: 2, texto: 'Frequentemente' },
        { valor: 1, texto: 'Sempre' }
      ]
    },
    {
      id: 7,
      categoria: 'Concentração',
      texto: 'Nas últimas duas semanas, como tem sido sua capacidade de concentração nos estudos?',
      opcoes: [
        { valor: 1, texto: 'Excelente' },
        { valor: 2, texto: 'Boa' },
        { valor: 3, texto: 'Regular' },
        { valor: 4, texto: 'Ruim' },
        { valor: 5, texto: 'Muito ruim' }
      ]
    },
    {
      id: 8,
      categoria: 'Bem-estar Geral',
      texto: 'De forma geral, como você avalia seu bem-estar mental atual?',
      opcoes: [
        { valor: 1, texto: 'Excelente' },
        { valor: 2, texto: 'Bom' },
        { valor: 3, texto: 'Regular' },
        { valor: 4, texto: 'Ruim' },
        { valor: 5, texto: 'Muito ruim' }
      ]
    }
  ];

  const handleResposta = (valor) => {
    setRespostas(prev => ({
      ...prev,
      [perguntas[perguntaAtual].id]: valor
    }));
  };

  const proximaPergunta = () => {
    if (perguntaAtual < perguntas.length - 1) {
      setPerguntaAtual(perguntaAtual + 1);
    }
  };

  const perguntaAnterior = () => {
    if (perguntaAtual > 0) {
      setPerguntaAtual(perguntaAtual - 1);
    }
  };

  const finalizarAvaliacao = async () => {
    setLoading(true);
    
    try {
      // Calcular pontuação
      const pontuacaoTotal = Object.values(respostas).reduce((sum, val) => sum + val, 0);
      
      // Determinar nível de risco
      let nivelRisco = 'baixo';
      if (pontuacaoTotal > 28) nivelRisco = 'alto';
      else if (pontuacaoTotal > 16) nivelRisco = 'medio';
      
      // Gerar recomendações
      let recomendacoes = [];
      if (nivelRisco === 'baixo') {
        recomendacoes = [
          'Continue mantendo seus bons hábitos de bem-estar mental.',
          'Pratique atividades que te dão prazer regularmente.',
          'Mantenha uma rotina de sono saudável.'
        ];
      } else if (nivelRisco === 'medio') {
        recomendacoes = [
          'Considere implementar técnicas de relaxamento em sua rotina.',
          'Busque apoio de amigos, família ou profissionais quando necessário.',
          'Avalie sua carga de trabalho e organize melhor seu tempo.'
        ];
      } else {
        recomendacoes = [
          'É recomendável buscar apoio profissional de um psicólogo.',
          'Considere conversar com alguém de confiança sobre como se sente.',
          'Pratique técnicas de respiração e mindfulness.',
          'Não hesite em procurar ajuda imediata se necessário.'
        ];
      }
      
      const novaAvaliacao = {
        id: Date.now(),
        pontuacao_total: pontuacaoTotal,
        nivel_risco: nivelRisco,
        data_criacao: new Date().toISOString(),
        compartilhada: false,
        respostas,
        recomendacoes
      };
      
      // Salvar no localStorage
      const avaliacoesExistentes = JSON.parse(localStorage.getItem('avaliacoes') || '[]');
      const novasAvaliacoes = [novaAvaliacao, ...avaliacoesExistentes];
      localStorage.setItem('avaliacoes', JSON.stringify(novasAvaliacoes));
      
      setResultado(novaAvaliacao);
    } catch (error) {
      console.error('Erro ao finalizar avaliação:', error);
      alert('Erro ao salvar avaliação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const obterCorNivel = (nivel) => {
    switch (nivel) {
      case 'baixo': return 'text-green-600 bg-green-100 border-green-200';
      case 'medio': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'alto': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const obterIconeNivel = (nivel) => {
    switch (nivel) {
      case 'baixo': return <CheckCircle className="w-6 h-6" />;
      case 'medio': return <Clock className="w-6 h-6" />;
      case 'alto': return <AlertCircle className="w-6 h-6" />;
      default: return <AlertCircle className="w-6 h-6" />;
    }
  };

  const obterMensagemNivel = (nivel) => {
    switch (nivel) {
      case 'baixo': return 'Seu bem-estar mental está em um bom nível. Continue cuidando de si mesmo!';
      case 'medio': return 'Alguns aspectos do seu bem-estar merecem atenção. Considere as recomendações abaixo.';
      case 'alto': return 'É importante buscar apoio profissional. Suas respostas indicam que você pode se beneficiar de ajuda especializada.';
      default: return '';
    }
  };

  // Se a avaliação foi finalizada, mostrar resultado
  if (resultado) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Resultado da Autoavaliação
              </h1>
              <p className="text-gray-600">
                Sua avaliação foi concluída com sucesso. Confira os resultados abaixo.
              </p>
            </div>

            {/* Resultado Principal */}
            <div className={`border-2 rounded-lg p-6 mb-6 ${obterCorNivel(resultado.nivel_risco)}`}>
              <div className="flex items-center justify-center mb-4">
                {obterIconeNivel(resultado.nivel_risco)}
                <span className="ml-3 text-xl font-semibold capitalize">
                  {resultado.nivel_risco} Risco
                </span>
              </div>
              <div className="text-center mb-4">
                <span className="text-2xl font-bold">
                  {resultado.pontuacao_total}/40 pontos
                </span>
              </div>
              <p className="text-center">
                {obterMensagemNivel(resultado.nivel_risco)}
              </p>
            </div>

            {/* Recomendações */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                Recomendações Personalizadas
              </h3>
              <ul className="space-y-3">
                {resultado.recomendacoes.map((recomendacao, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-3 mt-1">•</span>
                    <span className="text-blue-800">{recomendacao}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/perfil')}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Ver Histórico de Avaliações
              </button>
              <button
                onClick={() => {
                  setResultado(null);
                  setRespostas({});
                  setPerguntaAtual(0);
                }}
                className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Nova Avaliação
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pergunta = perguntas[perguntaAtual];
  const respostaAtual = respostas[pergunta.id];
  const todasRespondidas = Object.keys(respostas).length === perguntas.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Autoavaliação de Bem-estar
            </h1>
            <p className="text-gray-600 mb-6">
              Responda as perguntas com honestidade para obter uma avaliação personalizada do seu bem-estar atual.
            </p>
            
            {/* Progresso */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((perguntaAtual + 1) / perguntas.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">
              Pergunta {perguntaAtual + 1} de {perguntas.length}
            </p>
          </div>

          {/* Pergunta */}
          <div className="mb-8">
            <div className="mb-4">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                {pergunta.categoria}
              </span>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {pergunta.texto}
            </h2>

            {/* Opções */}
            <div className="space-y-3">
              {pergunta.opcoes.map((opcao) => (
                <button
                  key={opcao.valor}
                  onClick={() => handleResposta(opcao.valor)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    respostaAtual === opcao.valor
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      respostaAtual === opcao.valor
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {respostaAtual === opcao.valor && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <span className="font-medium">({opcao.valor})</span>
                    <span className="ml-2">{opcao.texto}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navegação */}
          <div className="flex justify-between">
            <button
              onClick={perguntaAnterior}
              disabled={perguntaAtual === 0}
              className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                perguntaAtual === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Anterior
            </button>

            {perguntaAtual === perguntas.length - 1 ? (
              <button
                onClick={finalizarAvaliacao}
                disabled={!todasRespondidas || loading}
                className={`flex items-center px-6 py-2 rounded-lg font-medium ${
                  todasRespondidas && !loading
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? 'Finalizando...' : 'Finalizar Avaliação'}
                <CheckCircle className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button
                onClick={proximaPergunta}
                disabled={!respostaAtual}
                className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                  respostaAtual
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Próxima
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Autoavaliacao;

