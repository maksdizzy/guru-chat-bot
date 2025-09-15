'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  HelpCircleIcon,
  ChevronDownIcon,
  SearchIcon,
  SettingsIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RAGToolParams {
  query: string;
  group_id?: number;
}

interface RAGToolFormProps {
  variant: 'simple' | 'advanced';
  onVariantChange: (variant: 'simple' | 'advanced') => void;
  initialValues?: RAGToolParams;
  onSubmit: (params: RAGToolParams) => void;
  disabled?: boolean;
  className?: string;
}

export function RAGToolForm({
  variant,
  onVariantChange,
  initialValues = { query: '', group_id: 2493387211 },
  onSubmit,
  disabled = false,
  className
}: RAGToolFormProps) {
  const [query, setQuery] = useState(initialValues.query);
  const [groupId, setGroupId] = useState(initialValues.group_id || 2493387211);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(variant === 'advanced');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit({
        query: query.trim(),
        group_id: groupId
      });
    }
  }, [query, groupId, onSubmit]);

  const toggleVariant = useCallback(() => {
    const newVariant = variant === 'simple' ? 'advanced' : 'simple';
    onVariantChange(newVariant);
    setIsAdvancedOpen(newVariant === 'advanced');
  }, [variant, onVariantChange]);

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("space-y-4", className)}
      role="search"
      aria-label="Knowledge Base Search Form"
    >
      {/* Simple Form Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <SearchIcon className="size-4 text-muted-foreground" />
          <Label
            htmlFor="rag-query"
            className="font-medium text-sm"
          >
            Search Knowledge Base
          </Label>
          {variant === 'simple' && groupId !== 2493387211 && (
            <Badge variant="outline" className="text-xs">
              Custom Group: {groupId}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <Input
            id="rag-query"
            type="text"
            placeholder="Ask about trading strategies, DeFi protocols, market analysis..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={disabled}
            className="text-sm"
            aria-describedby="rag-query-help"
            required
            minLength={1}
          />

          <p
            id="rag-query-help"
            className="text-muted-foreground text-xs"
          >
            Search historical conversations for relevant information and insights
          </p>
        </div>
      </div>

      {/* Advanced Parameters Section */}
      <Collapsible
        open={isAdvancedOpen}
        onOpenChange={setIsAdvancedOpen}
      >
        <CollapsibleTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="flex h-8 w-full items-center justify-between p-2 hover:bg-muted/50"
            onClick={toggleVariant}
            aria-expanded={isAdvancedOpen}
            aria-controls="advanced-parameters"
          >
            <div className="flex items-center gap-2">
              <SettingsIcon className="size-3" />
              <span className="text-xs">
                {variant === 'simple' ? 'Show Advanced Options' : 'Advanced Parameters'}
              </span>
            </div>
            <motion.div
              animate={{ rotate: isAdvancedOpen ? 180 : 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <ChevronDownIcon className="size-3" />
            </motion.div>
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent
          id="advanced-parameters"
          className="pt-3"
        >
          <AnimatePresence>
            {isAdvancedOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="space-y-3 overflow-hidden"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="rag-group-id"
                      className='font-medium text-xs'
                    >
                      Telegram Group ID
                    </Label>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground"
                      aria-label="Group ID help"
                      title="Specify which Telegram group to search. Default is the primary group."
                    >
                      <HelpCircleIcon className="size-3" />
                    </button>
                  </div>

                  <Input
                    id="rag-group-id"
                    type="number"
                    placeholder="2493387211"
                    value={groupId || ''}
                    onChange={(e) => setGroupId(Number.parseInt(e.target.value) || 2493387211)}
                    disabled={disabled}
                    className="text-xs"
                    aria-describedby="group-id-help"
                  />

                  <p
                    id="group-id-help"
                    className="text-muted-foreground text-xs"
                  >
                    {groupId === 2493387211
                      ? 'Using default primary group'
                      : 'Custom group specified'
                    }
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          size="sm"
          disabled={disabled || !query.trim()}
          className="flex items-center gap-2 text-sm"
        >
          <SearchIcon className="size-3" />
          Search Knowledge Base
        </Button>
      </div>
    </form>
  );
}

// Hook for managing RAG tool form state
export function useRAGToolForm(initialParams?: RAGToolParams) {
  const [variant, setVariant] = useState<'simple' | 'advanced'>('simple');
  const [params, setParams] = useState<RAGToolParams>(
    initialParams || { query: '', group_id: 2493387211 }
  );

  const handleSubmit = useCallback((newParams: RAGToolParams) => {
    setParams(newParams);
  }, []);

  return {
    variant,
    setVariant,
    params,
    handleSubmit,
  };
}