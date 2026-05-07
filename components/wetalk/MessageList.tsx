'use client';

import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { Button } from 'react-aria-components/Button';
import { LuExternalLink, LuGlobe } from 'react-icons/lu';
import { npcById } from '@/data/npcs';
import type { ChatMessage } from '@/stores/useChatStore';

type MessageListProps = {
  messages: ChatMessage[];
  isLoading: boolean;
  currentNpcId: string;
  availableContactIds: string[];
  onContactMention: (npcId: string) => void;
  onOpenPage: (pageId: string) => void;
};

type MentionIndex = {
  pattern: RegExp;
  contactByLabel: Map<string, string>;
};

export function MessageList({
  messages,
  isLoading,
  currentNpcId,
  availableContactIds,
  onContactMention,
  onOpenPage,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const mentionIndex = useMemo(
    () => buildMentionIndex(availableContactIds, currentNpcId),
    [availableContactIds, currentNpcId],
  );

  useEffect(() => {
    if (messages.length > 0 || isLoading) {
      bottomRef.current?.scrollIntoView();
    }
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3">
      <div className="flex flex-col gap-1.5">
        {messages.map((msg, i) => {
          const showTimestamp = shouldShowTimestamp(messages, i);
          return (
            <div key={msg.timestamp}>
              {showTimestamp && (
                <div className="text-xs text-text-disabled text-center py-2">{formatRelativeTime(msg.timestamp)}</div>
              )}
              <div className={`flex ${msg.role === 'player' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'player'
                      ? 'bg-accent text-black rounded-br-sm'
                      : 'bg-surface-solid text-text-primary rounded-bl-sm'
                  }`}
                >
                  {renderMessage(msg, mentionIndex, onContactMention, onOpenPage)}
                </div>
              </div>
            </div>
          );
        })}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="bg-surface-solid rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="size-1.5 rounded-full bg-text-secondary"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div ref={bottomRef} />
    </div>
  );
}

function renderMessage(
  msg: ChatMessage,
  mentionIndex: MentionIndex | null,
  onContactMention: (npcId: string) => void,
  onOpenPage: (pageId: string) => void,
) {
  if (msg.kind === 'link') {
    return (
      <Button
        onPress={() => onOpenPage(msg.link.pageId)}
        className="inline-flex items-center gap-1 rounded-sm border-0 bg-transparent p-0 font-semibold text-accent outline-none data-[hovered]:opacity-80 data-[focus-visible]:ring-1 data-[focus-visible]:ring-accent"
      >
        <LuGlobe aria-hidden />
        <span>{msg.link.label}</span>
      </Button>
    );
  }
  if (msg.role === 'npc') {
    return renderMessageContent(msg.content, mentionIndex, onContactMention);
  }
  return msg.content;
}

function buildMentionIndex(availableContactIds: string[], currentNpcId: string): MentionIndex | null {
  const contactByLabel = new Map<string, string>();

  for (const npcId of availableContactIds) {
    const npc = npcById(npcId);
    if (!npc || npcId === currentNpcId) continue;

    for (const label of [npc.name, ...npc.name.split(/\s+/).filter(Boolean)]) {
      const key = label.toLowerCase();
      if (!contactByLabel.has(key)) {
        contactByLabel.set(key, npcId);
      }
    }
  }

  if (contactByLabel.size === 0) return null;

  const labels = [...contactByLabel.keys()].sort((a, b) => b.length - a.length);
  return {
    pattern: new RegExp(`\\b(${labels.map(escapeRegExp).join('|')})\\b`, 'gi'),
    contactByLabel,
  };
}

function renderMessageContent(
  content: string,
  mentionIndex: MentionIndex | null,
  onContactMention: (npcId: string) => void,
) {
  if (!mentionIndex) return content;

  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(mentionIndex.pattern)) {
    const start = match.index;
    const label = match[0];
    const npcId = mentionIndex.contactByLabel.get(label.toLowerCase());
    if (!npcId) continue;

    nodes.push(content.slice(lastIndex, start));
    nodes.push(
      <Button
        key={`mention-${start}-${npcId}`}
        onPress={() => onContactMention(npcId)}
        className="inline rounded-sm border-0 bg-transparent p-0 font-bold text-accent outline-none data-[hovered]:opacity-80 data-[focus-visible]:ring-1 data-[focus-visible]:ring-accent"
      >
        {label}
      </Button>,
    );
    lastIndex = start + label.length;
  }

  nodes.push(content.slice(lastIndex));
  return nodes;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function shouldShowTimestamp(messages: ChatMessage[], index: number): boolean {
  if (index === 0) return true;
  const gap = messages[index].timestamp - messages[index - 1].timestamp;
  return gap > 5 * 60 * 1000;
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
