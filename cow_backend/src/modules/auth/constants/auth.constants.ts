export const AuthConstants = {
  // Em produção, use variáveis de ambiente
  JWT_SECRET: process.env.JWT_SECRET || 'cow_platform_jwt_secret_key_2026',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'cow_platform_jwt_refresh_secret_key_2026',
  JWT_EXPIRATION: 900, // Token expira em 15 minutos (em segundos)
  JWT_REFRESH_EXPIRATION: 604800, // Refresh token expira em 7 dias (em segundos)
};
