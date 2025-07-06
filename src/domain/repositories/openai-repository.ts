import { ApiConfig } from '../entities/api-config.js';

export interface OpenAIRepository {
  sendChatCompletion(text: string, config: ApiConfig): Promise<string>;
  testApiKey(apiKey: string): Promise<boolean>;
} 