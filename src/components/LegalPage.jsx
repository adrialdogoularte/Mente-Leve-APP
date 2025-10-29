import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Header from './Header';
import Footer from './Footer';
import { AlertCircle } from 'lucide-react';

// CORREÇÃO: Usar o sufixo '?raw' para importar o conteúdo do arquivo como uma string pura (necessário para Vite/Webpack)
import termosContent from '../static/termos_uso_v1.0.md?raw';
import politicaContent from '../static/politica_privacidade_v1.0.md?raw';

// Componente para carregar e exibir conteúdo Markdown
const LegalPage = ({ type }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    let markdownText;
    let pageTitle;

    if (type === 'politica') {
      markdownText = politicaContent;
      pageTitle = 'Política de Privacidade';
    } else {
      markdownText = termosContent;
      pageTitle = 'Termos de Uso';
    }

    setTitle(pageTitle);
    setContent(markdownText);
  }, [type]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">{title}</h1>
        
        {content ? (
          // A classe 'prose' é do Tailwind Typography. Se você não a usa, remova-a.
          <div className="prose max-w-none prose-blue">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
            <span className="text-red-700 text-sm">
                Ocorreu um erro ao carregar o conteúdo. Por favor, verifique se os arquivos .md existem no caminho correto e se a biblioteca 'react-markdown' está instalada.
            </span>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default LegalPage;
