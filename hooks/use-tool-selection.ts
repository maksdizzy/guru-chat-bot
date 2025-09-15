'use client';

import useSWR from 'swr';
import type { ToolSelectionType } from '@/components/tool-selector';

export function useToolSelection({
  chatId,
  initialToolSelection,
}: {
  chatId: string;
  initialToolSelection: ToolSelectionType;
}) {
  const { data: toolSelection, mutate: setToolSelection } = useSWR(
    `${chatId}-tool-selection`,
    null,
    {
      fallbackData: initialToolSelection,
    },
  );

  return {
    toolSelection: toolSelection as ToolSelectionType,
    setToolSelection: (selection: ToolSelectionType) => setToolSelection(selection)
  };
}
