'use client';

import { motion } from 'framer-motion';
import {
  SearchIcon,
  DatabaseIcon,
  MessageSquareIcon,
  RefreshCwIcon,
  AlertCircleIcon,
  WifiOffIcon,
  XCircleIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Loading skeleton for search results
export function RAGSearchSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rag-search-skeleton space-y-4', className)}>
      {/* Main answer skeleton */}
      <div className="rounded-lg border bg-gradient-to-br from-rag-source-background/30 via-background to-background p-4">
        <div className="mb-3 flex items-center gap-2">
          <MessageSquareIcon className="size-4 text-rag-source-highlight" />
          <div className='h-4 w-32 animate-pulse rounded bg-muted' />
          <div className='h-5 w-24 animate-pulse rounded-full bg-muted' />
        </div>

        {/* Answer content skeleton */}
        <div className="space-y-2">
          <div className='h-4 w-full animate-pulse rounded bg-muted' />
          <div className='h-4 w-5/6 animate-pulse rounded bg-muted' />
          <div className='h-4 w-4/5 animate-pulse rounded bg-muted' />
          <div className='h-4 w-3/4 animate-pulse rounded bg-muted' />
        </div>

        <div className="mt-3 flex items-center justify-between border-muted-foreground/10 border-t pt-3">
          <div className='h-3 w-24 animate-pulse rounded bg-muted' />
          <div className='h-3 w-20 animate-pulse rounded bg-muted' />
        </div>
      </div>

      {/* Sources skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className='h-4 w-16 animate-pulse rounded bg-muted' />
          <div className='h-5 w-6 animate-pulse rounded-full bg-muted' />
        </div>

        {Array.from({ length: 3 }, (_, i) => i).map((skeltonIndex) => (
          <div
            key={skeltonIndex}
            className='rounded-lg border-rag-source-highlight/30 border-l-4 bg-rag-source-background/30 p-3 pl-4'
          >
            <div className='mb-2 flex items-center justify-between'>
              <div className="flex items-center gap-2">
                <div className='h-3 w-3 animate-pulse rounded-full bg-muted' />
                <div className='h-4 w-20 animate-pulse rounded bg-muted' />
                <div className='h-4 w-16 animate-pulse rounded-full bg-muted' />
              </div>
              <div className='h-3 w-3 animate-pulse rounded bg-muted' />
            </div>
            <div className="space-y-1">
              <div className='h-3 w-full animate-pulse rounded bg-muted' />
              <div className='h-3 w-3/4 animate-pulse rounded bg-muted' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Progressive loading states for streaming
interface RAGStreamingLoadingProps {
  stage: 'validating' | 'searching' | 'processing' | 'formatting';
  query: string;
  className?: string;
}

export function RAGStreamingLoading({
  stage,
  query,
  className
}: RAGStreamingLoadingProps) {
  const stages = [
    {
      key: 'validating',
      label: 'Validating query parameters...',
      icon: <SearchIcon className="size-4" />,
      description: 'Checking search query format and parameters'
    },
    {
      key: 'searching',
      label: 'Searching knowledge base...',
      icon: <DatabaseIcon className="size-4" />,
      description: 'Retrieving relevant sources from Telegram history'
    },
    {
      key: 'processing',
      label: 'Processing sources...',
      icon: <MessageSquareIcon className="size-4" />,
      description: 'Analyzing and ranking source relevance'
    },
    {
      key: 'formatting',
      label: 'Formatting response...',
      icon: <RefreshCwIcon className="size-4" />,
      description: 'Preparing final answer with citations'
    }
  ];

  const currentStageIndex = stages.findIndex(s => s.key === stage);
  const currentStage = stages[currentStageIndex];

  return (
    <div className={cn('rag-streaming-loading space-y-4', className)}>
      <div className="rounded-lg border bg-gradient-to-br from-rag-source-background/30 via-background to-background p-4">
        {/* Query display */}
        <div className="mb-4 flex items-center gap-2 text-muted-foreground text-sm">
          <SearchIcon className="size-4 text-rag-source-highlight" />
          <span>Knowledge Base Search</span>
          <Badge variant="outline" className="text-xs">
            "{query}"
          </Badge>
        </div>

        {/* Current stage */}
        <div className='mb-4 flex items-center gap-3'>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="text-rag-source-highlight"
          >
            {currentStage.icon}
          </motion.div>
          <div>
            <p className="font-medium text-sm">{currentStage.label}</p>
            <p className="text-muted-foreground text-xs">
              {currentStage.description}
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="space-y-2">
          <div className='flex justify-between text-muted-foreground text-xs'>
            <span>Step {currentStageIndex + 1} of {stages.length}</span>
            <span>{Math.round(((currentStageIndex + 1) / stages.length) * 100)}%</span>
          </div>
          <div className='h-1 w-full overflow-hidden rounded-full bg-muted'>
            <motion.div
              className="h-full bg-rag-source-highlight"
              initial={{ width: "0%" }}
              animate={{
                width: `${((currentStageIndex + 1) / stages.length) * 100}%`
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Stage list */}
        <div className="mt-4 space-y-2">
          {stages.map((stageItem, index) => (
            <div
              key={stageItem.key}
              className={cn(
                "flex items-center gap-2 text-xs transition-colors",
                index <= currentStageIndex
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "size-2 rounded-full transition-colors",
                  index < currentStageIndex
                    ? "bg-rag-success"
                    : index === currentStageIndex
                    ? 'animate-pulse bg-rag-source-highlight'
                    : "bg-muted-foreground/30"
                )}
              />
              <span>{stageItem.label.replace('...', '')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Error states
interface RAGErrorStateProps {
  errorType: 'timeout' | 'network' | 'no-results' | 'invalid-params' | 'server-error';
  errorMessage?: string;
  query?: string;
  onRetry?: () => void;
  onEditQuery?: () => void;
  className?: string;
}

export function RAGErrorState({
  errorType,
  errorMessage,
  query,
  onRetry,
  onEditQuery,
  className
}: RAGErrorStateProps) {
  const errorConfig = {
    timeout: {
      title: 'Search Timeout',
      description: 'The knowledge base search took too long to complete.',
      icon: <RefreshCwIcon className="size-5 text-rag-warning" />,
      suggestions: [
        'Try searching for more specific terms',
        'Check your internet connection',
        'Retry the search'
      ]
    },
    network: {
      title: 'Network Error',
      description: 'Unable to connect to the knowledge base service.',
      icon: <WifiOffIcon className="size-5 text-rag-error" />,
      suggestions: [
        'Check your internet connection',
        'Try again in a few moments',
        'Contact support if the issue persists'
      ]
    },
    'no-results': {
      title: 'No Results Found',
      description: 'Your search didn\'t return any relevant information.',
      icon: <SearchIcon className="size-5 text-muted-foreground" />,
      suggestions: [
        'Try different search terms',
        'Use broader or more general keywords',
        'Check for typos in your query'
      ]
    },
    'invalid-params': {
      title: 'Invalid Search Parameters',
      description: 'The search parameters provided are not valid.',
      icon: <AlertCircleIcon className="size-5 text-rag-warning" />,
      suggestions: [
        'Check that your query is not empty',
        'Ensure the group ID is correct',
        'Try a simpler search query'
      ]
    },
    'server-error': {
      title: 'Server Error',
      description: 'An error occurred while processing your search.',
      icon: <XCircleIcon className="size-5 text-rag-error" />,
      suggestions: [
        'Try again in a few moments',
        'Contact support if the issue continues',
        'Check the system status page'
      ]
    }
  };

  const config = errorConfig[errorType];

  return (
    <div className={cn('rag-error-state space-y-4', className)}>
      <Card
        className="border-l-4 border-l-current p-4"
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-start gap-3">
          {config.icon}
          <div className="flex-1 space-y-3">
            <div>
              <h3 className='mb-1 font-medium text-sm'>{config.title}</h3>
              <p className='text-muted-foreground text-sm'>
                {errorMessage || config.description}
              </p>
              {query && (
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    Query: "{query}"
                  </Badge>
                </div>
              )}
            </div>

            {/* Suggestions */}
            <div>
              <p className='mb-2 font-medium text-xs'>Suggestions:</p>
              <ul className="space-y-1">
                {config.suggestions.map((suggestion) => (
                  <li key={suggestion} className='flex items-start gap-1 text-muted-foreground text-xs'>
                    <span className='mt-0.5 text-rag-source-highlight'>•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              {onRetry && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRetry}
                  className="h-7 text-xs"
                >
                  <RefreshCwIcon className='mr-1 size-3' />
                  Retry Search
                </Button>
              )}
              {onEditQuery && errorType === 'no-results' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onEditQuery}
                  className="h-7 text-xs"
                >
                  <SearchIcon className='mr-1 size-3' />
                  Edit Query
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}