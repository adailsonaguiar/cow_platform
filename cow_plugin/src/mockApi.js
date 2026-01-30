import config from "./config";

// Dados de fallback caso a API não esteja disponível
const QUESTION_SETS = [
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

const COMPONENT_TYPES = ["quiz", "spinwheel"];

const PRIZE_SETS = [
  [
    { id: 1, label: "20% OFF", color: "#FF6B6B", value: 20 },
    { id: 2, label: "30% OFF", color: "#4ECDC4", value: 30 },
    { id: 3, label: "15% OFF", color: "#FFE66D", value: 15 },
    { id: 4, label: "40% OFF", color: "#95E1D3", value: 40 },
    { id: 5, label: "10% OFF", color: "#F38181", value: 10 },
    { id: 6, label: "25% OFF", color: "#AA96DA", value: 25 },
    { id: 7, label: "35% OFF", color: "#FCBAD3", value: 35 },
    { id: 8, label: "50% OFF", color: "#A8E6CF", value: 50 },
  ],
];

/**
 * Busca configuração do plugin da API real
 * Se a API falhar, retorna dados de fallback
 */
export async function fetchPluginConfig() {
  // Se estiver em modo mock, usa dados locais
  if (config.useMock) {
    return fetchMockConfig();
  }

  const currentUrl = window.location.href;
  const site = window.location.hostname;

  console.log("🌐 Buscando configuração da API...", {
    url: currentUrl,
    site: site,
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.requestTimeout);

  const response = await fetch(
    `${config.apiBaseUrl}${config.endpoints.pluginConfig}?url=${encodeURIComponent(currentUrl)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    },
  );

  clearTimeout(timeoutId);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  console.log("🌐 Resposta recebida da API, processando...", response);

  const data = await response.json();

  console.log("✅ Configuração recebida da API:", data);

  // Valida e transforma os dados da API
  return parseApiResponse(data);
}

/**
 * Transforma a resposta da API no formato esperado pelo componente
 */
function parseApiResponse(apiData) {
  // Se for um array, pega o primeiro item (caso retorne múltiplas configs)
  const data = Array.isArray(apiData) ? apiData[0] : apiData;

  if (!data || !data.data) {
    console.warn("⚠️ Dados da API inválidos, usando fallback");
    return fetchMockConfig();
  }

  const pluginData = data.data;

  // Determina o tipo de componente
  const componentType = data.type || "quiz";

  let config = {
    type: componentType,
  };

  console.log("🔍 Processando dados para o tipo:", componentType, pluginData);
  if (componentType === "quiz" && pluginData.questions) {
    config.questions = pluginData.questions;
    console.log(
      `📋 API: Retornando FORMULÁRIO com ${config.questions.length} pergunta(s)`,
    );
  } else if (componentType === "spinwheel" && pluginData.prizes) {
    config.prizes = pluginData.prizes;
    config.preferredItem = pluginData.preferredItem || '';
  } else {
    console.warn(
      "⚠️ Tipo de componente não reconhecido ou dados faltando, usando fallback",
    );
    return fetchMockConfig();
  }

  return config;
}

/**
 * Retorna configuração mockada (fallback)
 */
function fetchMockConfig() {
  const componentType =
    COMPONENT_TYPES[Math.floor(Math.random() * COMPONENT_TYPES.length)];

  let config = {
    type: componentType,
  };

  if (componentType === "quiz") {
    const randomIndex = Math.floor(Math.random() * QUESTION_SETS.length);
    config.questions = QUESTION_SETS[randomIndex];
    console.log(
      `📋 Mock: Retornando FORMULÁRIO com ${config.questions.length} pergunta(s)`,
    );
  } else {
    const randomIndex = Math.floor(Math.random() * PRIZE_SETS.length);
    config.prizes = PRIZE_SETS[randomIndex];
    console.log(
      `🎡 Mock: Retornando ROLETA com ${config.prizes.length} prêmios`,
    );
  }

  return config;
}

/**
 * Busca configuração por tipo específico (usado em testes)
 */
export async function fetchPluginConfigByType(
  type = "quiz",
  scenarioIndex = 0,
) {
  if (config.useMock) {
    let mockConfig = { type };

    if (type === "quiz") {
      const index = Math.min(
        Math.max(0, scenarioIndex),
        QUESTION_SETS.length - 1,
      );
      mockConfig.questions = QUESTION_SETS[index];
      console.log(
        `📋 Mock (tipo: quiz, cenário ${index}): Retornando ${mockConfig.questions.length} pergunta(s)`,
      );
    } else {
      const index = Math.min(Math.max(0, scenarioIndex), PRIZE_SETS.length - 1);
      mockConfig.prizes = PRIZE_SETS[index];
      console.log(
        `🎡 Mock (tipo: spinwheel, cenário ${index}): Retornando ${mockConfig.prizes.length} prêmios`,
      );
    }

    return mockConfig;
  }

  try {
    const currentUrl = window.location.href;
    const response = await fetch(
      `${config.apiBaseUrl}${config.endpoints.pluginConfig}?url=${encodeURIComponent(currentUrl)}&type=${type}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return parseApiResponse(data);
  } catch (error) {
    console.warn("⚠️ Erro ao buscar por tipo, usando mock:", error.message);
    return fetchPluginConfigByType(type, scenarioIndex);
  }
}

/**
 * Busca apenas perguntas (compatibilidade)
 */
export async function fetchQuestions() {
  const pluginConfig = await fetchPluginConfig();
  if (pluginConfig.type === "quiz" && pluginConfig.questions) {
    return pluginConfig.questions;
  }
  return QUESTION_SETS[0];
}
