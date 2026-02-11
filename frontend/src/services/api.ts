import axios from 'axios';
import { App, Secret, ApiResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const appApi = {
  getAll: async (): Promise<App[]> => {
    const { data } = await api.get<ApiResponse<App[]>>('/apps');
    if (!data.success) throw new Error(data.error);
    return data.data!;
  },

  create: async (id: string, name: string): Promise<App> => {
    const { data } = await api.post<ApiResponse<App>>('/apps', { id, name });
    if (!data.success) throw new Error(data.error);
    return data.data!;
  },

  delete: async (id: string): Promise<void> => {
    const { data } = await api.delete<ApiResponse<void>>(`/apps/${id}`);
    if (!data.success) throw new Error(data.error);
  }
};

export const secretsApi = {
  getAll: async (appId: string): Promise<Secret[]> => {
    const { data } = await api.get<ApiResponse<Secret[]>>(`/apps/${appId}/secrets`);
    if (!data.success) throw new Error(data.error);
    return data.data!;
  },

  add: async (appId: string, key: string, value: string): Promise<Secret> => {
    const { data } = await api.post<ApiResponse<Secret>>(`/apps/${appId}/secrets`, { key, value });
    if (!data.success) throw new Error(data.error);
    return data.data!;
  },

  delete: async (appId: string, key: string): Promise<void> => {
    const { data } = await api.delete<ApiResponse<void>>(`/apps/${appId}/secrets/${key}`);
    if (!data.success) throw new Error(data.error);
  }
};
