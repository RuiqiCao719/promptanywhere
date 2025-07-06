import { StorageRepository } from '../repositories/storage-repository.js';
import { OpenAIRepository } from '../repositories/openai-repository.js';
import { ApiConfig, DEFAULT_API_CONFIG } from '../entities/api-config.js';

export class ManageApiConfigUseCase {
  constructor(
    private storageRepository: StorageRepository,
    private openAIRepository: OpenAIRepository
  ) {}

  async saveApiConfig(apiKey: string): Promise<void> {
    if (!apiKey || apiKey.trim().length === 0) {
      throw new Error('API key is required');
    }

    const config: ApiConfig = {
      apiKey: apiKey.trim(),
      ...DEFAULT_API_CONFIG
    };

    await this.storageRepository.saveApiConfig(config);
  }

  async getApiConfig(): Promise<ApiConfig | null> {
    return await this.storageRepository.getApiConfig();
  }

  async testApiKey(apiKey: string): Promise<boolean> {
    if (!apiKey || apiKey.trim().length === 0) {
      throw new Error('API key is required');
    }

    return await this.openAIRepository.testApiKey(apiKey.trim());
  }

  async clearApiConfig(): Promise<void> {
    await this.storageRepository.clearApiConfig();
  }
} 