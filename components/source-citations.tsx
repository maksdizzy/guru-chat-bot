'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronRightIcon } from './icons';
import { cn } from '@/lib/utils';
import type { RAGSource } from '@/lib/rag/types';

interface SourceCitationsProps {
  sources: RAGSource[];
  className?: string;
}

interface CitationBlockProps {
  source: RAGSource;
  index: number;
  defaultExpanded?: boolean;
}

const CitationBlock = ({ source, index, defaultExpanded = false }: CitationBlockProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const truncateText = (text: string, maxLength: 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="border-l-4 border-muted-foreground/20 pl-4 mb-3 last:mb-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left hover:bg-muted/50 rounded-md p-2 -ml-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-expanded={isExpanded}
        aria-label={`Toggle source citation ${index + 1}`}
      >
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {isExpanded ? (
                <ChevronDownIcon size={16} />
              ) : (
                <ChevronRightIcon size={16} />
              )}
              <span className="font-medium text-foreground">{source.user_name}</span>
            </div>
            <span className="text-xs">{formatDate(source.msg_date)}</span>
          </div>
          <span className="text-xs italic">
            {isExpanded ? 'Click to collapse' : 'Click to expand'}
          </span>
        </div>
        
        {!isExpanded && (
          <div className="mt-1 text-sm text-muted-foreground italic">
            {truncateText(source.msg_text, 100)}
          </div>
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-2 pb-1 px-2 -ml-2">
              <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {source.msg_text}
              </div>
              <div className="mt-2 pt-2 border-t border-muted-foreground/10">
                <div className="text-xs text-muted-foreground">
                  Message ID: {source.msg_id}
                  {source.reply_to_msg_id && (
                    <span className="ml-2">Reply to: {source.reply_to_msg_id}</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SourceCitations = ({ sources, className }: SourceCitationsProps) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className={cn('mt-4 space-y-1', className)}>
      <div className="text-sm font-medium text-muted-foreground mb-2">
        Sources ({sources.length})
      </div>
      <div className="space-y-0">
        {sources.map((source, index) => (
          <CitationBlock
            key={`${source.msg_id}-${index}`}
            source={source}
            index={index}
            defaultExpanded={index === 0 && sources.length === 1}
          />
        ))}
      </div>
    </div>
  );
};
