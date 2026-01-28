/**
 * Configurações da aplicação
 * Centraliza URLs e configurações de API
 */

const config = {
  // URL base da API backend
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  
  // Endpoints da API
  endpoints: {
    pluginConfig: '/cows',
  },
  
  // Configurações de timeout para requisições
  requestTimeout: 10000, // 10 segundos
  
  // Modo de desenvolvimento (usa mock se true)
  useMock: import.meta.env.VITE_USE_MOCK === 'true' || false,
}

export default config
