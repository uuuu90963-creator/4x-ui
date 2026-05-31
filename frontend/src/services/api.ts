import axios from 'axios';
import type { ApiResponse, PaginatedResponse, User, Server, Inbound, Client, Subscription, SubscriptionPlan, ServerStats, LoginCredentials, AuthTokens, PanelSettings, Alert } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
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

// Response interceptor - handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthTokens & { user: User }>> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (username: string, email: string, password: string): Promise<ApiResponse<AuthTokens & { user: User }>> => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },
  
  refresh: async (refreshToken: string): Promise<ApiResponse<AuthTokens>> => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

// User API
export const userApi = {
  getAll: async (page = 1, pageSize = 20): Promise<PaginatedResponse<User>> => {
    const response = await api.get('/users', { params: { page, pageSize } });
    return response.data;
  },
  
  getById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  create: async (user: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.post('/users', user);
    return response.data;
  },
  
  update: async (id: string, user: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put(`/users/${id}`, user);
    return response.data;
  },
  
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

// Server API
export const serverApi = {
  getAll: async (): Promise<ApiResponse<Server[]>> => {
    const response = await api.get('/servers');
    return response.data;
  },
  
  getById: async (id: string): Promise<ApiResponse<Server>> => {
    const response = await api.get(`/servers/${id}`);
    return response.data;
  },
  
  create: async (server: Partial<Server>): Promise<ApiResponse<Server>> => {
    const response = await api.post('/servers', server);
    return response.data;
  },
  
  update: async (id: string, server: Partial<Server>): Promise<ApiResponse<Server>> => {
    const response = await api.put(`/servers/${id}`, server);
    return response.data;
  },
  
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/servers/${id}`);
    return response.data;
  },
  
  healthCheck: async (id: string): Promise<ApiResponse<ServerStats>> => {
    const response = await api.post(`/servers/${id}/health-check`);
    return response.data;
  },
  
  deploy: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/servers/${id}/deploy`);
    return response.data;
  },
};

// Inbound API
export const inboundApi = {
  getAll: async (serverId?: string): Promise<ApiResponse<Inbound[]>> => {
    const response = await api.get('/inbounds', { params: { serverId } });
    return response.data;
  },
  
  getById: async (id: string): Promise<ApiResponse<Inbound>> => {
    const response = await api.get(`/inbounds/${id}`);
    return response.data;
  },
  
  create: async (inbound: Partial<Inbound>): Promise<ApiResponse<Inbound>> => {
    const response = await api.post('/inbounds', inbound);
    return response.data;
  },
  
  update: async (id: string, inbound: Partial<Inbound>): Promise<ApiResponse<Inbound>> => {
    const response = await api.put(`/inbounds/${id}`, inbound);
    return response.data;
  },
  
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/inbounds/${id}`);
    return response.data;
  },
  
  addClient: async (inboundId: string, client: Partial<Client>): Promise<ApiResponse<Client>> => {
    const response = await api.post(`/inbounds/${inboundId}/clients`, client);
    return response.data;
  },
  
  getClients: async (inboundId: string): Promise<ApiResponse<Client[]>> => {
    const response = await api.get(`/inbounds/${inboundId}/clients`);
    return response.data;
  },
};

// Client API
export const clientApi = {
  getAll: async (): Promise<ApiResponse<Client[]>> => {
    const response = await api.get('/clients');
    return response.data;
  },
  
  update: async (id: string, client: Partial<Client>): Promise<ApiResponse<Client>> => {
    const response = await api.put(`/clients/${id}`, client);
    return response.data;
  },
  
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },
  
  enable: async (id: string): Promise<ApiResponse<Client>> => {
    const response = await api.post(`/clients/${id}/enable`);
    return response.data;
  },
  
  disable: async (id: string): Promise<ApiResponse<Client>> => {
    const response = await api.post(`/clients/${id}/disable`);
    return response.data;
  },
  
  resetTraffic: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/clients/${id}/reset`);
    return response.data;
  },
};

// Stats API
export const statsApi = {
  getOverview: async (): Promise<ApiResponse<{
    totalServers: number;
    onlineServers: number;
    totalUsers: number;
    activeUsers: number;
    totalBandwidth: number;
    totalTrafficUsed: number;
  }>> => {
    const response = await api.get('/stats/overview');
    return response.data;
  },
  
  getTraffic: async (startDate: string, endDate: string): Promise<ApiResponse<ServerStats[]>> => {
    const response = await api.get('/stats/traffic', { params: { startDate, endDate } });
    return response.data;
  },
  
  getServerStats: async (serverId: string): Promise<ApiResponse<ServerStats>> => {
    const response = await api.get(`/stats/servers/${serverId}`);
    return response.data;
  },
};

// Settings API
export const settingsApi = {
  get: async (): Promise<ApiResponse<PanelSettings>> => {
    const response = await api.get('/settings');
    return response.data;
  },
  
  update: async (settings: Partial<PanelSettings>): Promise<ApiResponse<PanelSettings>> => {
    const response = await api.put('/settings', settings);
    return response.data;
  },
};

// Alert API
export const alertApi = {
  getAll: async (): Promise<ApiResponse<Alert[]>> => {
    const response = await api.get('/alerts');
    return response.data;
  },
  
  markAsRead: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/alerts/${id}/read`);
    return response.data;
  },
};

// Subscription API
export const subscriptionApi = {
  getAllPlans: async (): Promise<ApiResponse<SubscriptionPlan[]>> => {
    const response = await api.get('/subscriptions/plans');
    return response.data;
  },
  
  subscribe: async (planId: string): Promise<ApiResponse<Subscription>> => {
    const response = await api.post('/subscriptions', { planId });
    return response.data;
  },
  
  getUserSubscription: async (): Promise<ApiResponse<Subscription>> => {
    const response = await api.get('/subscriptions/current');
    return response.data;
  },
};

export default api;