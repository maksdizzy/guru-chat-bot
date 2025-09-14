import { test, expect } from '@playwright/test';
import { RAGClient } from '@/lib/rag/client';
import type { RAGResponse } from '@/lib/rag/client';

test.describe('RAGClient Unit Tests', () => {
  let ragClient: RAGClient;
  const originalFetch = global.fetch;

  test.beforeEach(async () => {
    ragClient = new RAGClient({
      endpointUrl: 'https://test-endpoint.example.com',
      defaultGroupId: 123456789,
      timeout: 5000,
    });
  });

  test.afterEach(async () => {
    global.fetch = originalFetch;
  });

  test('creates client with provided config', () => {
    const config = {
      endpointUrl: 'https://example.com',
      defaultGroupId: 12345,
      timeout: 10000,
    };
    const client = new RAGClient(config);
    expect(client).toBeTruthy();
  });

  test('successfully searches knowledge base with valid query', async () => {
    const mockResponse: RAGResponse = {
      llm_answer: 'This is a test answer',
      sources: [
        {
          msg_id: 1,
          reply_to_msg_id: null,
          user_name: 'test_user',
          msg_date: '2023-01-01',
          msg_text: 'Test message',
        },
      ],
    };

    global.fetch = async () => ({
      ok: true,
      json: async () => mockResponse,
    }) as Response;

    const result = await ragClient.searchKnowledgeBase('test query');

    expect(result).toEqual(mockResponse);
  });

  test('uses custom group_id when provided', async () => {
    const mockResponse: RAGResponse = {
      llm_answer: 'Test answer',
      sources: [],
    };

    let capturedBody: string;
    global.fetch = async (url: string, init?: RequestInit) => {
      capturedBody = init?.body as string;
      return {
        ok: true,
        json: async () => mockResponse,
      } as Response;
    };

    await ragClient.searchKnowledgeBase('test query', 987654321);

    expect(capturedBody).toBeDefined();
    const requestData = JSON.parse(capturedBody || '{}');
    expect(requestData.group_id).toBe(987654321);
  });

  test('trims whitespace from query', async () => {
    const mockResponse: RAGResponse = {
      llm_answer: 'Test answer',
      sources: [],
    };

    let capturedBody: string;
    global.fetch = async (url: string, init?: RequestInit) => {
      capturedBody = init?.body as string;
      return {
        ok: true,
        json: async () => mockResponse,
      } as Response;
    };

    await ragClient.searchKnowledgeBase('  test query  ');

    expect(capturedBody).toBeDefined();
    const requestData = JSON.parse(capturedBody || '{}');
    expect(requestData.query).toBe('test query');
  });

  test('throws error for empty query', async () => {
    await expect(ragClient.searchKnowledgeBase('')).rejects.toThrow(
      'Query parameter is required'
    );
    await expect(ragClient.searchKnowledgeBase('   ')).rejects.toThrow(
      'Query parameter is required'
    );
  });

  test('handles timeout error', async () => {
    global.fetch = async () => {
      return new Promise(() => {
        // Never resolves to simulate timeout
      });
    };

    await expect(ragClient.searchKnowledgeBase('test query')).rejects.toThrow(
      'Request timeout after 5000ms'
    );
  });

  test('handles network error', async () => {
    global.fetch = async () => {
      throw new Error('Network error');
    };

    await expect(ragClient.searchKnowledgeBase('test query')).rejects.toThrow(
      'Failed to search knowledge base'
    );
  });

  test('validates response format - missing llm_answer', async () => {
    global.fetch = async () => ({
      ok: true,
      json: async () => ({ sources: [] }),
    }) as Response;

    await expect(ragClient.searchKnowledgeBase('test query')).rejects.toThrow(
      'Invalid response format: missing or invalid llm_answer'
    );
  });

  test('validates response format - missing sources', async () => {
    global.fetch = async () => ({
      ok: true,
      json: async () => ({ llm_answer: 'test' }),
    }) as Response;

    await expect(ragClient.searchKnowledgeBase('test query')).rejects.toThrow(
      'Invalid response format: missing or invalid sources array'
    );
  });

  test('validates source format - missing msg_id', async () => {
    global.fetch = async () => ({
      ok: true,
      json: async () => ({
        llm_answer: 'test',
        sources: [
          {
            user_name: 'test',
            msg_date: '2023-01-01',
            msg_text: 'test',
          },
        ],
      }),
    }) as Response;

    await expect(ragClient.searchKnowledgeBase('test query')).rejects.toThrow(
      'Invalid source format at index 0: missing or invalid msg_id'
    );
  });

  test('accepts null reply_to_msg_id', async () => {
    const mockResponse = {
      llm_answer: 'test answer',
      sources: [
        {
          msg_id: 1,
          reply_to_msg_id: null,
          user_name: 'test_user',
          msg_date: '2023-01-01',
          msg_text: 'test message',
        },
      ],
    };

    global.fetch = async () => ({
      ok: true,
      json: async () => mockResponse,
    }) as Response;

    const result = await ragClient.searchKnowledgeBase('test query');
    expect(result.sources[0].reply_to_msg_id).toBeNull();
  });

  test('handles multiple sources correctly', async () => {
    const mockResponse = {
      llm_answer: 'test answer',
      sources: [
        {
          msg_id: 1,
          reply_to_msg_id: null,
          user_name: 'user1',
          msg_date: '2023-01-01',
          msg_text: 'message 1',
        },
        {
          msg_id: 2,
          reply_to_msg_id: 1,
          user_name: 'user2',
          msg_date: '2023-01-02',
          msg_text: 'message 2',
        },
      ],
    };

    global.fetch = async () => ({
      ok: true,
      json: async () => mockResponse,
    }) as Response;

    const result = await ragClient.searchKnowledgeBase('test query');
    expect(result.sources).toHaveLength(2);
    expect(result.sources[1].reply_to_msg_id).toBe(1);
  });
});

test.describe('getRAGClient', () => {
  const originalEnv = process.env;

  test.beforeEach(async () => {
    process.env = { ...originalEnv };
  });

  test.afterEach(async () => {
    process.env = originalEnv;
  });

  test('creates client with environment variables', async () => {
    process.env.RAG_ENDPOINT_URL = 'https://env-endpoint.example.com';
    process.env.RAG_DEFAULT_GROUP_ID = '987654321';
    process.env.RAG_REQUEST_TIMEOUT = '15000';

    // Dynamic import to get fresh module with updated env vars
    const { getRAGClient } = await import('@/lib/rag/client');
    const client = getRAGClient();
    expect(client).toBeTruthy();
  });

  test('throws error if RAG_ENDPOINT_URL is missing', async () => {
    process.env.RAG_ENDPOINT_URL = undefined;

    const { getRAGClient } = await import('@/lib/rag/client');
    expect(() => getRAGClient()).toThrow(
      'RAG_ENDPOINT_URL environment variable is required'
    );
  });
});

test.describe('searchKnowledgeBase function', () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;

  test.beforeEach(async () => {
    process.env = {
      ...originalEnv,
      RAG_ENDPOINT_URL: 'https://test-endpoint.example.com',
    };
  });

  test.afterEach(async () => {
    process.env = originalEnv;
    global.fetch = originalFetch;
  });

  test('calls RAGClient.searchKnowledgeBase with correct parameters', async () => {
    const mockResponse: RAGResponse = {
      llm_answer: 'Test answer',
      sources: [],
    };

    let capturedBody: string;
    global.fetch = async (url: string, init?: RequestInit) => {
      capturedBody = init?.body as string;
      return {
        ok: true,
        json: async () => mockResponse,
      } as Response;
    };

    const { searchKnowledgeBase } = await import('@/lib/rag/client');
    const result = await searchKnowledgeBase('test query', 123456);

    expect(result).toEqual(mockResponse);
    expect(capturedBody).toBeDefined();
    const requestData = JSON.parse(capturedBody || '{}');
    expect(requestData.group_id).toBe(123456);
    expect(requestData.query).toBe('test query');
  });
});