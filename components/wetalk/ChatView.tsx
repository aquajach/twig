'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { generateSuggestions } from '@/actions/suggestions';
import { npcById } from '@/data/npcs';
import { collectIntentCandidates, evaluate } from '@/engine/evaluate';
import { type ChatMessage, useChatStore } from '@/stores/useChatStore';
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
const INTENT_MAX_CANDIDATES = 8;

type IntentDirection = 'intent_sent' | 'intent_received';
type IntentCandidatePayload = { statementId: string; statementText: string };
type IntentMatch = { direction: IntentDirection; statementId: string; matched: boolean };

function serializeChatMessage(message: ChatMessage): { role: 'player' | 'npc'; content: string } {
  if (message.kind === 'link') {
    return {
      role: message.role,
      content: `[LINK] ${message.link.label} (from 瀏覽器 > 快速連結)`,
    };
  }
  return { role: message.role, content: message.content };
}

function normalizeIntentCandidates(
  direction: IntentDirection,
  npcId: string,
  maxCandidates = INTENT_MAX_CANDIDATES,
): IntentCandidatePayload[] {
  const seen = new Set<string>();
  const out: IntentCandidatePayload[] = [];
  for (const c of collectIntentCandidates(direction, npcId)) {
    if (seen.has(c.statementId)) continue;
    seen.add(c.statementId);
    out.push({
      statementId: c.statementId,
      statementText: c.statementText,
    });
    if (out.length >= maxCandidates) break;
  }
  return out;
}

export function ChatView({ npcId, onSelectNpc }: ChatViewProps) {
  const router = useRouter();
  const messages = useChatStore((s) => s.histories[npcId] ?? EMPTY);
  const addMessage = useChatStore((s) => s.addMessage);
  const markRead = useChatStore((s) => s.markRead);
  const setActiveNpcId = useChatStore((s) => s.setActiveNpcId);
  const cachedSuggestions = useChatStore((s) => s.suggestions[npcId]);
  const getNpcContextKeys = useGameStore((s) => s.getNpcContextKeys);
  const unlockedNpcs = useGameStore((s) => s.unlockedNpcs);
  const setCurrentBrowserPageId = useGameStore((s) => s.setCurrentBrowserPageId);

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
    generateSuggestions(history.map(serializeChatMessage)).then((result) => {
      if (requestId !== suggestionRequestId.current) return;
      useChatStore.getState().setSuggestions(forNpcId, npcTimestamp, result);
      setIsGeneratingSuggestions(false);
    });
  }, []);

  const activeApp = useWindowStore((s) => s.activeApp);
  const openApp = useWindowStore((s) => s.openApp);

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

    const playerMsg = { kind: 'text' as const, role: 'player' as const, content, timestamp: Date.now() };
    addMessage(npcId, playerMsg);
    setInput('');
    setIsLoading(true);
    setIsGeneratingSuggestions(false);
    useChatStore.getState().clearSuggestions(npcId);

    evaluate({ type: 'chat_message_sent', npcId, content });

    try {
      const contextKeys = getNpcContextKeys(npcId);
      const history = useChatStore.getState().getHistory(npcId);

      const intentCandidates = {
        sent: normalizeIntentCandidates('intent_sent', npcId),
        received: normalizeIntentCandidates('intent_received', npcId),
      };

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          npcId,
          contextKeys,
          messages: history.map(serializeChatMessage),
          intentCandidates,
        }),
      });

      if (res.status === 401) {
        setIsLoading(false);
        router.push('/login');
        return;
      }

      const data = (await res.json()) as { content?: string; intentMatches?: IntentMatch[] };
      const npcContent = data.content ?? 'Sorry, I missed that. Can you say it again?';

      const npcMsg = { kind: 'text' as const, role: 'npc' as const, content: npcContent, timestamp: Date.now() };
      addMessage(npcId, npcMsg);
      notifyWeTalkIfInBackground(npcId, npcContent);

      evaluate({ type: 'chat_message_received', npcId, content: npcContent });
      for (const match of data.intentMatches ?? []) {
        if (match.direction === 'intent_sent') {
          evaluate({
            type: 'intent_sent',
            npcId,
            statementId: match.statementId,
            matched: match.matched,
          });
          continue;
        }
        evaluate({
          type: 'intent_received',
          npcId,
          statementId: match.statementId,
          matched: match.matched,
        });
      }

      fetchAndCacheSuggestions(npcId, npcMsg.timestamp);
    } catch {
      addMessage(npcId, {
        kind: 'text',
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

  function handleOpenPage(pageId: string) {
    openApp('browser');
    setCurrentBrowserPageId(pageId);
    evaluate({ type: 'browser_page_visited', pageId });
  }

  const npc = npcById(npcId);
  if (!npc) {
    return <div className="p-4 text-text-secondary">Unknown contact.</div>;
  }

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
        onOpenPage={handleOpenPage}
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
