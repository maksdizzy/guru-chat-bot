import {
  type RAGRequest,
  type RAGResponse,
  type RAGClientConfig,
  RAGTimeoutError,
  RAGNetworkError,
  RAGValidationError,
} from './types';
import { ChatSDKError } from '../errors';

export class RAGClient {
  private config: Required<RAGClientConfig>;

  constructor(config: RAGClientConfig) {
    this.config = {
      endpoint: config.endpoint,
      defaultGroupId: config.defaultGroupId,
      timeout: config.timeout ?? 30000,
      maxRetries: config.maxRetries ?? 3,
      retryDelay: config.retryDelay ?? 1000,
    };
  }

  async search(request: RAGRequest): Promise<RAGResponse> {
    const { query, group_id = this.config.defaultGroupId, max_results = 5 } = request;

    if (!query || query.trim().length === 0) {
      throw new RAGValidationError('Query cannot be empty');
    }

    const requestBody = {
      query,
      group_id,
      max_results,
    };

    return this.executeWithRetry(async () => {
      return this.executeRequest(requestBody);
    });
  }

  private async executeRequest(body: Record<string, any>): Promise<RAGResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new RAGNetworkError(
          `RAG API request failed: ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      return this.validateResponse(data);
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof RAGNetworkError || error instanceof RAGValidationError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new RAGTimeoutError(
            `RAG API request timeout after ${this.config.timeout}ms`,
            error
          );
        }
        throw new RAGNetworkError(`RAG API request failed: ${error.message}`, undefined, error);
      }

      throw new RAGNetworkError('Unknown error occurred during RAG API request');
    }
  }

  private validateResponse(data: any): RAGResponse {
    if (!data || typeof data !== 'object') {
      throw new RAGValidationError('Invalid response format: expected object');
    }

    if (typeof data.llm_answer !== 'string') {
      throw new RAGValidationError('Invalid response: missing or invalid llm_answer');
    }

    if (!Array.isArray(data.sources)) {
      throw new RAGValidationError('Invalid response: sources must be an array');
    }

    for (const source of data.sources) {
      if (
        !source ||
        typeof source !== 'object' ||
        typeof source.msg_id !== 'string' ||
        typeof source.user_name !== 'string' ||
        typeof source.msg_date !== 'string' ||
        typeof source.msg_text !== 'string' ||
        (source.reply_to_msg_id !== undefined && 
         source.reply_to_msg_id !== null && 
         typeof source.reply_to_msg_id !== 'number')
      ) {
        throw new RAGValidationError('Invalid source format in response');
      }
    }

    return data as RAGResponse;
  }

  private async executeWithRetry<T>(
    fn: () => Promise<T>,
    attempt = 1
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (attempt >= this.config.maxRetries) {
        if (error instanceof RAGTimeoutError ||
            error instanceof RAGNetworkError ||
            error instanceof RAGValidationError) {
          throw new ChatSDKError('offline:api', error.message);
        }
        throw error;
      }

      if (error instanceof RAGValidationError) {
        throw error;
      }

      const delay = this.config.retryDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));

      return this.executeWithRetry(fn, attempt + 1);
    }
  }

  static createFromEnvironment(): RAGClient {
    const endpoint = process.env.RAG_ENDPOINT_URL ||
      'https://flowapi-dexguru.dexguru.biz/api/rag_search_telegram_es_db';
    const defaultGroupId = Number.parseInt(process.env.RAG_DEFAULT_GROUP_ID || '2493387211', 10);
    const timeout = process.env.RAG_TIMEOUT
      ? Number.parseInt(process.env.RAG_TIMEOUT, 10)
      : undefined;
    const maxRetries = process.env.RAG_MAX_RETRIES
      ? Number.parseInt(process.env.RAG_MAX_RETRIES, 10)
      : undefined;

    return new RAGClient({
      endpoint,
      defaultGroupId,
      timeout,
      maxRetries,
    });
  }
}