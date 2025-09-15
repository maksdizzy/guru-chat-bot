import { ChatSDKError } from '../errors';
import { fetchWithErrorHandlers } from '../utils';

export interface RAGRequest {
  group_id: number;
  question: string;
}

export interface RAGSource {
  msg_id: number;
  reply_to_msg_id: number | null;
  user_name: string;
  msg_date: string;
  msg_text: string;
}

export interface RAGResponse {
  llm_answer: string;
  sources: RAGSource[];
}

export interface RAGClientConfig {
  endpointUrl: string;
  defaultGroupId: number;
  timeout: number;
}

class RAGError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'RAGError';
  }
}

export class RAGClient {
  private config: RAGClientConfig;

  constructor(config: RAGClientConfig) {
    this.config = config;
  }

  async searchKnowledgeBase(query: string, groupId?: number): Promise<RAGResponse> {
    if (!query?.trim()) {
      throw new RAGError('Query parameter is required');
    }

    const groupId_ = groupId ?? this.config.defaultGroupId;
    const params = new URLSearchParams({
      group_id: groupId_.toString(),
      question: query.trim(),
    });

    const url = `${this.config.endpointUrl}/api/rag_search_telegram_es_db?${params}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetchWithErrorHandlers(url, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      return this.validateResponse(data);
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new RAGError(`Request timeout after ${this.config.timeout}ms`, error);
      }

      if (error instanceof ChatSDKError) {
        throw new RAGError(`API request failed: ${error.message}`, error);
      }

      throw new RAGError('Failed to search knowledge base', error);
    }
  }

  private validateResponse(data: unknown): RAGResponse {
    if (!data || typeof data !== 'object') {
      throw new RAGError('Invalid response format: expected object');
    }

    const response = data as Record<string, unknown>;

    if (typeof response.llm_answer !== 'string') {
      throw new RAGError('Invalid response format: missing or invalid llm_answer');
    }

    if (!Array.isArray(response.sources)) {
      throw new RAGError('Invalid response format: missing or invalid sources array');
    }

    const sources = response.sources.map((source, index) => {
      if (!source || typeof source !== 'object') {
        throw new RAGError(`Invalid source format at index ${index}: expected object`);
      }

      const src = source as Record<string, unknown>;

      if (typeof src.msg_id !== 'number') {
        throw new RAGError(`Invalid source format at index ${index}: missing or invalid msg_id`);
      }

      if (src.reply_to_msg_id !== null && typeof src.reply_to_msg_id !== 'number') {
        throw new RAGError(`Invalid source format at index ${index}: invalid reply_to_msg_id`);
      }

      if (typeof src.user_name !== 'string') {
        throw new RAGError(`Invalid source format at index ${index}: missing or invalid user_name`);
      }

      if (typeof src.msg_date !== 'string') {
        throw new RAGError(`Invalid source format at index ${index}: missing or invalid msg_date`);
      }

      if (typeof src.msg_text !== 'string') {
        throw new RAGError(`Invalid source format at index ${index}: missing or invalid msg_text`);
      }

      return {
        msg_id: src.msg_id,
        reply_to_msg_id: src.reply_to_msg_id,
        user_name: src.user_name,
        msg_date: src.msg_date,
        msg_text: src.msg_text,
      } as RAGSource;
    });

    return {
      llm_answer: response.llm_answer,
      sources,
    };
  }
}

let defaultClient: RAGClient | null = null;

export function getRAGClient(): RAGClient {
  if (!defaultClient) {
    const endpointUrl = process.env.RAG_ENDPOINT_URL;
    const defaultGroupId = process.env.RAG_DEFAULT_GROUP_ID;
    const timeout = process.env.RAG_REQUEST_TIMEOUT;

    if (!endpointUrl) {
      throw new RAGError('RAG_ENDPOINT_URL environment variable is required');
    }

    const config: RAGClientConfig = {
      endpointUrl,
      defaultGroupId: defaultGroupId ? Number.parseInt(defaultGroupId, 10) : 2493387211,
      timeout: timeout ? Number.parseInt(timeout, 10) : 10000,
    };

    if (Number.isNaN(config.defaultGroupId)) {
      throw new RAGError('RAG_DEFAULT_GROUP_ID must be a valid number');
    }

    if (Number.isNaN(config.timeout)) {
      throw new RAGError('RAG_REQUEST_TIMEOUT must be a valid number');
    }

    defaultClient = new RAGClient(config);
  }

  return defaultClient;
}

export async function searchKnowledgeBase(query: string, groupId?: number): Promise<RAGResponse> {
  const client = getRAGClient();
  return client.searchKnowledgeBase(query, groupId);
}