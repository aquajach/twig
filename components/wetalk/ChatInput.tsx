'use client';

import { useRef } from 'react';
import { Button } from 'react-aria-components/Button';
import { Form } from 'react-aria-components/Form';
import { Input } from 'react-aria-components/Input';
import { TextField } from 'react-aria-components/TextField';

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isDisabled: boolean;
};

export function ChatInput({ value, onChange, onSend, isDisabled }: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim() || isDisabled) return;
    onSend();
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <Form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-divider">
      <TextField aria-label="Message" value={value} onChange={onChange} isDisabled={isDisabled} className="flex-1">
        <Input
          ref={inputRef}
          placeholder="Type a message..."
          className="w-full rounded-full bg-surface-solid px-4 py-2 text-sm text-text-primary placeholder:text-text-disabled outline-none ring-1 ring-divider focus:ring-accent transition-shadow"
        />
      </TextField>
      <Button
        type="submit"
        isDisabled={isDisabled || !value.trim()}
        className="shrink-0 size-9 rounded-full bg-accent data-[disabled]:opacity-30 flex items-center justify-center outline-none data-[hovered]:bg-accent-hover transition-colors data-[pressed]:scale-90"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 8h12M9 3l5 5-5 5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Button>
    </Form>
  );
}
