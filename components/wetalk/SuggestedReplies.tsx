'use client';

import { Button } from 'react-aria-components/Button';
import type { ChatMessage } from '@/stores/useChatStore';

type SuggestedRepliesProps = {
  messages: ChatMessage[];
  isLoading: boolean;
  onSelect: (text: string) => void;
};

export function SuggestedReplies({ messages, isLoading, onSelect }: SuggestedRepliesProps) {
  if (isLoading || messages.length === 0) return null;

  const lastMsg = messages.at(-1);
  if (!lastMsg || lastMsg.role === 'player') return null;

  // Placeholder suggestions — Layer 5 will replace with AI-generated ones
  const suggestions = ['Got it, thanks!', 'Can you tell me more?'];

  return (
    <div className="flex gap-2 px-4 pb-1">
      {suggestions.map((text) => (
        <Button
          key={text}
          onPress={() => onSelect(text)}
          className="rounded-full border border-divider px-3 py-1.5 text-xs text-text-secondary outline-none data-[hovered]:bg-surface-hover data-[pressed]:bg-surface-active transition-colors"
        >
          {text}
        </Button>
      ))}
    </div>
  );
}
