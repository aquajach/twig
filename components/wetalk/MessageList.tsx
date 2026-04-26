'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import type { ChatMessage } from '@/stores/useChatStore';

type MessageListProps = {
  messages: ChatMessage[];
  isLoading: boolean;
};

export function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

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
                <div className="text-[10px] text-text-disabled text-center py-2">
                  {formatRelativeTime(msg.timestamp)}
                </div>
              )}
              <div className={`flex ${msg.role === 'player' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'player'
                      ? 'bg-accent text-black rounded-br-sm'
                      : 'bg-surface-solid text-text-primary rounded-bl-sm'
                  }`}
                >
                  {msg.content}
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
