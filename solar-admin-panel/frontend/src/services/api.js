import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Model Coefficients API
export const coefficientsAPI = {
  get: () => api.get('/coefficients'),
  update: (data) => api.put('/coefficients', data),
};

// Variables API
export const variablesAPI = {
  getAll: () => api.get('/variables'),
  create: (data) => api.post('/variables', data),
  update: (id, data) => api.put(`/variables/${id}`, data),
  delete: (id) => api.delete(`/variables/${id}`),
};

// Locations API
export const locationsAPI = {
  getAll: () => api.get('/locations'),
  getByLocation: (province, district, city) => 
    api.get(`/locations/${province}/${district}/${city}`),
  createOrUpdate: (data) => api.post('/locations', data),
  delete: (id) => api.delete(`/locations/${id}`),
};

// Analytics API
export const analyticsAPI = {
  get: () => api.get('/analytics'),
  update: (data) => api.put('/analytics', data),
  incrementCalculation: () => api.post('/analytics/increment-calculation'),
};

export default api;