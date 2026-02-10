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

const COMPONENT_TYPES = ["quiz", "spinwheel", "mysterybox"];

const PRIZE_SETS = [
  [
    { id: 1, label: "20% OFF", color: "#FF6B6B", value: 20 },
    { id: 2, label: "30% OFF", color: "#4ECDC4", value: 30 },
    { id: 3, label: "15% OFF", color: "#FFE66D", value: 15 },
  ],
];

// Configurações específicas para MysteryBox (Caixa Surpresa)
// A quantidade de caixinhas exibidas é igual à quantidade de prêmios no array
const MYSTERYBOX_SETS = [
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
    console.log(
      `🎡 API: Retornando ROLETA com ${config.prizes.length} prêmios`,
    );
  } else if (componentType === "mysterybox" && (pluginData.prizes || pluginData.prize)) {
    // Suporta dois formatos:
    // 1. Novo: pluginData.prizes = array com { id, label }
    // 2. Antigo: pluginData.prize = string com o prêmio único
    // A quantidade de caixinhas = quantidade de prêmios
    
    if (pluginData.prizes && Array.isArray(pluginData.prizes)) {
      // Formato novo com array de prêmios (do MysteryBoxConfig)
      config.prizes = pluginData.prizes;
      config.preferredItem = pluginData.preferredItem || '';
    } else if (pluginData.prize) {
      // Formato antigo com prêmio único (compatibilidade com "gift" type)
      config.prizes = [
        {
          id: 1,
          label: pluginData.prize,
        }
      ];
      config.preferredItem = pluginData.prize; // Sempre o prêmio único
    }
    
    console.log(
      `🎁 API: Retornando CAIXA SURPRESA com ${config.prizes?.length || 0} prêmio(s)/caixinha(s)`,
    );
    console.log("   Prêmios recebidos:", config.prizes);
    console.log("   Item preferido:", config.preferredItem || "Nenhum (aleatório)");
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
    COMPONENT_TYPES[2];

  let config = {
    type: componentType,
  };

  if (componentType === "quiz") {
    const randomIndex = Math.floor(Math.random() * QUESTION_SETS.length);
    config.questions = QUESTION_SETS[randomIndex];
    console.log(
      `📋 Mock: Retornando FORMULÁRIO com ${config.questions.length} pergunta(s)`,
    );
  } else if (componentType === "spinwheel") {
    const randomIndex = Math.floor(Math.random() * PRIZE_SETS.length);
    config.prizes = PRIZE_SETS[randomIndex];
    console.log(
      `🎡 Mock: Retornando ROLETA com ${config.prizes.length} prêmios`,
    );
  } else if (componentType === "mysterybox") {
    const randomIndex = Math.floor(Math.random() * MYSTERYBOX_SETS.length);
    const mysteryboxConfig = MYSTERYBOX_SETS[randomIndex];
    config.prizes = mysteryboxConfig.prizes;
    config.preferredItem = mysteryboxConfig.preferredItem;
    console.log(
      `🎁 Mock: Retornando CAIXA SURPRESA com ${config.prizes.length} prêmios/caixinhas`,
    );
    console.log(`   Item preferido: ${config.preferredItem || "Nenhum (aleatório)"}`);
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
    } else if (type === "spinwheel") {
      const index = Math.min(Math.max(0, scenarioIndex), PRIZE_SETS.length - 1);
      mockConfig.prizes = PRIZE_SETS[index];
      console.log(
        `🎡 Mock (tipo: spinwheel, cenário ${index}): Retornando ${mockConfig.prizes.length} prêmios`,
      );
    } else if (type === "mysterybox") {
      const index = Math.min(Math.max(0, scenarioIndex), MYSTERYBOX_SETS.length - 1);
      const mysteryboxConfig = MYSTERYBOX_SETS[index];
      mockConfig.prizes = mysteryboxConfig.prizes;
      mockConfig.preferredItem = mysteryboxConfig.preferredItem;
      console.log(
        `🎁 Mock (tipo: mysterybox, cenário ${index}): Retornando ${mockConfig.prizes.length} prêmios/caixinhas`,
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
