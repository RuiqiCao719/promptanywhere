import { StorageRepository } from '../../domain/repositories/storage-repository.js';
import { ApiConfig } from '../../domain/entities/api-config.js';

export class ChromeStorageRepository implements StorageRepository {
  private readonly API_CONFIG_KEY = 'prompt_anywhere_api_config';

  async saveApiConfig(config: ApiConfig): Promise<void> {
    try {
      await chrome.storage.local.set({
        [this.API_CONFIG_KEY]: config
      });
    } catch (error) {
      throw new Error(`Failed to save API config: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getApiConfig(): Promise<ApiConfig | null> {
    try {
      const result = await chrome.storage.local.get(this.API_CONFIG_KEY);
      return result[this.API_CONFIG_KEY] || null;
    } catch (error) {
      throw new Error(`Failed to get API config: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async clearApiConfig(): Promise<void> {
    try {
      await chrome.storage.local.remove(this.API_CONFIG_KEY);
    } catch (error) {
      throw new Error(`Failed to clear API config: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 