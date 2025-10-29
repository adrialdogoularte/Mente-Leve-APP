import React from 'react';
import { Heart, Phone, Mail, ExternalLink, AlertTriangle, FileText } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {/* <Heart className="h-6 w-6 text-blue-500" fill="currentColor" /> */}
              <img src="logo.png" alt="logo" className="h-25 w-25"></img>
              <span className="text-xl font-semibold text-gray-900">Mente Leve</span>
            </div>
            <p className="text-sm text-gray-600 max-w-xs">
              Plataforma dedicada ao bem-estar mental de jovens universitários. 
              Oferecemos ferramentas de autoavaliação, suporte emocional e conexão com 
              profissionais de saúde mental.
            </p>
          </div>

          {/* Links Úteis */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Links Úteis</h3>
            <div className="space-y-2">
              <a 
                href="/politica-privacidade"
                className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" />
                Política de Privacidade
              </a>
              <a 
                href="/termos-uso"
                className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" />
                Termos de Uso
              </a>
              <a 
                href="https://cvv.org.br/" target="_blank" rel="noopener noreferrer"
                className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Centro de Valorização da Vida (CVV )
              </a>              
              <a 
                href="https://www.gov.br/saude/pt-br/composicao/saes/desmad/raps/caps" target="_blank" rel="noopener noreferrer"
                className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                CAPS - Centro de Atenção Psicossocial
              </a>
              <a 
                href="https://www.gov.br/saude/pt-br/assuntos/saude-mental" target="_blank" rel="noopener noreferrer"
                className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ministério da Saúde - Saúde Mental
              </a>
            </div>        </div>

          {/* Emergência */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Emergência</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2 text-red-500" />
                <a href="tel:188">CVV LIGUE: 188 (24h gratuito )</a>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2 text-red-500" />
                <a href="tel:192">SAMU LIGUE: 192</a>                
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2 text-blue-500" />
                <a href="mailto:contato@menteleve.com.br">contato@menteleve.com.br</a>
              </div>
            </div>
            
            {/* Alerta de Emergência */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-red-700">
                  <p className="font-medium">Em caso de emergência, procure ajuda imediatamente!</p>
                  <p>Ligue 188 (CVV) ou 192 (SAMU) ou vá ao hospital mais próximo.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-xs text-gray-500">
              © 2025 Mente Leve - Plataforma de Saúde Mental. Desenvolvido com{' '}
              <Heart className="inline h-3 w-3 text-red-500" fill="currentColor" />{' '}
              para universitários.
            </p>
            <p className="text-xs text-gray-400">
              Esta plataforma não substitui o acompanhamento profissional. Sempre procure ajuda especializada quando necessário.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;