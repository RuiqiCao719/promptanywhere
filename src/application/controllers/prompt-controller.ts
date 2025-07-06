import { ProcessTextPromptUseCase } from '../../domain/use-cases/process-text-prompt.js';
import { PromptResponse } from '../../domain/entities/prompt-request.js';

export class PromptController {
  constructor(private processTextPromptUseCase: ProcessTextPromptUseCase) {}

  async processSelectedText(text: string): Promise<PromptResponse> {
    try {
      return await this.processTextPromptUseCase.execute(text);
    } catch (error) {
      throw new Error(`Failed to process text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 