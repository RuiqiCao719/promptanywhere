import { OpenAIRepository } from '../repositories/openai-repository.js';
import { StorageRepository } from '../repositories/storage-repository.js';
import { PromptRequest, PromptResponse } from '../entities/prompt-request.js';

export class ProcessTextPromptUseCase {
  constructor(
    private openAIRepository: OpenAIRepository,
    private storageRepository: StorageRepository
  ) {}

  async execute(text: string): Promise<PromptResponse> {
    if (!text || text.trim().length === 0) {
      throw new Error('No text selected');
    }

    const config = await this.storageRepository.getApiConfig();
    if (!config) {
      throw new Error('API key not configured. Please set up your OpenAI API key in the extension settings.');
    }

    const requestId = this.generateId();
    const request: PromptRequest = {
      id: requestId,
      text: text.trim(),
      timestamp: new Date(),
      status: 'pending'
    };

    try {
      const responseContent = await this.openAIRepository.sendChatCompletion(text, config);
      
      const response: PromptResponse = {
        id: this.generateId(),
        requestId,
        content: responseContent,
        timestamp: new Date()
      };

      return response;
    } catch (error) {
      throw new Error(`Failed to process prompt: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
} 