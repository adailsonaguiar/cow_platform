/**
 * Arquivo de índice para exportar todos os módulos da API
 * Facilita a importação em outros arquivos
 */

// Configurações da API
export { default as apiConfig } from './apiConfig';
export { 
  API_BASE_URL, 
  ENDPOINTS, 
  REQUEST_TIMEOUT, 
  USE_MOCK 
} from './apiConfig';

// Funções de requisição
export { 
  fetchPluginConfig, 
  fetchPluginConfigByType, 
  fetchQuestions 
} from './pluginApi';

// Dados de mock
export { 
  QUESTION_SETS, 
  COMPONENT_TYPES, 
  PRIZE_SETS, 
  MYSTERYBOX_SETS,
  getMockConfig 
} from './mocks';
