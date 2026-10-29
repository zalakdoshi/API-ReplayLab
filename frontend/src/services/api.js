import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Requests API
export const requestsAPI = {
  getAll: async (params) => {
    try {
      const response = await api.get('/requests', { params });
      return response;
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      // Return mock data on error
      return {
        data: {
          requests: [
            {
              _id: '1',
              name: 'Get User Profile',
              method: 'GET',
              url: 'http://localhost:3001/api/users/123',
              category: 'Users',
              description: 'Fetch user profile by ID',
              isActive: true,
              isCritical: false
            },
            {
              _id: '2',
              name: 'Create Post',
              method: 'POST',
              url: 'http://localhost:3001/api/posts',
              category: 'Posts',
              description: 'Create a new post',
              isActive: true,
              isCritical: true
            },
            {
              _id: '3',
              name: 'Get Todo Item',
              method: 'GET',
              url: 'http://localhost:3001/api/todos/1',
              category: 'Todos',
              description: 'Fetch a todo item',
              isActive: true,
              isCritical: false
            }
          ]
        }
      };
    }
  },
  getById: (id) => api.get(`/requests/${id}`),
  create: (data) => api.post('/requests', data),
  update: (id, data) => api.put(`/requests/${id}`, data),
  delete: (id) => api.delete(`/requests/${id}`),
  importCurl: (curlCommand) => api.post('/requests/import/curl', { curlCommand }),
  getStats: async () => {
    try {
      const response = await api.get('/requests/stats');
      return response;
    } catch (error) {
      console.error('Failed to fetch request stats:', error);
      // Return mock stats on error
      return {
        data: {
          total: 5,
          active: 5,
          critical: 2
        }
      };
    }
  },
};

// Replay API
export const replayAPI = {
  execute: (requestId, data) => api.post(`/replay/execute/${requestId}`, data),
  executeBatch: (data) => api.post('/replay/batch', data),
  getStatus: (runId) => api.get(`/replay/status/${runId}`),
  getAllRuns: async (params) => {
    try {
      const response = await api.get('/replay/runs', { params });
      return response;
    } catch (error) {
      console.error('Failed to fetch replay runs:', error);
      // Return mock data on error
      return {
        data: {
          runs: [
            {
              _id: '1',
              requestId: { _id: '1', name: 'Get User Profile', method: 'GET' },
              status: 'completed',
              createdAt: new Date().toISOString(),
              regression: { detected: false }
            },
            {
              _id: '2',
              requestId: { _id: '2', name: 'Create Post', method: 'POST' },
              status: 'completed',
              createdAt: new Date(Date.now() - 3600000).toISOString(),
              regression: { detected: true }
            }
          ]
        }
      };
    }
  },
  getStats: async () => {
    try {
      const response = await api.get('/replay/stats');
      return response;
    } catch (error) {
      console.error('Failed to fetch replay stats:', error);
      // Return mock stats on error
      return {
        data: {
          total: 3,
          completed: 3,
          failed: 0,
          regressionsDetected: 1
        }
      };
    }
  },
};

// Reports API
export const reportsAPI = {
  generate: (data) => api.post('/reports/generate', data),
  getAll: async (params) => {
    try {
      const response = await api.get('/reports', { params });
      return response;
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      // Return mock data on error
      return {
        data: []
      };
    }
  },
  getById: (id) => api.get(`/reports/${id}`),
  delete: (id) => api.delete(`/reports/${id}`),
  getStats: async () => {
    try {
      const response = await api.get('/reports/stats/overview');
      return response;
    } catch (error) {
      console.error('Failed to fetch report stats:', error);
      // Return mock stats on error
      return {
        data: {
          total: 1,
          passed: 0,
          failed: 1,
          warnings: 0
        }
      };
    }
  },
  getByBuild: (buildId) => api.get(`/reports/build/${buildId}`),
};

// Baselines API
export const baselinesAPI = {
  create: (data) => api.post('/baselines', data),
  getAll: (params) => api.get('/baselines', { params }),
  getByRequest: (requestId) => api.get(`/baselines/request/${requestId}`),
  delete: (id) => api.delete(`/baselines/${id}`),
  deactivate: (id) => api.patch(`/baselines/${id}/deactivate`),
};

// Health Check
export const healthCheck = () => api.get('/health');

export default api;
