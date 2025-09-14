'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MessageSquareIcon, UserIcon, CalendarIcon } from 'lucide-react';

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

      {sources.length > 0 && (
        <div className="space-y-3">
          <div className='flex items-center gap-2 font-medium text-muted-foreground text-sm'>
            <span>Sources ({sources.length})</span>
          </div>

          {sources.slice(0, 5).map((source, index) => (
            <Card key={source.msg_id} className="text-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className='font-medium text-sm'>
                    <div className="flex items-center gap-2">
                      <UserIcon className="size-3" />
                      <span>{source.user_name}</span>
                    </div>
                  </CardTitle>
                  <div className='flex items-center gap-2 text-muted-foreground text-xs'>
                    <CalendarIcon className="size-3" />
                    <time dateTime={source.msg_date}>
                      {new Date(source.msg_date).toLocaleDateString()}
                    </time>
                    <Badge variant="outline" className="text-xs">
                      #{source.msg_id}
                    </Badge>
                  </div>
                </div>
                {source.reply_to_msg_id && (
                  <CardDescription className="text-xs">
                    Reply to message #{source.reply_to_msg_id}
                  </CardDescription>
                )}
              </CardHeader>
              <Separator />
              <CardContent className="pt-2">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {source.msg_text}
                </p>
              </CardContent>
            </Card>
          ))}

          {sources.length > 5 && (
            <div className="text-center">
              <Badge variant="outline" className="text-xs">
                +{sources.length - 5} more sources
              </Badge>
            </div>
          )}
        </div>
      )}
    </div>
  );
}