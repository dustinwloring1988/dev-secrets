import { ApiResponse, App, AppInfo } from './types';
import { handleResponse, request } from './errors';

export class AppsApi {
  constructor(private baseUrl: string) {}

  async list(): Promise<AppInfo[]> {
    const response = await request<ApiResponse<AppInfo[]>>(
      `${this.baseUrl}/api/apps`,
      { method: 'GET' }
    );
    return handleResponse(response);
  }

  async create(id: string, name: string): Promise<App> {
    const response = await request<ApiResponse<App>>(
      `${this.baseUrl}/api/apps`,
      {
        method: 'POST',
        body: JSON.stringify({ id, name }),
      }
    );
    return handleResponse(response);
  }

  async get(id: string): Promise<App> {
    const response = await request<ApiResponse<App>>(
      `${this.baseUrl}/api/apps/${id}`,
      { method: 'GET' }
    );
    return handleResponse(response);
  }

  async delete(id: string): Promise<void> {
    const response = await request<ApiResponse<void>>(
      `${this.baseUrl}/api/apps/${id}`,
      { method: 'DELETE' }
    );
    return handleResponse(response);
  }
}
