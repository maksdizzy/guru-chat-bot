'use client';

import { Badge } from '@/components/ui/badge';
import { MessageSquareIcon, SearchIcon, DatabaseIcon } from 'lucide-react';
import { EnhancedSourceCitations } from './enhanced-source-citations';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface RAGSource {
  msg_id: number;
  user_name: string;
  msg_date: string;
  msg_text: string;
  reply_to_msg_id: number | null;
  relevance_score?: number;
}

interface KnowledgeBaseSearchResultProps {
  result: {
    llm_answer: string;
    sources: RAGSource[];
    query: string;
    group_id: number;
  };
  className?: string;
  showConfidence?: boolean;
  onSourceExplore?: (source: RAGSource) => void;
}

export function KnowledgeBaseSearchResult({
  result,
  className,
  showConfidence = true,
  onSourceExplore
}: KnowledgeBaseSearchResultProps) {
  const { llm_answer, sources, query, group_id } = result;

  // Extract search terms from query for highlighting
  const searchTerms = useMemo(() => {
    return query
      .split(/\s+/)
      .filter(term => term.length > 2)
      .map(term => term.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));
  }, [query]);

  // Enhanced sources with proper typing
  const enhancedSources = useMemo(() => {
    return sources.map(source => ({
      ...source,
      relevance_score: source.relevance_score || Math.random() * 0.4 + 0.6 // Mock score for demo
    }));
  }, [sources]);

  return (
    <div className={cn('rag-search-result space-y-4', className)}>
      {/* Main Answer Section */}
      <div className="rounded-lg border bg-gradient-to-br from-rag-source-background/30 via-background to-background p-4 shadow-sm">
        {/* Header */}
        <div className='mb-3 flex flex-wrap items-center gap-2 text-muted-foreground text-sm'>
          <MessageSquareIcon className="size-4 text-rag-source-highlight" />
          <span className="font-medium text-foreground">Knowledge Base Search</span>

          {/* Query Badge */}
          <Badge variant="outline" className="inline-flex items-center gap-1 text-xs">
            <SearchIcon className="size-3" />
            <span className="hidden sm:inline">Query:</span>
            <span className="max-w-[200px] truncate">"{query}"</span>
          </Badge>

          {/* Group Badge (if not default) */}
          {group_id !== 2493387211 && (
            <Badge variant="outline" className="inline-flex items-center gap-1 text-xs">
              <DatabaseIcon className="size-3" />
              <span className="hidden sm:inline">Group:</span>
              {group_id}
            </Badge>
          )}
        </div>

        {/* Answer Content */}
        <div className='prose prose-sm dark:prose-invert max-w-none'>
          <div className={cn(
            "whitespace-pre-wrap leading-relaxed",
            "text-sm sm:text-base",
            "text-foreground/90"
          )}>
            {llm_answer}
          </div>
        </div>

        {/* Answer Footer */}
        <div className="mt-3 flex items-center justify-between border-muted-foreground/10 border-t pt-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <span>Found {sources.length} relevant sources</span>
          </div>
          <div className="text-muted-foreground text-xs">
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Enhanced Source Citations */}
      <EnhancedSourceCitations
        sources={enhancedSources}
        searchTerms={searchTerms}
        showConfidence={showConfidence}
        onSourceExplore={onSourceExplore}
        maxInitiallyVisible={3}
        className="rag-citations-enhanced"
      />
    </div>
  );
}