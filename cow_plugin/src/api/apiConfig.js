/**
 * Configurações específicas da API
 * Contém URLs, endpoints e configurações de requisições
 */

// URL base da API backend
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Endpoints da API
export const ENDPOINTS = {
  pluginConfig: '/cows',
};

// Configurações de timeout para requisições
export const REQUEST_TIMEOUT = 10000; // 10 segundos

// Modo de desenvolvimento (usa mock se true)
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || false;

// Configuração completa (para compatibilidade)
const apiConfig = {
  apiBaseUrl: API_BASE_URL,
  endpoints: ENDPOINTS,
  requestTimeout: REQUEST_TIMEOUT,
  useMock: USE_MOCK,
};

export default apiConfig;
