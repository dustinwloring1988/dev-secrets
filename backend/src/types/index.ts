export interface App {
  id: string;
  name: string;
  createdAt: string;
}

export interface Secret {
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppRequest {
  id: string;
  name: string;
}

export interface CreateSecretRequest {
  key: string;
  value: string;
}

export interface AppInfo {
  id: string;
  name: string;
  secretCount: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
