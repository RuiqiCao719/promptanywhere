import { ManageApiConfigUseCase } from '../../domain/use-cases/manage-api-config.js';
import { ApiConfig } from '../../domain/entities/api-config.js';

export class ConfigController {
  constructor(private manageApiConfigUseCase: ManageApiConfigUseCase) {}

  async saveApiKey(apiKey: string): Promise<void> {
    try {
      await this.manageApiConfigUseCase.saveApiConfig(apiKey);
    } catch (error) {
      throw new Error(`Failed to save API key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getApiConfig(): Promise<ApiConfig | null> {
    try {
      return await this.manageApiConfigUseCase.getApiConfig();
    } catch (error) {
      throw new Error(`Failed to get API config: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async testApiKey(apiKey: string): Promise<boolean> {
    try {
      return await this.manageApiConfigUseCase.testApiKey(apiKey);
    } catch (error) {
      throw new Error(`Failed to test API key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async clearApiConfig(): Promise<void> {
    try {
      await this.manageApiConfigUseCase.clearApiConfig();
    } catch (error) {
      throw new Error(`Failed to clear API config: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 