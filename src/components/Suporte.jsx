import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, ExternalLink, AlertTriangle, Heart, Users, Calendar } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const Suporte = () => {
  const emergencyContacts = [
    {
      name: 'Centro de Valorização da Vida (CVV)',
      phone: '188',
      description: 'Prevenção do suicídio',
      availability: '24 horas, todos os dias',
      color: 'bg-red-100 text-red-700'
    },
    {
      name: 'SAMU',
      phone: '192',
      description: 'Serviço de Atendimento Móvel de Urgência',
      availability: '24 horas, todos os dias',
      color: 'bg-red-100 text-red-700'
    },
    {
      name: 'Polícia Militar',
      phone: '190',
      description: 'Emergências e segurança pública',
      availability: '24 horas, todos os dias',
      color: 'bg-red-100 text-red-700'
    }
  ];

  const mentalHealthServices = [
    {
      name: 'CAPS - Centro de Atenção Psicossocial',
      description: 'Atendimento público especializado em saúde mental',
      services: [
        'Atendimento individual',
        'Grupos terapêuticos',
        'Psicoterapia',
        'Medicação gratuita'
      ],
      contact: 'Varie por região',
      website: 'Mais informações'
    },
    {
      name: 'UBS - Unidade Básica de Saúde',
      description: 'Primeiro atendimento em saúde mental na rede SUS',
      services: [
        'Consulta inicial',
        'Encaminhamento especializado',
        'Acompanhamento básico'
      ],
      contact: 'Varie por região',
      website: 'Mais informações'
    },
    {
      name: 'Núcleo de Apoio Psicológico Universitário',
      description: 'Serviços específicos para atendimento universitário',
      services: [
        'Atendimento psicológico',
        'Grupos de apoio',
        'Orientação acadêmica'
      ],
      contact: 'Contato via universidade',
      website: 'Mais informações'
    }
  ];

  const onlineResources = [
    {
      name: 'Mapa da Saúde Mental',
      description: 'Encontre profissionais de saúde mental na sua região',
      website: 'Acessar plataforma'
    },
    {
      name: 'Psicologia Viva',
      description: 'Plataforma com psicólogos online',
      website: 'Acessar plataforma'
    },
    {
      name: 'Zenklub',
      description: 'Terapia online e conteúdo sobre bem-estar',
      website: 'Acessar plataforma'
    },
    {
      name: 'Vittude',
      description: 'Rede de psicólogos online e presenciais',
      website: 'Acessar plataforma'
    }
  ];

  const selfHelpApps = [
    {
      name: 'Headspace',
      description: 'Meditação guiada e mindfulness',
      features: ['Meditação diária', 'Exercícios de respiração', 'Histórias para dormir']
    },
    {
      name: 'Calm',
      description: 'Relaxamento e meditação para sono',
      features: ['Mindfulness', 'Música relaxante', 'Programas de sono']
    },
    {
      name: 'Insight Timer',
      description: 'Maior biblioteca gratuita de meditações',
      features: ['Meditações gratuitas', 'Timer personalizado', 'Comunidade global']
    },
    {
      name: 'Sanvello',
      description: 'Gerenciamento de ansiedade e humor',
      features: ['Rastreamento de humor', 'Exercícios de ansiedade', 'Técnicas de enfrentamento']
    }
  ];

  const warningSignsPersonal = [
    'Tristeza persistente por mais de duas semanas',
    'Mudanças drásticas no sono ou apetite',
    'Sentimentos de desesperança ou desamparo',
    'Isolamento social extremo'
  ];

  const warningSignsOthers = [
    'Perda de interesse em atividades que antes gostava',
    'Dificuldade extrema de concentração',
    'Pensamentos de autolesão ou suicídio',
    'Uso excessivo de álcool ou drogas'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Recursos de Apoio
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Informações de contato e recursos para apoio emocional e saúde mental
          </p>
        </div>

        {/* Alerta de Emergência */}
        <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-r-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Em caso de emergência</h3>
              <p className="text-red-800 mb-4">
                Se você está em risco iminente de autolesão, procure ajuda imediatamente:
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="tel:188" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  CVV: 188
                </a>
                <a href="tel:192" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  SAMU: 192
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contatos de Emergência */}
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <Phone className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">Contatos de Emergência</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{contact.name}</h3>
                <div className={`text-2xl font-bold mb-2 ${contact.color}`}>
                  {contact.phone}
                </div>
                <p className="text-sm text-gray-600 mb-2">{contact.description}</p>
                <p className="text-xs text-gray-500">{contact.availability}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Serviços de Saúde Mental */}
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <Heart className="h-6 w-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900">Serviços de Saúde Mental</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {mentalHealthServices.map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Serviços oferecidos:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {service.services.map((item, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{service.contact}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                    <ExternalLink className="h-4 w-4" />
                    <span>{service.website}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recursos Online */}
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <ExternalLink className="h-6 w-6 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900">Recursos Online</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {onlineResources.map((resource, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{resource.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                  <ExternalLink className="h-4 w-4" />
                  <span>{resource.website}</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Apps de Autoajuda */}
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <Heart className="h-6 w-6 text-purple-500" />
            <h2 className="text-2xl font-bold text-gray-900">Apps de Autoajuda</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {selfHelpApps.map((app, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{app.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{app.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Recursos:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {app.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sinais de Alerta */}
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">Sinais de Alerta</h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            Procure ajuda profissional se você ou alguém que conhece apresenta algum destes sinais:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="font-semibold text-yellow-900 mb-4">Sinais pessoais:</h3>
              <ul className="space-y-2">
                {warningSignsPersonal.map((sign, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-yellow-800">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h3 className="font-semibold text-orange-900 mb-4">Sinais em outras pessoas:</h3>
              <ul className="space-y-2">
                {warningSignsOthers.map((sign, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-orange-800">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6">
            <p className="text-green-800 text-sm">
              <strong>Lembre-se:</strong> Buscar ajuda é um sinal de força, não de fraqueza. 
              Profissionais de saúde mental estão preparados para ajudar você a superar dificuldades e viver uma vida mais saudável.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl p-8 text-center text-white">
          <div className="flex justify-center mb-4">
            <Users className="h-12 w-12" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Você não está sozinho</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Milhões de pessoas enfrentam desafios de saúde mental. Com o apoio adequado, é possível superar dificuldades e viver uma vida plena e saudável.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/agendamento"
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Calendar className="h-5 w-5" />
              <span>Agendar com Psicólogo</span>
            </Link>
            <Link 
              to="/autoavaliacao"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Fazer Autoavaliação
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Suporte;

