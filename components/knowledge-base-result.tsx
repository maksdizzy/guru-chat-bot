'use client';

import { Response } from './elements/response';
import { SourceCitations } from './source-citations';
import { cn, sanitizeText } from '@/lib/utils';
import type { RAGResponse } from '@/lib/rag/types';

interface KnowledgeBaseResultProps {
  result: RAGResponse;
  className?: string;
}

export const KnowledgeBaseResult = ({ result, className }: KnowledgeBaseResultProps) => {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Main LLM Answer */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="text-sm font-medium text-muted-foreground mb-2">
          Knowledge Base Answer
        </div>
        <div className="text-sm leading-relaxed">
          <Response>{sanitizeText(result.llm_answer)}</Response>
        </div>
      </div>

      {/* Source Citations */}
      <SourceCitations sources={result.sources} />
    </div>
  );
};

interface KnowledgeBaseErrorProps {
  error: string;
  message?: string;
  className?: string;
}

export const KnowledgeBaseError = ({ error, message, className }: KnowledgeBaseErrorProps) => {
  return (
    <div className={cn('rounded-lg border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400', className)}>
      <div className="text-sm font-medium mb-1">
        Knowledge Base Search Error
      </div>
      <div className="text-sm">
        {error}
        {message && message !== error && (
          <div className="mt-1 text-xs opacity-75">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};
