import { notFound } from 'next/navigation';

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }
  return <div className="min-h-screen bg-zinc-950">{children}</div>;
}
