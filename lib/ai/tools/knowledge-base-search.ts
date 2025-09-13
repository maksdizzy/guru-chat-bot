import { tool } from 'ai';
import { z } from 'zod';
import { RAGClient } from '@/lib/rag/client';
import type { Session } from 'next-auth';
import type { UIMessageStreamWriter } from 'ai';
import type { ChatMessage } from '@/lib/types';

interface KnowledgeBaseSearchProps {
  session: Session;
  dataStream: UIMessageStreamWriter<ChatMessage>;
}

export const knowledgeBaseSearch = ({ session, dataStream }: KnowledgeBaseSearchProps) =>
  tool({
    description: 'Search external Telegram knowledge base for relevant information and sources',
    inputSchema: z.object({
      query: z.string().describe('Search query to find relevant information in the knowledge base'),
      group_id: z.number().optional().describe('Telegram group ID to search (default: 2493387211)').default(2493387211),
    }),
    execute: async ({ query, group_id = 2493387211 }) => {
      try {
        // Initialize RAG client from environment
        const ragClient = RAGClient.createFromEnvironment();

        // Perform the search
        const ragResponse = await ragClient.search({
          query,
          group_id,
          max_results: 5,
        });

        // Stream the RAG response data for UI rendering
        dataStream.write({
          type: 'data-rag-response',
          data: {
            llm_answer: ragResponse.llm_answer,
            sources: ragResponse.sources,
          },
          transient: true,
        });

        // Return structured response for the AI model
        return {
          query,
          group_id,
          llm_answer: ragResponse.llm_answer,
          sources: ragResponse.sources,
          source_count: ragResponse.sources.length,
        };
      } catch (error) {
        console.error('Knowledge Base Search error:', error);
        
        // Stream error information
        dataStream.write({
          type: 'data-rag-error',
          data: {
            error: 'Failed to search knowledge base',
            message: error instanceof Error ? error.message : 'Unknown error',
          },
          transient: true,
        });

        // Return error response for the AI model
        return {
          query,
          group_id,
          error: 'Failed to search knowledge base. Please try again or rephrase your query.',
          source_count: 0,
        };
      }
    },
  });
