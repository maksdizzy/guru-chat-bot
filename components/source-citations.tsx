'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, UserIcon, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

export interface SourceCitation {
  msg_id: number;
  reply_to_msg_id: number | null;
  user_name: string;
  msg_date: string;
  msg_text: string;
}

interface CitationBlockProps {
  source: SourceCitation;
  index: number;
  defaultExpanded?: boolean;
}

const CitationBlock = ({ source, index, defaultExpanded = false }: CitationBlockProps) => {
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  const truncatedText = source.msg_text.length > 120
    ? `${source.msg_text.slice(0, 120)}...`
    : source.msg_text;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className='space-y-2 border-muted-foreground/20 border-l-4 pl-4'>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className='h-auto w-full justify-between rounded-md p-2 hover:bg-muted/50 focus:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            aria-expanded={isOpen}
            aria-label={`${isOpen ? 'Collapse' : 'Expand'} citation from ${source.user_name}`}
          >
            <div className='flex w-full items-center justify-between text-muted-foreground text-sm'>
              <div className='flex min-w-0 flex-1 items-center gap-2'>
                <UserIcon className="size-3 shrink-0" />
                <span className='truncate font-medium text-foreground'>{source.user_name}</span>
                <Badge variant="outline" className='shrink-0 text-xs'>
                  #{source.msg_id}
                </Badge>
              </div>
              <div className='ml-2 flex shrink-0 items-center gap-2'>
                <div className='hidden items-center gap-1 sm:flex'>
                  <CalendarIcon className="size-3" />
                  <time
                    dateTime={source.msg_date}
                    className="text-xs"
                  >
                    {new Date(source.msg_date).toLocaleDateString()}
                  </time>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{
                    duration: 0.2,
                    ease: [0.04, 0.62, 0.23, 0.98]
                  }}
                  className="ml-1 motion-reduce:transition-none"
                >
                  <ChevronDownIcon className='size-4 transition-colors hover:text-foreground motion-reduce:transition-none' />
                </motion.div>
              </div>
            </div>
          </Button>
        </CollapsibleTrigger>

        <AnimatePresence initial={false}>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                duration: 0.2,
                ease: [0.04, 0.62, 0.23, 0.98]
              }}
              className='overflow-hidden px-2 text-muted-foreground text-xs italic'
            >
              {truncatedText}
            </motion.div>
          )}
        </AnimatePresence>

        <CollapsibleContent className="motion-reduce:transition-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.25,
              ease: [0.04, 0.62, 0.23, 0.98]
            }}
            className='px-2 pt-2 text-sm leading-relaxed'
          >
            <div className="whitespace-pre-wrap break-words">
              {source.msg_text}
            </div>
            {source.reply_to_msg_id && (
              <div className='mt-2 text-muted-foreground text-xs'>
                Reply to message #{source.reply_to_msg_id}
              </div>
            )}
            <div className='mt-2 text-muted-foreground text-xs sm:hidden'>
              <CalendarIcon className='mr-1 inline size-3' />
              <time dateTime={source.msg_date}>
                {new Date(source.msg_date).toLocaleDateString()}
              </time>
            </div>
          </motion.div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

interface SourceCitationsProps {
  sources: SourceCitation[];
  className?: string;
}

export const SourceCitations = ({ sources, className }: SourceCitationsProps) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <section
      className={cn("mt-4 space-y-3", className)}
      aria-label={`Source citations (${sources.length} sources)`}
    >
      <div className='flex items-center gap-2 border-muted-foreground/10 border-b pb-2 font-medium text-muted-foreground text-sm'>
        <span>Sources ({sources.length})</span>
      </div>
      <div className="space-y-3" role="list">
        {sources.map((source, index) => (
          <div key={source.msg_id} role="listitem">
            <CitationBlock
              source={source}
              index={index}
              defaultExpanded={index === 0 && sources.length === 1}
            />
          </div>
        ))}
      </div>
    </section>
  );
};