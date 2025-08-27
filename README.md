# Ueb - Plataforma de Saúde Mental

Uma plataforma React desenvolvida para apoio à saúde mental de jovens universitários, oferecendo ferramentas de autoavaliação, registro de humor, recursos educacionais e agendamento com psicólogos.

## 🚀 Funcionalidades

- **Página Inicial**: Apresentação da plataforma e suas funcionalidades
- **Autoavaliação**: Questionário interativo para avaliar bem-estar mental
- **Registro de Humor**: Acompanhamento diário de emoções com histórico
- **Dicas e Recursos**: Artigos e conteúdos sobre saúde mental
- **Agendamento**: Sistema para agendar consultas com psicólogos voluntários
- **Suporte**: Recursos de emergência e contatos de apoio

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Ícones
- **shadcn/ui** - Componentes de UI
- **React Router DOM** - Para navegação entre as páginas

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js (versão 16 ou superior)
- pnpm (recomendado) ou npm

### Passos para executar

1. **Clone ou extraia o projeto**
   ```bash
   cd mente-leve-app
   ```

2. **Instale as dependências**
   ```bash
   pnpm install
   # ou
   npm install
   ```

3. **Execute o servidor de desenvolvimento**
   ```bash
   pnpm run dev
   # ou
   npm run dev
   ```

4. **Acesse a aplicação**
   - Abra seu navegador em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
mente-leve-app/
├── public/                 # Arquivos estáticos
├── src/
│   ├── components/         # Componentes React
│   │   ├── Header.jsx     # Cabeçalho da aplicação
│   │   ├── Footer.jsx     # Rodapé da aplicação
│   │   ├── Home.jsx       # Página inicial
│   │   ├── Autoavaliacao.jsx  # Tela de autoavaliação
│   │   ├── RegistroHumor.jsx  # Tela de registro de humor
│   │   ├── Dicas.jsx      # Tela de dicas e recursos
│   │   ├── Agendamento.jsx    # Tela de agendamento
│   │   ├── Suporte.jsx    # Tela de suporte
│   │   └── ui/            # Componentes de UI (shadcn/ui)
│   ├── assets/            # Imagens e outros assets
│   ├── lib/               # Utilitários
│   ├── App.jsx            # Componente principal (com roteamento)
│   ├── App.css            # Estilos globais
│   └── main.jsx           # Ponto de entrada
├── package.json           # Dependências e scripts
└── README.md             # Este arquivo
```

## 🎨 Componentes Principais

### Header
- Navegação principal da aplicação (com roteamento)
- Logo da marca Ueb
- Menu responsivo

### Footer
- Links úteis para recursos de saúde mental
- Contatos de emergência
- Informações da plataforma

### Home
- Página de boas-vindas
- Apresentação das funcionalidades
- Call-to-actions para principais recursos (com roteamento)

### Autoavaliacao
- Questionário de 8 perguntas sobre bem-estar
- Barra de progresso
- Navegação entre perguntas

### RegistroHumor
- Seleção de humor com emojis
- Campo para notas pessoais
- Histórico de registros
- Estatísticas básicas

### Dicas
- Artigos sobre saúde mental
- Sistema de busca e filtros
- Categorização por temas

### Agendamento
- Lista de psicólogos disponíveis
- Formulário de agendamento
- Visualização de agendamentos

### Suporte
- Contatos de emergência
- Recursos de saúde mental
- Apps de autoajuda
- Sinais de alerta

## 🚀 Scripts Disponíveis

- `pnpm run dev` - Inicia o servidor de desenvolvimento
- `pnpm run build` - Gera build de produção
- `pnpm run preview` - Visualiza o build de produção
- `pnpm run lint` - Executa o linter

## 🎯 Próximos Passos

Para implementar em produção, considere:

1. **Backend Integration**: Conectar com APIs para persistir dados
2. **Autenticação**: Sistema de login/registro de usuários
3. **Banco de Dados**: Armazenar avaliações, humor e agendamentos
4. **Notificações**: Lembretes para registro de humor
5. **Dashboard**: Gráficos e análises dos dados do usuário
6. **PWA**: Transformar em Progressive Web App
7. **Testes**: Implementar testes unitários e de integração

## 📝 Notas Importantes

- Esta é uma versão de demonstração/protótipo
- Os dados são simulados (não persistem)
- Para uso em produção, implemente backend e banco de dados
- Sempre consulte profissionais de saúde mental qualificados
- Em emergências, procure ajuda imediatamente (CVV: 188, SAMU: 192)

## 🤝 Contribuição

Este projeto foi desenvolvido como uma solução para apoio à saúde mental universitária. Contribuições são bem-vindas!

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

