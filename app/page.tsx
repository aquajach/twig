"use client";

import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!pending) inputRef.current?.focus();
  }, [pending]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || pending) return;

    const next: Message[] = [...messages, { role: "user", content: input }];
    setMessages(next);
    setInput("");
    setPending(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: next }),
    });
    const { content } = await res.json();
    setMessages([...next, { role: "assistant", content }]);
    setPending(false);
  }

  return (
    <main className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="space-y-2">
        {messages.map((m, i) => (
          <div key={i}>
            <strong>{m.role === "user" ? "You" : "Bot"}:</strong> {m.content}
          </div>
        ))}
      </div>
      <form onSubmit={send} className="flex gap-2">
        <input
          ref={inputRef}
          autoFocus
          className="flex-1 border p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={pending}
        />
        <button type="submit" className="border px-4" disabled={pending}>
          Send
        </button>
      </form>
    </main>
  );
}
