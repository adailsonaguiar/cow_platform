import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
