'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { npcs } from '@/data/npcs';
import { evaluate } from '@/engine/evaluate';
import { useChatStore } from '@/stores/useChatStore';
import { useGameStore } from '@/stores/useGameStore';
import { ChatInput } from './ChatInput';
import { MessageList } from './MessageList';
import { SuggestedReplies } from './SuggestedReplies';

type ChatViewProps = {
  npcId: string;
};

const EMPTY: never[] = [];

export function ChatView({ npcId }: ChatViewProps) {
  const router = useRouter();
  const messages = useChatStore((s) => s.histories[npcId] ?? EMPTY);
  const addMessage = useChatStore((s) => s.addMessage);
  const markRead = useChatStore((s) => s.markRead);
  const getNpcContextKeys = useGameStore((s) => s.getNpcContextKeys);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    markRead(npcId);
    evaluate({ type: 'npc_chat_opened', npcId });
  }, [npcId, markRead]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const playerMsg = { role: 'player' as const, content, timestamp: Date.now() };
      addMessage(npcId, playerMsg);
      setInput('');
      setIsLoading(true);

      evaluate({ type: 'chat_message_sent', npcId, content });

      try {
        const contextKeys = getNpcContextKeys(npcId);
        const history = useChatStore.getState().getHistory(npcId);

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            npcId,
            contextKeys,
            messages: history.map(({ role, content }) => ({ role, content })),
          }),
        });

        if (res.status === 401) {
          setIsLoading(false);
          router.push('/login');
          return;
        }

        const data = (await res.json()) as { content?: string };
        const npcContent = data.content ?? 'Sorry, I missed that. Can you say it again?';

        const npcMsg = { role: 'npc' as const, content: npcContent, timestamp: Date.now() };
        addMessage(npcId, npcMsg);

        evaluate({ type: 'chat_message_received', npcId, content: npcContent });
      } catch {
        addMessage(npcId, {
          role: 'npc',
          content: 'Something went wrong. Please try again.',
          timestamp: Date.now(),
        });
      } finally {
        setIsLoading(false);
      }
    },
    [npcId, isLoading, addMessage, getNpcContextKeys, router],
  );

  function handleSend() {
    sendMessage(input);
  }

  function handleSuggestedReply(text: string) {
    sendMessage(text);
  }

  const npc = npcs[npcId];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-divider">
        <div className="size-8 rounded-full bg-surface-solid flex items-center justify-center text-xs font-semibold text-text-secondary">
          {npc.avatar}
        </div>
        <div>
          <div className="text-sm font-medium text-text-primary">{npc.name}</div>
          <div className="text-xs text-text-secondary">{npc.title}</div>
        </div>
      </div>

      <MessageList messages={messages} isLoading={isLoading} />
      <SuggestedReplies messages={messages} isLoading={isLoading} onSelect={handleSuggestedReply} />
      <ChatInput value={input} onChange={setInput} onSend={handleSend} isDisabled={isLoading} />
    </div>
  );
}
