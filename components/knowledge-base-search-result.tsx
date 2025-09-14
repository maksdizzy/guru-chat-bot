'use client';

import { Badge } from '@/components/ui/badge';
import { MessageSquareIcon } from 'lucide-react';
import { SourceCitations } from './source-citations';

interface RAGSource {
  msg_id: number;
  user_name: string;
  msg_date: string;
  msg_text: string;
  reply_to_msg_id: number | null;
}

interface KnowledgeBaseSearchResultProps {
  result: {
    llm_answer: string;
    sources: RAGSource[];
    query: string;
    group_id: number;
  };
}

export function KnowledgeBaseSearchResult({ result }: KnowledgeBaseSearchResultProps) {
  const { llm_answer, sources, query, group_id } = result;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/50 p-4">
        <div className='mb-2 flex items-center gap-2 text-muted-foreground text-sm'>
          <MessageSquareIcon className="size-4" />
          <span>Knowledge Base Search</span>
          <Badge variant="outline" className="text-xs">
            Query: "{query}"
          </Badge>
          {group_id !== 2493387211 && (
            <Badge variant="outline" className="text-xs">
              Group: {group_id}
            </Badge>
          )}
        </div>
        <div className='prose prose-sm dark:prose-invert max-w-none'>
          <div className="whitespace-pre-wrap text-sm">{llm_answer}</div>
        </div>
      </div>

      <SourceCitations sources={sources} />
    </div>
  );
}