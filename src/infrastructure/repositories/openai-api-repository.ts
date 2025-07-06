import { OpenAIRepository } from '../../domain/repositories/openai-repository.js';
import { ApiConfig } from '../../domain/entities/api-config.js';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature: number;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  error?: {
    message: string;
    type: string;
  };
}

export class OpenAIApiRepository implements OpenAIRepository {
  private readonly BASE_URL = 'https://api.openai.com/v1';

  async sendChatCompletion(text: string, config: ApiConfig): Promise<string> {
    const requestBody: OpenAIRequest = {
      model: config.model,
      messages: [
        { role: 'system', content: config.systemPrompt },
        { role: 'user', content: text }
      ],
      temperature: config.temperature
    };

    try {
      const response = await fetch(`${this.BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenAI API key.');
        }
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();

      if (data.error) {
        throw new Error(`OpenAI API error: ${data.error.message}`);
      }

      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response received from OpenAI API');
      }

      return data.choices[0].message.content;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred while calling OpenAI API');
    }
  }

  async testApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.BASE_URL}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }
} 