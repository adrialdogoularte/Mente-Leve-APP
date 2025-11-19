import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen, Clock, Users, Heart, Brain, Activity, User, AlertCircle, X } from 'lucide-react';

const Dicas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todas');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['Todas', 'Ansiedade', 'Sono', 'Estresse', 'Alimentação', 'Relacionamento', 'Mindfulness', 'Suporte'];

  const articles = [
    {
      id: 1,
      category: 'Ansiedade',
      title: 'Técnicas de Respiração para Ansiedade',
      description: 'A respiração profunda é uma das técnicas mais eficazes para controlar a ansiedade. Experimente a técnica 4-7-8: inspire por 4 segundos, segure por 7 segundos e expire por 8 segundos. Repita 4 vezes. Esta técnica ativa o sistema nervoso parassimpático, promovendo relaxamento e...',
      fullDescription: `Técnicas de Respiração para Ansiedade: A Prática 4-7-8 Detalhada

A respiração profunda é uma das técnicas mais eficazes e acessíveis para controlar a ansiedade e o estresse. No momento em que a ansiedade se instala, nosso padrão respiratório se torna rápido e superficial (respiração torácica), o que intensifica a sensação de pânico, uma vez que o corpo interpreta essa respiração acelerada como um sinal de perigo, ativando a resposta de "luta ou fuga" (sistema nervoso simpático).

Para reverter esse ciclo vicioso, precisamos induzir conscientemente um padrão respiratório mais lento e controlado. É aí que a técnica 4-7-8 se destaca, uma prática popularizada pelo Dr. Andrew Weil, baseada em exercícios respiratórios do Yoga (Pranayama).

Experimente a técnica 4-7-8:

• Encontre uma Posição Confortável: Sente-se ou deite-se com a coluna reta. Toque a ponta da língua no céu da boca, atrás dos dentes frontais, e mantenha-a lá durante todo o exercício.

• Preparação: Expire completamente o ar dos pulmões, fazendo um som de "sopro" suave pela boca.

• Inspiração (4 segundos): Feche a boca e inspire calmamente pelo nariz, contando mentalmente até quatro. Sinta o ar preencher o abdômen.

• Retenção (7 segundos): Segure a respiração, contando mentalmente até sete.

• Expiração (8 segundos): Expire lentamente e completamente pela boca, fazendo novamente um som de "sopro" suave, contando mentalmente até oito.

Repita este ciclo completo quatro vezes no início. Com a prática, você pode aumentar gradualmente para até oito ciclos.

O Mecanismo de Ação:

Esta técnica ativa o sistema nervoso parassimpático, o qual é responsável pelo estado de "descanso e digestão". O alongamento da expiração (8 segundos) em relação à inspiração (4 segundos) é o fator chave, pois é durante a expiração prolongada que o nervo vago é estimulado de forma mais intensa. Essa estimulação envia uma mensagem direta ao cérebro de que o perigo passou, desacelerando o ritmo cardíaco, diminuindo a pressão arterial, relaxando os músculos e, consequentemente, promovendo relaxamento e restaurando o equilíbrio físico e mental, acalmando a mente e reduzindo drasticamente os sintomas de ansiedade, insônia e estresse agudo. É uma ferramenta poderosa para ser usada a qualquer hora e em qualquer lugar para retomar o controle.`,
      icon: Brain,
      color: 'bg-blue-100 text-blue-600',
      readTime: '5 min'
    },
    {
      id: 2,
      category: 'Sono',
      title: 'Como Criar uma Rotina de Sono Saudável',
      description: 'Estabeleça horários regulares para dormir e acordar, mesmo nos fins de semana. Evite telas pelo menos 1 hora antes de dormir, pois a luz azul interfere na produção de melatonina. Mantenha o quarto escuro, fresco (entre 18-21°C) e silencioso. Crie um ritual relaxante antes de deitar...',
      fullDescription: `Como Criar uma Rotina de Sono Saudável: Pilares da Higiene do Sono

Estabelecer uma rotina de sono saudável é um dos passos mais cruciais para gerenciar o estresse, melhorar o humor e garantir uma saúde física e mental ótima. A consistência é a chave mestra para regular o nosso ritmo circadiano, o relógio biológico interno que dita quando devemos nos sentir sonolentos ou despertos.

1. Consistência e Ritmo Circadiano:

Estabeleça horários regulares para dormir e acordar, mesmo nos fins de semana. Essa regularidade fortalece o ciclo sono-vigília, facilitando tanto o adormecer quanto o despertar revigorado. Evite a "dívida de sono" com cochilos longos durante o dia, que podem sabotar a qualidade do sono noturno.

2. Otimização do Ambiente de Descanso:

Mantenha o quarto escuro, fresco (idealmente entre 18-21°C) e silencioso. O escuro absoluto é vital porque a menor exposição à luz pode interromper a produção de melatonina. Um ambiente fresco é cientificamente comprovado como otimizador do sono, pois a queda da temperatura corporal está associada ao início do sono.

3. O Ritual Relaxante Pré-Sono:

Crie um ritual relaxante antes de deitar, sinalizando ao seu corpo que é hora de desacelerar. Este ritual deve durar de 30 a 60 minutos e pode incluir atividades como:

• Evite telas (celulares, tablets, TVs) pelo menos 1 hora antes de dormir, pois a luz azul interfere na produção de melatonina, o hormônio regulador do sono.

• Tome um banho quente para relaxar os músculos e promover a queda da temperatura interna após sair do chuveiro.

• Leia um livro físico (evite e-readers luminosos).

• Pratique técnicas de mindfulness ou faça alongamentos leves.

• Beba um chá de ervas relaxantes, como camomila ou valeriana, evitando cafeína e álcool no final da tarde.

4. Otimização Diurna:

Além disso, lembre-se de que a qualidade do sono é influenciada pelo que fazemos durante o dia. Garanta exposição à luz natural pela manhã para ajudar a calibrar seu relógio interno e pratique exercícios regularmente, mas evite exercícios intensos perto da hora de dormir.

Implementar esses pilares garantirá não apenas mais horas de sono, mas sim um sono mais restaurador, essencial para o controle da ansiedade e a melhoria da função cognitiva.`,
      icon: Clock,
      color: 'bg-purple-100 text-purple-600',
      readTime: '7 min'
    },
    {
      id: 3,
      category: 'Estresse',
      title: 'Gerenciamento de Estresse Acadêmico',
      description: 'Organize suas tarefas por prioridade usando a matriz de Eisenhower (urgente vs importante). Faça pausas regulares durante o estudo - a técnica Pomodoro (25 min estudo + 5 min pausa) é muito eficaz. Pratique atividade física regularmente, mesmo que seja apenas uma caminhada. Não hesite em buscar ajuda...',
      fullDescription: `Gerenciamento de Estresse Acadêmico: Organização e Bem-Estar

O ambiente acadêmico, muitas vezes, é sinônimo de altas demandas, prazos apertados e sobrecarga de conteúdo, levando facilmente ao estresse crônico ou até mesmo ao burnout. Gerenciar esse estresse é vital não apenas para a saúde mental, mas também para manter o desempenho cognitivo e a produtividade.

1. Priorização e Organização Inteligente:

Organize suas tarefas por prioridade usando a Matriz de Eisenhower (Urgente vs. Importante). Isso ajuda a focar nas atividades que realmente movem seus objetivos acadêmicos (Importantes, mas Não Urgentes), em vez de apenas reagir a crises. Delegue ou elimine o que não for crucial.

Divida grandes projetos em pequenas tarefas gerenciáveis. A sensação de concluir pequenos passos gera motivação e reduz a sensação esmagadora de ter muito a fazer.

2. O Poder das Pausas Programadas:

Faça pausas regulares durante o estudo para dar um descanso ao seu cérebro. A Técnica Pomodoro (25 minutos de estudo focado + 5 minutos de pausa) é muito eficaz, pois melhora a concentração e evita a fadiga mental. Durante a pausa, levante-se, alongue-se ou beba água. Evite usar a pausa para tarefas que exigem muita cognição (como checar e-mails complexos).

3. Atividade Física como Válvula de Escape:

Pratique atividade física regularmente, mesmo que seja apenas uma caminhada de 30 minutos. O exercício é um dos melhores antídotos naturais contra o estresse, pois libera endorfinas (neurotransmissores do bem-estar), reduz os níveis de cortisol (hormônio do estresse) e melhora a qualidade do sono.

4. Suporte Social e Profissional:

Não hesite em buscar apoio de colegas, amigos e familiares. Criar uma rede de apoio permite que você compartilhe suas preocupações, diminua o isolamento e ganhe novas perspectivas sobre seus desafios.

Finalmente, se o estresse acadêmico estiver afetando significativamente sua saúde mental, bem-estar ou desempenho, procure ajuda profissional. Um psicólogo ou terapeuta pode oferecer ferramentas de enfrentamento personalizadas e ajudar a tratar condições como ansiedade e depressão que são comuns nesse ambiente.`,
      icon: BookOpen,
      color: 'bg-red-100 text-red-600',
      readTime: '6 min'
    },
    {
      id: 4,
      category: 'Alimentação',
      title: 'Alimentação e Humor: A Conexão',
      description: 'Alimentos ricos em ômega-3, como peixes, nozes e sementes de chia, podem melhorar o humor e reduzir a inflamação cerebral. Evite excesso de açúcar e cafeína, que podem causar picos e quedas de energia. Mantenha refeições regulares para estabilizar o açúcar no sangue...',
      fullDescription: `Alimentação e Humor: A Conexão Direta Intestino-Cérebro

O que colocamos em nosso prato atua diretamente na produção de neurotransmissores (como a serotonina e a dopamina) e na redução da inflamação sistêmica, impactando de forma significativa nosso humor, nossa capacidade de concentração e nossos níveis de ansiedade.

1. Nutrientes Essenciais para a Mente:

Alimentos ricos em ômega-3, como peixes gordurosos (salmão, sardinha), nozes e sementes de chia e linhaça, podem melhorar o humor e reduzir a inflamação cerebral. O ômega-3 é vital para a saúde das membranas celulares neuronais.

Inclua alimentos ricos em triptofano (ovos, queijo, sementes de abóbora), que é um aminoácido precursor da serotonina, muitas vezes chamada de "hormônio da felicidade".

Priorize vitaminas do complexo B (presentes em vegetais de folhas verdes e carnes magras) e magnésio, pois eles são cruciais para a função nervosa e a produção de energia.

2. Otimização do Açúcar no Sangue:

Mantenha refeições regulares ao longo do dia para estabilizar o açúcar no sangue. Picos e quedas bruscas de glicose podem levar a alterações de humor, irritabilidade e fadiga, imitando, por vezes, os sintomas da ansiedade.

Evite o excesso de açúcar e carboidratos refinados, que causam picos rápidos seguidos de quedas bruscas de energia. Opte por carboidratos complexos (grãos integrais) que liberam energia de forma lenta e constante.

3. Evitar Estimulantes Excessivos:

Reduza o consumo de cafeína, especialmente no período da tarde. Embora possa fornecer um impulso inicial, em excesso, ela pode exacerbar os sintomas de ansiedade, causar nervosismo e interferir na qualidade do sono.

4. A Importância da Hidratação e do Microbioma:

Não subestime a hidratação. A desidratação leve pode afetar negativamente o foco e o humor. Beba água consistentemente ao longo do dia.

Consuma alimentos fermentados (iogurte natural, kefir) e ricos em fibras (vegetais e leguminosas) para nutrir o microbioma intestinal. O intestino é o segundo cérebro, e uma flora intestinal saudável está diretamente ligada à redução da inflamação e à melhoria do bem-estar psicológico.

Integrar esses hábitos alimentares não é uma cura mágica, mas é um pilar fundamental para construir uma base sólida para a estabilidade emocional e mental.`,
      icon: Heart,
      color: 'bg-green-100 text-green-600',
      readTime: '8 min'
    },
    {
      id: 5,
      category: 'Exercício',
      title: 'Exercícios Simples para o Bem-estar',
      description: 'Apenas 15 minutos de caminhada diária podem melhorar significativamente o humor, liberando endorfinas naturais. Experimente yoga para reduzir tensão muscular causada pelo estresse. Alongamentos simples podem reduzir a tensão muscular causada pelo estresse. Dança, natação ou qualquer atividade que você goste...',
      fullDescription: `Exercícios Simples para o Bem-estar: Movimento como Remédio

O exercício físico é um dos antidepressivos e ansiolíticos naturais mais poderosos que existem. Ele não apenas beneficia o corpo, mas atua diretamente na química cerebral, sendo uma estratégia essencial para o manejo do estresse e a melhora do humor.

1. O Impacto da Caminhada Diária:

Apenas 15 a 30 minutos de caminhada diária em passo rápido podem melhorar significativamente o humor, liberando endorfinas naturais (os neurotransmissores do bem-estar) e aumentando os níveis de serotonina. A exposição à luz natural durante a caminhada também ajuda a regular o ritmo circadiano e a melhorar a qualidade do sono.

2. Corpo e Mente em Equilíbrio:

Experimente yoga ou alongamentos simples para reduzir a tensão muscular causada pelo estresse. O estresse crônico leva à contração muscular (principalmente nos ombros, pescoço e costas). O yoga, em particular, combina movimento com respiração consciente, sendo uma ferramenta dupla para acalmar o sistema nervoso.

Realize alongamentos básicos ao acordar ou a cada hora durante o trabalho para liberar essa tensão acumulada e melhorar a postura.

3. Encontre o Prazer no Movimento:

A chave para a consistência é o prazer. Dance, nade, jogue bola, ande de bicicleta ou pratique qualquer atividade que você goste. Quando o exercício é divertido, ele se torna sustentável. O importante é mover o corpo regularmente e quebrar o sedentarismo.

Lembre-se que a atividade não precisa ser intensa para ser benéfica. O objetivo inicial é a consistência, não o desempenho atlético. Se 15 minutos parecem muito, comece com cinco e aumente gradualmente.

4. Benefícios a Longo Prazo:

Além da melhora imediata do humor, o exercício regular a longo prazo reduz os níveis de cortisol (o principal hormônio do estresse), melhora a neuroplasticidade e aumenta a resiliência emocional, tornando o corpo e a mente mais capazes de lidar com as adversidades do dia a dia. Começar é o mais difícil; manter o hábito transforma a vida.`,
      icon: Activity,
      color: 'bg-orange-100 text-orange-600',
      readTime: '4 min'
    },
    {
      id: 6,
      category: 'Relacionamento',
      title: 'Construindo Conexões Sociais Saudáveis',
      description: 'Invista tempo em relacionamentos que te fazem bem e te apoiam. Pratique a escuta ativa - foque completamente na pessoa quando ela estiver falando. Seja empático e tente entender as perspectivas dos outros. Não tenha medo de ser vulnerável com pessoas de confiança...',
      fullDescription: `Construindo Conexões Sociais Saudáveis: O Poder do Suporte

A qualidade de nossos relacionamentos sociais tem um impacto direto e profundo em nosso bem-estar psicológico e físico. Relacionamentos saudáveis atuam como um amortecedor contra o estresse, liberando hormônios como a oxitocina (o hormônio do afeto e do vínculo), que promovem calma e segurança. Eles fornecem um senso de pertencimento, o que é um fator de proteção crucial contra a ansiedade e a depressão.

1. Investimento em Qualidade, Não em Quantidade:

Invista tempo e energia em relacionamentos que te fazem bem, te apoiam e te inspiram. É essencial focar na qualidade da interação. Relações tóxicas, drenantes ou excessivamente críticas devem ser gerenciadas ou, se necessário, afastadas, pois contribuem significativamente para o estresse e a baixa autoestima.

Concentre-se em cultivar algumas conexões profundas e autênticas, em vez de acumular muitos contatos superficiais.

2. Habilidades Essenciais de Comunicação:

Pratique a escuta ativa – isso significa focar completamente na pessoa quando ela estiver falando, não apenas esperando sua vez de responder. Guarde o celular, evite interromper e use a linguagem corporal para mostrar interesse genuíno (contato visual, acenos).

Seja empático e tente entender as perspectivas e os sentimentos dos outros, mesmo que você não concorde com a situação. A empatia fortalece o vínculo e cria um ambiente de segurança, validação e aceitação mútua.

3. Autenticidade e Vulnerabilidade:

Não tenha medo de ser vulnerável com pessoas de confiança. Compartilhar seus medos, fraquezas, erros e desafios é o que realmente cria a intimidade e a conexão profunda, mostrando aos outros que eles também podem ser imperfeitos e confiar em você. A vulnerabilidade recíproca é a base das amizades duradouras.

Estabeleça limites saudáveis. Relacionamentos saudáveis respeitam o seu espaço, o seu tempo e as suas necessidades. Saber dizer "não" de forma gentil quando necessário é fundamental para manter o seu bem-estar e o respeito mútuo na relação.

4. Participação Comunitária:

Busque se envolver em grupos sociais, hobbies ou atividades comunitárias que tenham a ver com seus interesses. Participar de uma comunidade, seja ela um clube do livro, um time esportivo ou um grupo de voluntariado, pode ser uma forma orgânica de construir novas amizades significativas.`,
      icon: Users,
      color: 'bg-pink-100 text-pink-600',
      readTime: '9 min'
    },
    {
      id: 7,
      category: 'Mindfulness',
      title: 'Mindfulness para Iniciantes',
      description: 'Comece com apenas 5 minutos diários de meditação. Foque na sua respiração e observe seus pensamentos sem julgamento. Use apps como Headspace, Calm ou Insight Timer para guiá-lo. Pratique mindfulness durante atividades cotidianas, como comer ou caminhar...',
      fullDescription: `Mindfulness para Iniciantes: Cultivando a Atenção Plena

O Mindfulness, ou Atenção Plena, é a prática de trazer intencionalmente sua atenção para o momento presente, sem julgamento. Não se trata de parar de pensar, mas sim de observar os pensamentos e sentimentos como nuvens que passam, sem se apegar a eles. É uma habilidade que, com a prática regular, transforma a maneira como você reage ao estresse.

1. O Princípio da Não-Reatividade:

Comece com apenas 5 minutos diários de meditação formal. Sente-se confortavelmente, feche os olhos (ou mantenha o olhar suavemente fixo em um ponto) e foque na sua respiração.

Observe seus pensamentos, emoções e sensações corporais sem julgamento. O julgamento é o que nos prende ao estresse. Simplesmente reconheça: "Ah, estou tendo um pensamento ansioso" e, gentilmente, retorne o foco para a respiração.

Quando a mente divagar (o que é natural!), traga a atenção de volta para sua âncora — o seu ponto de foco, geralmente a sensação do ar entrando e saindo do corpo.

2. Utilização de Recursos de Apoio:

Use aplicativos como Headspace, Calm ou Insight Timer para guiá-lo. As meditações guiadas são ideais para iniciantes, pois fornecem instruções claras e ajudam a manter o foco no início.

3. Integrando o Mindfulness na Rotina (Prática Informal):

Pratique mindfulness durante atividades cotidianas. Esta é a forma mais poderosa de levar a atenção plena para o seu dia. Por exemplo:

• Mindfulness ao Comer: Preste atenção na textura, no sabor, no cheiro e na temperatura dos alimentos. Mastigue lentamente.

• Mindfulness ao Caminhar: Sinta o peso do seu corpo, o contato dos seus pés com o chão e a mudança de paisagem ao seu redor.

• Mindfulness na Tarefa: Ao lavar a louça ou escovar os dentes, concentre-se nas sensações físicas da água, do sabão e do movimento.

4. Benefícios a Longo Prazo:

A consistência é mais importante do que a duração. Ao praticar diariamente, você fortalece o "músculo" da atenção, o que leva a uma redução da reatividade emocional e uma maior clareza mental, tornando-se um escudo poderoso contra a ansiedade crônica.`,
      icon: Brain,
      color: 'bg-teal-100 text-teal-600',
      readTime: '6 min'
    },
    {
      id: 8,
      category: 'Suporte',
      title: 'Sinais de Alerta: Quando Buscar Ajuda',
      description: 'Procure ajuda profissional se você sente tristeza persistente por mais de duas semanas, perda de interesse em atividades que antes gostava, mudanças significativas no sono ou apetite, dificuldade extrema de concentração, ou pensamentos de autolesão ou suicídio. Não hesite em buscar...',
      fullDescription: `Sinais de Alerta: Quando Buscar Ajuda Profissional

Reconhecer que se precisa de ajuda é um ato de coragem e autocuidado. Muitas pessoas hesitam em procurar apoio profissional por estigma ou incerteza. É vital entender que a saúde mental é tão importante quanto a saúde física, e buscar tratamento é um passo decisivo para o bem-estar.

1. Sinais de Alerta (Duração Mínima de Duas Semanas):

• Tristeza Persistente: Se você sente uma tristeza profunda e constante que não melhora por mais de duas semanas, pode ser um sinal de alerta para depressão.

• Apatia e Perda de Interesse: Perda de interesse ou prazer em atividades que antes gostava (anedonia), incluindo hobbies, convívio social ou trabalho.

• Mudanças Físicas Significativas: Mudanças significativas no sono (insônia severa ou sono excessivo) ou apetite (perda ou ganho de peso não intencional).

• Função Cognitiva Comprometida: Dificuldade extrema de concentração, de tomar decisões simples ou de lembrar de coisas.

• Fadiga Extrema: Sensação de cansaço constante, mesmo após descansar (perda de energia).

• Irritabilidade e Instabilidade Emocional: Explosões de raiva ou oscilações de humor inexplicáveis.

2. O Alerta Máximo:

• Pensamentos de Autolesão ou Suicídio: Se você tiver pensamentos de machucar a si mesmo ou acabar com a própria vida, isso constitui uma emergência. Nestes casos, não hesite em buscar ajuda imediatamente ligando para um serviço de emergência local ou para um Centro de Valorização da Vida (CVV).

3. Não Hesite em Buscar Apoio:

Não hesite em buscar apoio de um psicólogo, psiquiatra ou terapeuta. Estes profissionais são treinados para fornecer diagnóstico, tratamento e estratégias de enfrentamento eficazes.

Lembre-se que buscar ajuda não é um sinal de fraqueza, mas sim de força e responsabilidade com sua própria vida. Converse com seu médico de família sobre as opções de encaminhamento e investigue as redes de apoio gratuitas ou de baixo custo disponíveis em sua comunidade. O apoio profissional pode fornecer as ferramentas necessárias para recuperar o controle de sua vida e seu bem-estar emocional.`,
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

  const openModal = (article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
    // Previne scroll do body quando modal está aberto
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
    // Restaura scroll do body
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
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
                  <button 
                    onClick={() => openModal(article)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                  >
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

      {/* Modal */}
      {isModalOpen && selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closeModal}
          ></div>
          
          {/* Modal Content */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[85vh] overflow-hidden">
              {/* Header */}
              <div className={`${selectedArticle.color} p-6`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white p-3 rounded-lg">
                      <selectedArticle.icon className="h-8 w-8" />
                    </div>
                    <span className="inline-block text-xs font-medium bg-white bg-opacity-80 px-3 py-1 rounded-full">
                      {selectedArticle.category}
                    </span>
                  </div>
                  <button
                    onClick={closeModal}
                    className="flex-shrink-0 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 pr-10">
                  {selectedArticle.title}
                </h2>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
                <div className="prose prose-sm max-w-none">
                  <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {selectedArticle.fullDescription}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Tempo de leitura: {selectedArticle.readTime}</span>
                </div>
                <button
                  onClick={closeModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dicas;