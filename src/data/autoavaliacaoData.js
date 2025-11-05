// Arquivo: src/data/autoavaliacaoData.js

export const perguntasAutoavaliacao = [
    {
        id: 1,
        texto: "Sinto-me sobrecarregado(a) com as demandas acadêmicas (provas, trabalhos, leituras).",
        categoria: "estresse_academico",
        opcoes: [
            { id: 1, texto: "Nunca", pontuacao: 1 },
            { id: 2, texto: "Raramente", pontuacao: 2 },
            { id: 3, texto: "Às vezes", pontuacao: 3 },
            { id: 4, texto: "Frequentemente", pontuacao: 4 },
            { id: 5, texto: "Sempre", pontuacao: 5 },
        ],
    },
    {
        id: 2,
        texto: "Tenho tido dificuldade para dormir ou me sinto cansado(a) mesmo após dormir.",
        categoria: "sono_descanso",
        opcoes: [
            { id: 1, texto: "Nunca", pontuacao: 1 },
            { id: 2, texto: "Raramente", pontuacao: 2 },
            { id: 3, texto: "Às vezes", pontuacao: 3 },
            { id: 4, texto: "Frequentemente", pontuacao: 4 },
            { id: 5, texto: "Sempre", pontuacao: 5 },
        ],
    },
    {
        id: 3,
        texto: "Meus relacionamentos (familiares, amigos, parceiro(a)) têm sido fonte de preocupação ou conflito.",
        categoria: "relacionamentos",
        opcoes: [
            { id: 1, texto: "Nunca", pontuacao: 1 },
            { id: 2, texto: "Raramente", pontuacao: 2 },
            { id: 3, texto: "Às vezes", pontuacao: 3 },
            { id: 4, texto: "Frequentemente", pontuacao: 4 },
            { id: 5, texto: "Sempre", pontuacao: 5 },
        ],
    },
    {
        id: 4,
        texto: "Sinto-me triste, desanimado(a) ou com falta de interesse nas atividades que costumava gostar.",
        categoria: "humor_emocoes",
        opcoes: [
            { id: 1, texto: "Nunca", pontuacao: 1 },
            { id: 2, texto: "Raramente", pontuacao: 2 },
            { id: 3, texto: "Às vezes", pontuacao: 3 },
            { id: 4, texto: "Frequentemente", pontuacao: 4 },
            { id: 5, texto: "Sempre", pontuacao: 5 },
        ],
    },
    {
        id: 5,
        texto: "Tenho sentido ansiedade, preocupação excessiva ou ataques de pânico.",
        categoria: "ansiedade",
        opcoes: [
            { id: 1, texto: "Nunca", pontuacao: 1 },
            { id: 2, texto: "Raramente", pontuacao: 2 },
            { id: 3, texto: "Às vezes", pontuacao: 3 },
            { id: 4, texto: "Frequentemente", pontuacao: 4 },
            { id: 5, texto: "Sempre", pontuacao: 5 },
        ],
    },
    {
        id: 6,
        texto: "Tenho dedicado tempo suficiente para atividades de autocuidado (exercícios, hobbies, relaxamento).",
        categoria: "autocuidado",
        opcoes: [
            { id: 1, texto: "Sempre", pontuacao: 1 },
            { id: 2, texto: "Frequentemente", pontuacao: 2 },
            { id: 3, texto: "Às vezes", pontuacao: 3 },
            { id: 4, texto: "Raramente", pontuacao: 4 },
            { id: 5, texto: "Nunca", pontuacao: 5 },
        ],
    },
    {
        id: 7,
        texto: "Tenho dificuldade em me concentrar nos estudos ou em outras tarefas importantes.",
        categoria: "concentracao",
        opcoes: [
            { id: 1, texto: "Nunca", pontuacao: 1 },
            { id: 2, texto: "Raramente", pontuacao: 2 },
            { id: 3, texto: "Às vezes", pontuacao: 3 },
            { id: 4, texto: "Frequentemente", pontuacao: 4 },
            { id: 5, texto: "Sempre", pontuacao: 5 },
        ],
    },
    {
        id: 8,
        texto: "No geral, sinto que meu bem-estar mental está comprometido.",
        categoria: "bem_estar_geral",
        opcoes: [
            { id: 1, texto: "Nunca", pontuacao: 1 },
            { id: 2, texto: "Raramente", pontuacao: 2 },
            { id: 3, texto: "Às vezes", pontuacao: 3 },
            { id: 4, texto: "Frequentemente", pontuacao: 4 },
            { id: 5, texto: "Sempre", pontuacao: 5 },
        ],
    },
];

// Mapeamento para acesso rápido
export const mapaPerguntas = perguntasAutoavaliacao.reduce((acc, pergunta) => {
    acc[pergunta.id] = pergunta;
    return acc;
}, {});

export const mapaOpcoes = perguntasAutoavaliacao.reduce((acc, pergunta) => {
    acc[pergunta.id] = pergunta.opcoes.reduce((opcoesAcc, opcao) => {
        opcoesAcc[opcao.id] = opcao;
        return opcoesAcc;
    }, {});
    return acc;
}, {});
