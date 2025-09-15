'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDownIcon,
  UserIcon,
  CalendarIcon,
  StarIcon,
  MessageSquareIcon,
  SearchIcon,
  ChevronRightIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

export interface EnhancedSourceCitation {
  msg_id: number;
  reply_to_msg_id: number | null;
  user_name: string;
  msg_date: string;
  msg_text: string;
  relevance_score?: number;
}

interface EnhancedSourceCitationsProps {
  sources: EnhancedSourceCitation[];
  searchTerms: string[];
  className?: string;
  defaultExpanded?: boolean;
  showConfidence?: boolean;
  maxInitiallyVisible?: number;
  onSourceExplore?: (source: EnhancedSourceCitation) => void;
}

interface HighlightedTextProps {
  text: string;
  searchTerms: string[];
  className?: string;
}

const HighlightedText = ({ text, searchTerms, className }: HighlightedTextProps) => {
  const highlightedText = useMemo(() => {
    if (!searchTerms.length) return text;

    let result = text;
    const terms = searchTerms.filter(term => term.length > 1);

    // Sort terms by length (longer first) to avoid partial matches
    const sortedTerms = terms.sort((a, b) => b.length - a.length);

    sortedTerms.forEach((term, index) => {
      const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      result = result.replace(regex, `<mark class="search-highlight-${index % 3}" data-term="${term}">$1</mark>`);
    });

    return result;
  }, [text, searchTerms]);

  return (
    <span
      className={cn("search-highlighted-text", className)}
      dangerouslySetInnerHTML={{ __html: highlightedText }}
    />
  );
};

interface CitationBlockProps {
  source: EnhancedSourceCitation;
  index: number;
  searchTerms: string[];
  defaultExpanded?: boolean;
  showConfidence?: boolean;
  onExplore?: (source: EnhancedSourceCitation) => void;
}

const CitationBlock = ({
  source,
  index,
  searchTerms,
  defaultExpanded = false,
  showConfidence = false,
  onExplore
}: CitationBlockProps) => {
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  const truncatedText = useMemo(() => {
    return source.msg_text.length > 120
      ? `${source.msg_text.slice(0, 120)}...`
      : source.msg_text;
  }, [source.msg_text]);

  const relevanceColor = useMemo(() => {
    if (!showConfidence || !source.relevance_score) return '';

    if (source.relevance_score >= 0.8) return 'text-emerald-600 dark:text-emerald-400';
    if (source.relevance_score >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  }, [source.relevance_score, showConfidence]);

  const animationVariants = {
    collapsed: { height: 'auto', opacity: 1 },
    expanded: { height: 'auto', opacity: 1 }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="rag-citation-block"
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className={cn(
          'space-y-2 border-l-4 pl-4 transition-colors',
          'border-rag-source-highlight/30 hover:border-rag-source-highlight/50',
          'bg-rag-source-background/30 dark:bg-rag-source-background/10',
          'rounded-r-lg'
        )}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'h-auto w-full justify-between rounded-md p-3',
                'hover:bg-muted/50 focus:bg-muted/50',
                'focus:outline-none focus:ring-2 focus:ring-rag-source-highlight focus:ring-offset-2',
                'transition-all duration-200'
              )}
              aria-expanded={isOpen}
              aria-label={`${isOpen ? 'Collapse' : 'Expand'} citation from ${source.user_name}`}
            >
              <div className='flex w-full items-center justify-between gap-3'>
                <div className='flex min-w-0 flex-1 items-center gap-2'>
                  <UserIcon className="size-3 shrink-0 text-rag-source-highlight" />
                  <span className='source-user-name truncate text-foreground'>
                    {source.user_name}
                  </span>
                  <Badge variant="outline" className='message-id shrink-0'>
                    #{source.msg_id}
                  </Badge>

                  {showConfidence && source.relevance_score && (
                    <div className='flex shrink-0 items-center gap-1'>
                      <StarIcon className={cn("size-3", relevanceColor)} />
                      <span className={cn("source-date", relevanceColor)}>
                        {Math.round(source.relevance_score * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                <div className='ml-2 flex shrink-0 items-center gap-2'>
                  {/* Date (hidden on mobile, shown on expand) */}
                  <div className='hidden items-center gap-1 sm:flex'>
                    <CalendarIcon className="size-3 text-muted-foreground" />
                    <time
                      dateTime={source.msg_date}
                      className="source-date text-muted-foreground"
                    >
                      {new Date(source.msg_date).toLocaleDateString()}
                    </time>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="motion-reduce:transition-none"
                  >
                    <ChevronDownIcon className='size-4 transition-colors hover:text-foreground motion-reduce:transition-none' />
                  </motion.div>
                </div>
              </div>
            </Button>
          </CollapsibleTrigger>

          {/* Collapsed preview */}
          <AnimatePresence initial={false}>
            {!isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className='overflow-hidden px-3 pb-2'
              >
                <p className='source-content text-muted-foreground text-xs italic'>
                  <HighlightedText
                    text={truncatedText}
                    searchTerms={searchTerms}
                  />
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expanded content */}
          <CollapsibleContent className="motion-reduce:transition-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className='space-y-3 px-3 pb-3'
            >
              <div className="source-content whitespace-pre-wrap break-words leading-relaxed">
                <HighlightedText
                  text={source.msg_text}
                  searchTerms={searchTerms}
                />
              </div>

              {/* Metadata row */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-muted-foreground/10 border-t pt-2">
                <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-xs">
                  {/* Mobile date display */}
                  <div className='flex items-center gap-1 sm:hidden'>
                    <CalendarIcon className='size-3' />
                    <time
                      dateTime={source.msg_date}
                      className="source-date"
                    >
                      {new Date(source.msg_date).toLocaleDateString()}
                    </time>
                  </div>

                  {source.reply_to_msg_id && (
                    <div className='flex items-center gap-1'>
                      <ChevronRightIcon className='size-3' />
                      <span>Reply to #{source.reply_to_msg_id}</span>
                    </div>
                  )}
                </div>

                {onExplore && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onExplore(source);
                    }}
                  >
                    <SearchIcon className='mr-1 size-3' />
                    Explore Context
                  </Button>
                )}
              </div>
            </motion.div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </motion.div>
  );
};

export const EnhancedSourceCitations = ({
  sources,
  searchTerms,
  className,
  defaultExpanded = false,
  showConfidence = false,
  maxInitiallyVisible = 3,
  onSourceExplore
}: EnhancedSourceCitationsProps) => {
  const [showAllSources, setShowAllSources] = useState(sources.length <= maxInitiallyVisible);

  const displayedSources = showAllSources
    ? sources
    : sources.slice(0, maxInitiallyVisible);

  const hiddenCount = sources.length - maxInitiallyVisible;

  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <section
      className={cn('rag-sources-section mt-4 space-y-4', className)}
      aria-label={`Source citations (${sources.length} sources)`}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='flex items-center justify-between border-muted-foreground/10 border-b pb-3'
      >
        <div className='flex items-center gap-2'>
          <MessageSquareIcon className="size-4 text-rag-source-highlight" />
          <h3 className='font-medium text-foreground text-sm'>
            Sources
          </h3>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.3,
              delay: 0.1,
              type: "spring",
              stiffness: 200
            }}
          >
            <Badge
              variant="secondary"
              className="citation-count bg-rag-source-highlight/10 text-rag-source-highlight"
            >
              {sources.length}
            </Badge>
          </motion.div>
        </div>

        {hiddenCount > 0 && !showAllSources && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllSources(true)}
            className="citation-count text-rag-source-highlight hover:bg-rag-source-highlight/10"
          >
            +{hiddenCount} more
          </Button>
        )}
      </motion.div>

      {/* Citations list */}
      <div className="space-y-3" role="list">
        <AnimatePresence mode="popLayout">
          {displayedSources.map((source, index) => (
            <div key={source.msg_id} role="listitem">
              <CitationBlock
                source={source}
                index={index}
                searchTerms={searchTerms}
                defaultExpanded={defaultExpanded && index === 0 && sources.length === 1}
                showConfidence={showConfidence}
                onExplore={onSourceExplore}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Show less button */}
      {showAllSources && hiddenCount > 0 && (
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllSources(false)}
            className="citation-count text-muted-foreground hover:text-foreground"
          >
            Show Less
          </Button>
        </div>
      )}
    </section>
  );
};

// Export the original component name for backwards compatibility
export const SourceCitations = EnhancedSourceCitations;