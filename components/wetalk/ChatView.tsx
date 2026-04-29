'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { generateSuggestions } from '@/actions/suggestions';
import { npcs } from '@/data/npcs';
import { evaluate } from '@/engine/evaluate';
import { useChatStore } from '@/stores/useChatStore';
import { useGameStore } from '@/stores/useGameStore';
import { notifyWeTalkIfInBackground } from '@/stores/useToastStore';
import { useWindowStore } from '@/stores/useWindowStore';
import { ChatInput } from './ChatInput';
import { MessageList } from './MessageList';
import { SuggestedReplies } from './SuggestedReplies';

type ChatViewProps = {
  npcId: string;
  onSelectNpc: (npcId: string) => void;
};

const EMPTY: never[] = [];

export function ChatView({ npcId, onSelectNpc }: ChatViewProps) {
  const router = useRouter();
  const messages = useChatStore((s) => s.histories[npcId] ?? EMPTY);
  const addMessage = useChatStore((s) => s.addMessage);
  const markRead = useChatStore((s) => s.markRead);
  const setActiveNpcId = useChatStore((s) => s.setActiveNpcId);
  const cachedSuggestions = useChatStore((s) => s.suggestions[npcId]);
  const getNpcContextKeys = useGameStore((s) => s.getNpcContextKeys);
  const unlockedNpcs = useGameStore((s) => s.unlockedNpcs);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const suggestionRequestId = useRef(0);

  const lastNpcMessage = messages.findLast((m) => m.role === 'npc');
  const isCacheValid =
    cachedSuggestions != null && lastNpcMessage != null && cachedSuggestions.forTimestamp === lastNpcMessage.timestamp;
  const suggestions = isCacheValid ? cachedSuggestions.replies : [];

  const fetchAndCacheSuggestions = useCallback((forNpcId: string, npcTimestamp: number) => {
    const requestId = ++suggestionRequestId.current;
    setIsGeneratingSuggestions(true);

    const history = useChatStore.getState().getHistory(forNpcId);
    generateSuggestions(history.map(({ role, content }) => ({ role, content }))).then((result) => {
      if (requestId !== suggestionRequestId.current) return;
      useChatStore.getState().setSuggestions(forNpcId, npcTimestamp, result);
      setIsGeneratingSuggestions(false);
    });
  }, []);

  const activeApp = useWindowStore((s) => s.activeApp);

  useEffect(() => {
    setActiveNpcId(npcId);
    return () => setActiveNpcId(null);
  }, [npcId, setActiveNpcId]);

  useEffect(() => {
    if (activeApp !== 'wetalk') return;
    markRead(npcId);
    evaluate({ type: 'npc_chat_opened', npcId });

    const last = useChatStore.getState().getLastMessage(npcId);
    if (last?.role !== 'npc') return;

    const cached = useChatStore.getState().getSuggestions(npcId);
    if (cached?.forTimestamp === last.timestamp) return;

    fetchAndCacheSuggestions(npcId, last.timestamp);
  }, [npcId, activeApp, markRead, fetchAndCacheSuggestions]);

  async function sendMessage(content: string) {
    if (!content.trim() || isLoading) return;

    const playerMsg = { role: 'player' as const, content, timestamp: Date.now() };
    addMessage(npcId, playerMsg);
    setInput('');
    setIsLoading(true);
    setIsGeneratingSuggestions(false);
    useChatStore.getState().clearSuggestions(npcId);

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
      notifyWeTalkIfInBackground(npcId, npcContent);

      evaluate({ type: 'chat_message_received', npcId, content: npcContent });

      fetchAndCacheSuggestions(npcId, npcMsg.timestamp);
    } catch {
      addMessage(npcId, {
        role: 'npc',
        content: 'Something went wrong. Please try again.',
        timestamp: Date.now(),
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleSend() {
    sendMessage(input);
  }

  function handleSuggestedReply(text: string) {
    sendMessage(text);
  }

  const npc = npcs[npcId];

  return (
    <div className="flex flex-col h-full bg-background/20">
      <div className="flex items-center gap-3 px-4 h-12 border-b border-divider">
        <div className="size-8 rounded-full bg-surface-solid flex items-center justify-center text-xs font-semibold text-text-secondary">
          {npc.avatar}
        </div>
        <div className="flex flex-col">
          <div className="text-sm font-medium text-text-primary">{npc.name}</div>
          <div className="text-xs text-text-secondary">{npc.title}</div>
        </div>
      </div>

      <MessageList
        messages={messages}
        isLoading={isLoading}
        currentNpcId={npcId}
        availableContactIds={unlockedNpcs}
        onContactMention={onSelectNpc}
      />
      <SuggestedReplies
        suggestions={suggestions}
        isGenerating={isGeneratingSuggestions}
        onSelect={handleSuggestedReply}
      />
      <ChatInput value={input} onChange={setInput} onSend={handleSend} isDisabled={isLoading} />
    </div>
  );
}
