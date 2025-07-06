import { ApiConfig } from '../entities/api-config.js';

export interface StorageRepository {
  saveApiConfig(config: ApiConfig): Promise<void>;
  getApiConfig(): Promise<ApiConfig | null>;
  clearApiConfig(): Promise<void>;
} 