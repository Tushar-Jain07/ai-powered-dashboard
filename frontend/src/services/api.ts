import axios from 'axios';

// API URL - for Vercel deployment, use relative path for API calls
const API_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Dashboard API
export const dashboardApi = {
  // Get all dashboards
  getDashboards: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },
  
  // Get a single dashboard
  getDashboard: async (id: string) => {
    const response = await api.get(`/dashboard/${id}`);
    return response.data;
  },
  
  // Create a dashboard
  createDashboard: async (data: { title: string; description: string; isPublic: boolean }) => {
    const response = await api.post('/dashboard', data);
    return response.data;
  },
  
  // Update a dashboard
  updateDashboard: async (id: string, data: { title?: string; description?: string; isPublic?: boolean }) => {
    const response = await api.put(`/dashboard/${id}`, data);
    return response.data;
  },
  
  // Delete a dashboard
  deleteDashboard: async (id: string) => {
    const response = await api.delete(`/dashboard/${id}`);
    return response.data;
  },
  
  // Add a widget to a dashboard
  addWidget: async (dashboardId: string, widget: any) => {
    const response = await api.post(`/dashboard/${dashboardId}/widgets`, widget);
    return response.data;
  },
  
  // Update a widget
  updateWidget: async (dashboardId: string, widgetId: string, data: any) => {
    const response = await api.put(`/dashboard/${dashboardId}/widgets/${widgetId}`, data);
    return response.data;
  },
  
  // Delete a widget
  deleteWidget: async (dashboardId: string, widgetId: string) => {
    const response = await api.delete(`/dashboard/${dashboardId}/widgets/${widgetId}`);
    return response.data;
  },
};

// Data Source API
export const dataSourceApi = {
  // Get all data sources
  getDataSources: async () => {
    const response = await api.get('/data-sources');
    return response.data;
  },
  
  // Get a single data source
  getDataSource: async (id: string) => {
    const response = await api.get(`/data-sources/${id}`);
    return response.data;
  },
  
  // Create a data source
  createDataSource: async (data: any) => {
    const response = await api.post('/data-sources', data);
    return response.data;
  },
  
  // Update a data source
  updateDataSource: async (id: string, data: any) => {
    const response = await api.put(`/data-sources/${id}`, data);
    return response.data;
  },
  
  // Delete a data source
  deleteDataSource: async (id: string) => {
    const response = await api.delete(`/data-sources/${id}`);
    return response.data;
  },
  
  // Get data from a data source
  getData: async (id: string) => {
    const response = await api.get(`/data-sources/${id}/data`);
    return response.data;
  },
  
  // Refresh a data source
  refreshData: async (id: string) => {
    const response = await api.post(`/data-sources/${id}/refresh`);
    return response.data;
  },
  
  // Get schema from a data source
  getSchema: async (id: string) => {
    const response = await api.get(`/data-sources/${id}/schema`);
    return response.data;
  },
};

// ML Model API
export const mlApi = {
  // Get all models
  getModels: async () => {
    const response = await api.get('/ml/models');
    return response.data;
  },
  
  // Get a single model
  getModel: async (id: string) => {
    const response = await api.get(`/ml/models/${id}`);
    return response.data;
  },
  
  // Create a model
  createModel: async (data: any) => {
    const response = await api.post('/ml/models', data);
    return response.data;
  },
  
  // Update a model
  updateModel: async (id: string, data: any) => {
    const response = await api.put(`/ml/models/${id}`, data);
    return response.data;
  },
  
  // Delete a model
  deleteModel: async (id: string) => {
    const response = await api.delete(`/ml/models/${id}`);
    return response.data;
  },
  
  // Train a model
  trainModel: async (id: string) => {
    const response = await api.post(`/ml/models/${id}/train`);
    return response.data;
  },
  
  // Make predictions
  predict: async (id: string, features: any[]) => {
    const response = await api.post(`/ml/models/${id}/predict`, { features });
    return response.data;
  },
  
  // Get model metrics
  getMetrics: async (id: string) => {
    const response = await api.get(`/ml/models/${id}/metrics`);
    return response.data;
  },
  
  // Generate forecast (for time series models)
  forecast: async (id: string, horizon: number) => {
    const response = await api.post(`/ml/models/${id}/forecast`, { horizon });
    return response.data;
  },
  
  // Get feature importance
  getFeatureImportance: async (id: string) => {
    const response = await api.get(`/ml/models/${id}/features`);
    return response.data;
  },
};

export default api; 