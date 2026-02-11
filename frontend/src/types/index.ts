export interface App {
  id: string;
  name: string;
  secretCount: number;
  createdAt: string;
}

export interface Secret {
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
