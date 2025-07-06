export interface PromptRequest {
  id: string;
  text: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
}

export interface PromptResponse {
  id: string;
  requestId: string;
  content: string;
  timestamp: Date;
} 