import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Se falhar o refresh, limpa os tokens e redireciona para login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Serviço de autenticação
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));

    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignora erros no logout
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export const cowService = {
  // Get all cows
  getAll: async () => {
    const response = await api.get('/cows');
    return response.data;
  },

  // Get cow by ID
  getById: async (id) => {
    const response = await api.get(`/cows/${id}`);
    return response.data;
  },

  // Get cows by site
  getBySite: async (site) => {
    const response = await api.get('/cows', { params: { site } });
    return response.data;
  },

  // Get cows by type
  getByType: async (type) => {
    const response = await api.get('/cows', { params: { type } });
    return response.data;
  },

  // Get cow by URL and type
  getByUrlAndType: async (url, type) => {
    const response = await api.get('/cows', { params: { url, type } });
    return response.data;
  },

  // Create a new cow
  create: async (cowData) => {
    const response = await api.post('/cows', cowData);
    return response.data;
  },

  // Update a cow
  update: async (id, cowData) => {
    const response = await api.put(`/cows/${id}`, cowData);
    return response.data;
  },

  // Delete a cow
  delete: async (id) => {
    await api.delete(`/cows/${id}`);
  },

  // Delete all cows
  deleteAll: async () => {
    await api.delete('/cows');
  },
};

export default api;
