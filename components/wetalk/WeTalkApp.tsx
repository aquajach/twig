'use client';

import { useState } from 'react';
import { ChatView } from './ChatView';
import { ContactList } from './ContactList';

export function WeTalkApp() {
  const [selectedNpcId, setSelectedNpcId] = useState<string | null>(null);

  return (
    <div className="h-full flex">
      <div className="w-80 shrink-0">
        <ContactList selectedNpcId={selectedNpcId} onSelect={setSelectedNpcId} />
      </div>
      <div className="flex-1 min-w-0">
        {selectedNpcId ? (
          <ChatView key={selectedNpcId} npcId={selectedNpcId} />
        ) : (
          <div className="h-full flex items-center justify-center text-text-disabled text-sm">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}
