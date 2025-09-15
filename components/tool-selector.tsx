'use client';

import { type ReactNode, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  CheckCircleFillIcon,
  ChevronDownIcon,
} from './icons';
import { useToolSelection } from '@/hooks/use-tool-selection';
import { DatabaseIcon, BrainIcon } from 'lucide-react';

export type ToolSelectionType = 'knowledge-base-tool' | 'no-tools';

const toolOptions: Array<{
  id: ToolSelectionType;
  label: string;
  description: string;
  icon: ReactNode;
}> = [
  {
    id: 'knowledge-base-tool',
    label: 'Knowledge base tool',
    description: 'Use knowledge base search tool',
    icon: <DatabaseIcon className="h-4 w-4" />,
  },
  {
    id: 'no-tools',
    label: 'No Tools',
    description: 'Use only internal AI knowledge',
    icon: <BrainIcon className="h-4 w-4" />,
  },
];

export function ToolSelector({
  chatId,
  className,
  selectedToolOption,
}: {
  chatId: string;
  selectedToolOption: ToolSelectionType;
} & React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);

  const { toolSelection, setToolSelection } = useToolSelection({
    chatId,
    initialToolSelection: selectedToolOption,
  });

  const selectedTool = useMemo(
    () => toolOptions.find((option) => option.id === toolSelection),
    [toolSelection],
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          'w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
          className,
        )}
      >
        <Button
          data-testid="tool-selector"
          variant="outline"
          className="hidden focus:outline-hidden focus:ring-0 md:flex md:h-fit md:px-2"
        >
          {selectedTool?.icon}
          {selectedTool?.label}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-[300px]">
        {toolOptions.map((option) => (
          <DropdownMenuItem
            data-testid={`tool-selector-item-${option.id}`}
            key={option.id}
            onSelect={() => {
              setToolSelection(option.id);
              setOpen(false);
            }}
            className="group/item flex flex-row items-center justify-between gap-4"
            data-active={option.id === toolSelection}
          >
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                {option.icon}
                {option.label}
              </div>
              {option.description && (
                <div className='ml-6 text-muted-foreground text-xs'>
                  {option.description}
                </div>
              )}
            </div>
            <div className="text-foreground opacity-0 group-data-[active=true]/item:opacity-100 dark:text-foreground">
              <CheckCircleFillIcon />
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
