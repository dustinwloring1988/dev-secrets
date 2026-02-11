import { ApiResponse, Secret } from './types';
import { handleResponse, request } from './errors';

export class SecretsApi {
  constructor(private baseUrl: string) {}

  async list(appId: string): Promise<Secret[]> {
    const response = await request<ApiResponse<Secret[]>>(
      `${this.baseUrl}/api/apps/${appId}/secrets`,
      { method: 'GET' }
    );
    return handleResponse(response);
  }

  async get(appId: string, key: string): Promise<Secret | null> {
    const response = await request<ApiResponse<Secret | null>>(
      `${this.baseUrl}/api/apps/${appId}/secrets/${key}`,
      { method: 'GET' }
    );
    return handleResponse(response);
  }

  async add(appId: string, key: string, value: string): Promise<Secret> {
    const response = await request<ApiResponse<Secret>>(
      `${this.baseUrl}/api/apps/${appId}/secrets`,
      {
        method: 'POST',
        body: JSON.stringify({ key, value }),
      }
    );
    return handleResponse(response);
  }

  async delete(appId: string, key: string): Promise<void> {
    const response = await request<ApiResponse<void>>(
      `${this.baseUrl}/api/apps/${appId}/secrets/${key}`,
      { method: 'DELETE' }
    );
    return handleResponse(response);
  }
}
