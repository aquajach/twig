'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button } from 'react-aria-components/Button';
import { Form } from 'react-aria-components/Form';
import { Input } from 'react-aria-components/Input';
import { TextField } from 'react-aria-components/TextField';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export function Chat() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!pending) inputRef.current?.focus();
  }, [pending]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || pending) return;

    const next: Message[] = [...messages, { id: crypto.randomUUID(), role: 'user', content: input }];
    setMessages(next);
    setInput('');
    setPending(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: next.map(({ role, content }) => ({ role, content })),
      }),
    });

    if (res.status === 401) {
      setPending(false);
      router.push('/login');
      return;
    }

    if (!res.ok) {
      setPending(false);
      setMessages([
        ...next,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Something went wrong. Please try again.',
        },
      ]);
      return;
    }

    const data = (await res.json()) as { content?: string };
    setMessages([
      ...next,
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.content ?? '',
      },
    ]);
    setPending(false);
  }

  return (
    <main className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="space-y-2">
        {messages.map((m) => (
          <div key={m.id}>
            <strong>{m.role === 'user' ? 'You' : 'Bot'}:</strong> {m.content}
          </div>
        ))}
      </div>
      <Form onSubmit={send} className="flex gap-2">
        <TextField aria-label="Message" value={input} onChange={setInput} isDisabled={pending} className="flex-1">
          <Input ref={inputRef} className="w-full border p-2" />
        </TextField>
        <Button type="submit" isDisabled={pending} className="border px-4">
          Send
        </Button>
      </Form>
    </main>
  );
}
