/**
 * Dados de mock/fallback para testes e desenvolvimento
 * Usados quando a API não está disponível ou em modo de desenvolvimento
 */

// Conjuntos de perguntas para o componente Quiz
export const QUESTION_SETS = [
  [
    {
      id: 1,
      title: "Pergunta 1",
      question: "Você está gostando da sua experiência neste site?",
    },
    {
      id: 2,
      title: "Pergunta 2",
      question: "Você recomendaria este site para seus amigos?",
    },
  ],
  [
    {
      id: 1,
      title: "Pergunta 1",
      question: "Você está gostando da sua experiência neste site?",
    },
    {
      id: 2,
      title: "Pergunta 2",
      question: "Você recomendaria este site para seus amigos?",
    },
    {
      id: 3,
      title: "Pergunta 3",
      question: "O conteúdo é relevante para você?",
    },
  ],
  [
    {
      id: 1,
      title: "Pergunta Única",
      question: "Você está satisfeito com nosso serviço?",
    },
  ],
  [
    {
      id: 1,
      title: "Pergunta 1",
      question: "Você está gostando da sua experiência neste site?",
    },
    {
      id: 2,
      title: "Pergunta 2",
      question: "Você recomendaria este site para seus amigos?",
    },
    {
      id: 3,
      title: "Pergunta 3",
      question: "O conteúdo é relevante para você?",
    },
    { id: 4, title: "Pergunta 4", question: "A navegação é intuitiva?" },
  ],
];

// Tipos de componentes disponíveis
export const COMPONENT_TYPES = ["quiz", "spinwheel", "mysterybox"];

// Conjuntos de prêmios para o componente SpinWheel (Roleta)
export const PRIZE_SETS = [
  [
    { id: 1, label: "20% OFF", color: "#FF6B6B", value: 20 },
    { id: 2, label: "30% OFF", color: "#4ECDC4", value: 30 },
    { id: 3, label: "15% OFF", color: "#FFE66D", value: 15 },
    { id: 4, label: "40% OFF", color: "#95E1D3", value: 40 },
  ],
];

// Configurações específicas para MysteryBox (Caixa Surpresa)
// A quantidade de caixinhas exibidas é igual à quantidade de prêmios no array
export const MYSTERYBOX_SETS = [
  {
    prizes: [
      { id: 1, label: "10% OFF" },
      { id: 2, label: "15% OFF" },
      { id: 3, label: "25% OFF" },
    ],
    preferredItem: "25% OFF", // Sempre sorteará este prêmio
  }
];

/**
 * Retorna configuração mockada baseada no tipo de componente
 * @param {string} type - Tipo do componente (quiz, spinwheel, mysterybox)
 * @param {number} scenarioIndex - Índice do cenário de teste
 * @returns {Object} Configuração mockada
 */
export function getMockConfig(type = null, scenarioIndex = null) {
  // Se tipo não for especificado, escolhe aleatoriamente
  const componentType = type || COMPONENT_TYPES[2];

  let config = {
    type: componentType,
  };

  if (componentType === "quiz") {
    const index = scenarioIndex !== null 
      ? Math.min(Math.max(0, scenarioIndex), QUESTION_SETS.length - 1)
      : Math.floor(Math.random() * QUESTION_SETS.length);
    config.questions = QUESTION_SETS[index];
    console.log(
      `📋 Mock: Retornando FORMULÁRIO com ${config.questions.length} pergunta(s)`,
    );
  } else if (componentType === "spinwheel") {
    const index = scenarioIndex !== null
      ? Math.min(Math.max(0, scenarioIndex), PRIZE_SETS.length - 1)
      : Math.floor(Math.random() * PRIZE_SETS.length);
    config.prizes = PRIZE_SETS[index];
    console.log(
      `🎡 Mock: Retornando ROLETA com ${config.prizes.length} prêmios`,
    );
  } else if (componentType === "mysterybox") {
    const index = scenarioIndex !== null
      ? Math.min(Math.max(0, scenarioIndex), MYSTERYBOX_SETS.length - 1)
      : Math.floor(Math.random() * MYSTERYBOX_SETS.length);
    const mysteryboxConfig = MYSTERYBOX_SETS[index];
    config.prizes = mysteryboxConfig.prizes;
    config.preferredItem = mysteryboxConfig.preferredItem;
    console.log(
      `🎁 Mock: Retornando CAIXA SURPRESA com ${config.prizes.length} prêmios/caixinhas`,
    );
    console.log(`   Item preferido: ${config.preferredItem || "Nenhum (aleatório)"}`);
  }

  return config;
}
