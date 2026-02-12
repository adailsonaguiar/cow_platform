/**
 * Serviço de API para o Plugin
 * Contém todas as funções de requisição HTTP
 */

import apiConfig from "./apiConfig";
import { getMockConfig, QUESTION_SETS } from "./mocks";

/**
 * Transforma a resposta da API no formato esperado pelo componente
 * @param {Object} apiData - Dados retornados pela API
 * @returns {Object} Configuração formatada
 */
function parseApiResponse(apiData) {
  // Se for um array, pega o primeiro item (caso retorne múltiplas configs)
  const data = Array.isArray(apiData) ? apiData[0] : apiData;

  if (!data || !data.data) {
    console.warn("⚠️ Dados da API inválidos, usando fallback");
    return getMockConfig();
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
    
  } else {
    console.warn(
      "⚠️ Tipo de componente não reconhecido ou dados faltando, usando fallback",
    );
    return getMockConfig();
  }

  return config;
}

/**
 * Busca configuração do plugin da API real
 * Se a API falhar, retorna dados de fallback
 * @returns {Promise<Object>} Configuração do plugin
 */
export async function fetchPluginConfig() {
  // Se estiver em modo mock, usa dados locais
  if (apiConfig.useMock) {
    return getMockConfig();
  }

  const currentUrl = window.location.href;
  const site = window.location.hostname;

  console.log("🌐 Buscando configuração da API...", {
    url: currentUrl,
    site: site,
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), apiConfig.requestTimeout);

  const response = await fetch(
    `${apiConfig.apiBaseUrl}${apiConfig.endpoints.pluginConfig}?url=${encodeURIComponent(currentUrl)}`,
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

  const data = await response.json();

  console.log("✅ Configuração recebida da API:", data);

  // Valida e transforma os dados da API
  return parseApiResponse(data);
}

/**
 * Busca configuração por tipo específico (usado em testes)
 * @param {string} type - Tipo do componente (quiz, spinwheel, mysterybox)
 * @param {number} scenarioIndex - Índice do cenário de teste
 * @returns {Promise<Object>} Configuração do plugin
 */
export async function fetchPluginConfigByType(type = "quiz", scenarioIndex = 0) {
  if (apiConfig.useMock) {
    return getMockConfig(type, scenarioIndex);
  }

  try {
    const currentUrl = window.location.href;
    const response = await fetch(
      `${apiConfig.apiBaseUrl}${apiConfig.endpoints.pluginConfig}?url=${encodeURIComponent(currentUrl)}&type=${type}`,
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
    return getMockConfig(type, scenarioIndex);
  }
}

/**
 * Busca apenas perguntas (compatibilidade com código legado)
 * @returns {Promise<Array>} Lista de perguntas
 */
export async function fetchQuestions() {
  const pluginConfig = await fetchPluginConfig();
  if (pluginConfig.type === "quiz" && pluginConfig.questions) {
    return pluginConfig.questions;
  }
  return QUESTION_SETS[0];
}
