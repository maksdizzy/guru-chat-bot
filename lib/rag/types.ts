export interface RAGSource {
  msg_id: string;
  reply_to_msg_id?: number | null;
  user_name: string;
  msg_date: string;
  msg_text: string;
}

export interface RAGResponse {
  llm_answer: string;
  sources: RAGSource[];
}

export interface RAGRequest {
  query: string;
  group_id?: number;
  max_results?: number;
}

export interface RAGClientConfig {
  endpoint: string;
  defaultGroupId: number;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
}

export class RAGError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'RAGError';
  }
}

export class RAGTimeoutError extends RAGError {
  constructor(message: string, cause?: Error) {
    super(message, 'TIMEOUT', undefined, cause);
    this.name = 'RAGTimeoutError';
  }
}

export class RAGNetworkError extends RAGError {
  constructor(message: string, statusCode?: number, cause?: Error) {
    super(message, 'NETWORK_ERROR', statusCode, cause);
    this.name = 'RAGNetworkError';
  }
}

export class RAGValidationError extends RAGError {
  constructor(message: string, cause?: Error) {
    super(message, 'VALIDATION_ERROR', undefined, cause);
    this.name = 'RAGValidationError';
  }
}