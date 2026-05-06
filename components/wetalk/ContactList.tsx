'use client';

import { Button } from 'react-aria-components/Button';
import { AppIcon, getAppLabel } from '@/components/appsConfig';
import { npcById } from '@/data/npcs';
import { useChatStore } from '@/stores/useChatStore';
import { useGameStore } from '@/stores/useGameStore';

type ContactListProps = {
  selectedNpcId: string | null;
  onSelect: (npcId: string) => void;
};

export function ContactList({ selectedNpcId, onSelect }: ContactListProps) {
  const unlockedNpcs = useGameStore((s) => s.unlockedNpcs);
  const histories = useChatStore((s) => s.histories);
  const lastReadTimestamp = useChatStore((s) => s.lastReadTimestamp);

  const sorted = [...unlockedNpcs].sort((a, b) => {
    const unreadA = getUnreadCount(a, histories, lastReadTimestamp);
    const unreadB = getUnreadCount(b, histories, lastReadTimestamp);
    if (unreadA > 0 && unreadB === 0) return -1;
    if (unreadB > 0 && unreadA === 0) return 1;

    const lastA = histories[a]?.at(-1)?.timestamp ?? 0;
    const lastB = histories[b]?.at(-1)?.timestamp ?? 0;
    return lastB - lastA;
  });

  return (
    <div className="flex flex-col h-full border-r border-divider">
      <div className="px-4 h-12 border-b border-divider flex flex-row items-center gap-2">
        <AppIcon id="wetalk" className="h-4 w-4" />
        <h2 className="text-sm font-semibold text-text-primary">{getAppLabel('wetalk')}</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {sorted.map((npcId) => {
          const npc = npcById(npcId);
          if (!npc) return null;
          const isSelected = selectedNpcId === npcId;
          const history = histories[npcId] ?? [];
          const lastMsg = history.at(-1);
          const unread = getUnreadCount(npcId, histories, lastReadTimestamp);

          return (
            <Button
              key={npcId}
              onPress={() => onSelect(npcId)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left outline-none transition-colors ${
                isSelected ? 'bg-surface-hover' : 'data-[hovered]:bg-surface-active'
              }`}
            >
              <div className="shrink-0 size-10 rounded-full bg-surface-solid flex items-center justify-center text-xs font-semibold text-text-secondary">
                {npc.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-primary truncate">{npc.name}</span>
                  {unread > 0 && (
                    <span className="shrink-0 ml-2 size-5 rounded-full bg-accent text-[10px] font-bold text-black flex items-center justify-center">
                      {unread}
                    </span>
                  )}
                </div>
                <span className="text-xs text-text-secondary truncate block">{npc.title}</span>
                {lastMsg && (
                  <span className="text-xs text-text-disabled truncate block mt-0.5">
                    {lastMsg.role === 'player' ? 'You: ' : ''}
                    {lastMsg.content}
                  </span>
                )}
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function getUnreadCount(
  npcId: string,
  histories: Record<string, { role: string; timestamp: number }[]>,
  lastReadTimestamp: Record<string, number>,
): number {
  const history = histories[npcId] ?? [];
  const lastRead = lastReadTimestamp[npcId] ?? 0;
  return history.filter((m) => m.role === 'npc' && m.timestamp > lastRead).length;
}
