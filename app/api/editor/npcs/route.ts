import { npcs } from '@/data/npcs';

function editorForbidden(): Response | null {
  if (process.env.NODE_ENV === 'production') {
    return Response.json({ error: 'Editor API is disabled in production' }, { status: 403 });
  }
  return null;
}

export async function GET() {
  const denied = editorForbidden();
  if (denied) return denied;

  const list = Object.values(npcs).map((n) => ({
    id: n.id,
    name: n.name,
    title: n.title,
  }));
  return Response.json(list);
}
