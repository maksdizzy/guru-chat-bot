'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { SearchIcon } from './icons';
import type { UseChatHelpers } from '@ai-sdk/react';
import type { ChatMessage } from '@/lib/types';

interface KnowledgeBaseSearchButtonProps {
  sendMessage: UseChatHelpers<ChatMessage>['sendMessage'];
  disabled?: boolean;
}

export const KnowledgeBaseSearchButton = ({ 
  sendMessage, 
  disabled = false 
}: KnowledgeBaseSearchButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [groupId, setGroupId] = useState('2493387211');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    
    try {
      // Send a message that will trigger the knowledge base search tool
      await sendMessage({
        role: 'user',
        parts: [
          {
            type: 'text',
            text: `Please search the knowledge base for: "${query}"${groupId !== '2493387211' ? ` (group ID: ${groupId})` : ''}`,
          },
        ],
      });

      // Close dialog and reset form
      setIsOpen(false);
      setQuery('');
      setGroupId('2493387211');
    } catch (error) {
      console.error('Failed to trigger knowledge base search:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="gap-2"
          aria-label="Search Knowledge Base"
        >
          <SearchIcon size={16} />
          <span className="hidden sm:inline">Knowledge Base</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search Knowledge Base</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search-query">Search Query</Label>
            <Input
              id="search-query"
              placeholder="Enter your search query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="group-id">Group ID (optional)</Label>
            <Input
              id="group-id"
              placeholder="2493387211"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to use default group (2493387211)
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSearch}
              disabled={!query.trim() || isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Searching...
                </>
              ) : (
                <>
                  <SearchIcon size={16} />
                  Search
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
