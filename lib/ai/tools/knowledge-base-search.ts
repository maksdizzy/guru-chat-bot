import { tool } from 'ai';
import { z } from 'zod';
import { getRAGClient } from '@/lib/rag/client';

export const knowledgeBaseSearch = tool({
  description: 'Search external Telegram knowledge base for relevant information and sources',
  inputSchema: z.object({
    query: z.string().min(1, 'Search query is required'),
    group_id: z.number().optional().default(2493387211),
  }),
  execute: async ({ query, group_id = 2493387211 }) => {
    const ragClient = getRAGClient();

    try {
      const result = await ragClient.searchKnowledgeBase(query, group_id);

      return {
        llm_answer: result.llm_answer,
        sources: result.sources.map(source => ({
          msg_id: source.msg_id,
          user_name: source.user_name,
          msg_date: source.msg_date,
          msg_text: source.msg_text,
          reply_to_msg_id: source.reply_to_msg_id,
        })),
        query: query,
        group_id: group_id,
      };
    } catch (error) {
      throw new Error(`Knowledge base search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});