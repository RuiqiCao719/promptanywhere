export interface ApiConfig {
  apiKey: string;
  model: string;
  temperature: number;
  systemPrompt: string;
}

export const DEFAULT_API_CONFIG: Omit<ApiConfig, 'apiKey'> = {
  model: 'gpt-4o',
  temperature: 0.7,
  systemPrompt: 'You are a helpful assistant.'
}; 