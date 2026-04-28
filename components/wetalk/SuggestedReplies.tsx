'use client';

import { Button } from 'react-aria-components/Button';
import { Skeleton } from '../common/Skeleton';

type SuggestedRepliesProps = {
  suggestions: string[];
  isGenerating: boolean;
  onSelect: (text: string) => void;
};

export function SuggestedReplies({ suggestions, isGenerating, onSelect }: SuggestedRepliesProps) {
  if (isGenerating) {
    return (
      <div className="flex gap-2 px-4 py-4 flex-wrap">
        <Skeleton className="h-7 w-28 border border-divider rounded-full" />
        <Skeleton className="h-7 w-36 border border-divider rounded-full" />
      </div>
    );
  }

  if (suggestions.length === 0) return null;

  return (
    <div className="flex gap-2 px-4 py-4 flex-wrap">
      {suggestions.map((text) => (
        <Button
          key={text}
          onPress={() => onSelect(text)}
          className="rounded-full border border-divider px-3 min-h-7 flex items-center justify-center text-left text-xs text-text-secondary outline-none data-[hovered]:bg-surface-hover data-[pressed]:bg-surface-active transition-colors"
        >
          {text}
        </Button>
      ))}
    </div>
  );
}
