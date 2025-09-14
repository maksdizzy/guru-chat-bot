import { test, expect } from '@playwright/test';
import { knowledgeBaseSearch } from '@/lib/ai/tools/knowledge-base-search';

// Mock the RAG client
const mockRAGClient = {
  searchKnowledge: async (params: { query: string; group_id: number }) => ({
    llm_answer: `Mock answer for query: ${params.query}`,
    sources: [
      {
        msg_id: 123,
        reply_to_msg_id: null,
        user_name: 'test_user',
        msg_date: '2023-01-01',
        msg_text: 'Test message content',
      }
    ],
  }),
};

// Mock the getRAGClient function
async function mockGetRAGClient() {
  const { getRAGClient } = await import('@/lib/rag/client');
  return jest.fn().mockReturnValue(mockRAGClient);
}

test.describe('Knowledge Base Search Tool Unit Tests', () => {
  test.beforeEach(async () => {
    // Mock the RAG client module
    jest.doMock('@/lib/rag/client', () => ({
      getRAGClient: () => mockRAGClient,
    }));
  });

  test.afterEach(() => {
    jest.resetAllMocks();
  });

  test('tool has correct description and schema', () => {
    expect(knowledgeBaseSearch.description).toBe(
      'Search external Telegram knowledge base for relevant information and sources'
    );

    // Verify the input schema structure
    expect(knowledgeBaseSearch.inputSchema).toBeTruthy();
  });

  test('successfully executes search with required parameters', async () => {
    const testQuery = 'test search query';

    const result = await knowledgeBaseSearch.execute({
      query: testQuery,
    });

    expect(result).toEqual({
      llm_answer: `Mock answer for query: ${testQuery}`,
      sources: [
        {
          msg_id: 123,
          user_name: 'test_user',
          msg_date: '2023-01-01',
          msg_text: 'Test message content',
          reply_to_msg_id: null,
        }
      ],
      query: testQuery,
      group_id: 2493387211, // default value
    });
  });

  test('successfully executes search with custom group_id', async () => {
    const testQuery = 'custom group test';
    const customGroupId = 987654321;

    const result = await knowledgeBaseSearch.execute({
      query: testQuery,
      group_id: customGroupId,
    });

    expect(result.query).toBe(testQuery);
    expect(result.group_id).toBe(customGroupId);
    expect(result.llm_answer).toBe(`Mock answer for query: ${testQuery}`);
    expect(result.sources).toHaveLength(1);
  });

  test('handles RAG client errors gracefully', async () => {
    const errorRAGClient = {
      searchKnowledge: async () => {
        throw new Error('Network error');
      },
    };

    jest.doMock('@/lib/rag/client', () => ({
      getRAGClient: () => errorRAGClient,
    }));

    // Re-import to get the mocked version
    const { knowledgeBaseSearch: toolWithError } = await import('@/lib/ai/tools/knowledge-base-search');

    await expect(
      toolWithError.execute({ query: 'test query' })
    ).rejects.toThrow('Knowledge base search failed: Network error');
  });

  test('validates input schema correctly', () => {
    const schema = knowledgeBaseSearch.inputSchema;

    // Test that schema accepts valid input
    const validInput = { query: 'test query', group_id: 123 };
    const validResult = schema.safeParse(validInput);
    expect(validResult.success).toBe(true);

    // Test that schema rejects empty query
    const invalidInput = { query: '', group_id: 123 };
    const invalidResult = schema.safeParse(invalidInput);
    expect(invalidResult.success).toBe(false);

    // Test that schema accepts query without group_id (uses default)
    const queryOnlyInput = { query: 'test query' };
    const queryOnlyResult = schema.safeParse(queryOnlyInput);
    expect(queryOnlyResult.success).toBe(true);
    if (queryOnlyResult.success) {
      expect(queryOnlyResult.data.group_id).toBe(2493387211);
    }
  });

  test('properly formats source data in output', async () => {
    const complexMockClient = {
      searchKnowledge: async () => ({
        llm_answer: 'Complex answer',
        sources: [
          {
            msg_id: 456,
            reply_to_msg_id: 123,
            user_name: 'complex_user',
            msg_date: '2023-06-15',
            msg_text: 'Complex message with special characters: @#$%',
          },
          {
            msg_id: 789,
            reply_to_msg_id: null,
            user_name: 'another_user',
            msg_date: '2023-06-16',
            msg_text: 'Another message',
          }
        ],
      }),
    };

    jest.doMock('@/lib/rag/client', () => ({
      getRAGClient: () => complexMockClient,
    }));

    const { knowledgeBaseSearch: complexTool } = await import('@/lib/ai/tools/knowledge-base-search');

    const result = await complexTool.execute({ query: 'complex test' });

    expect(result.sources).toHaveLength(2);
    expect(result.sources[0]).toEqual({
      msg_id: 456,
      user_name: 'complex_user',
      msg_date: '2023-06-15',
      msg_text: 'Complex message with special characters: @#$%',
      reply_to_msg_id: 123,
    });
    expect(result.sources[1].reply_to_msg_id).toBe(null);
  });
});