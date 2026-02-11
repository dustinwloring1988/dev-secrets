import { ApiResponse } from './types';

export class DevSecretsError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errorCode?: string
  ) {
    super(message);
    this.name = 'DevSecretsError';
  }
}

export function handleResponse<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    throw new DevSecretsError(response.error || 'Request failed', undefined, 'API_ERROR');
  }
  if (!response.data) {
    throw new DevSecretsError('No data returned', undefined, 'NO_DATA');
  }
  return response.data;
}

export async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new DevSecretsError(
      `HTTP Error: ${response.status} ${response.statusText}`,
      response.status
    );
  }

  return response.json() as T;
}
