import { putNpcContextSegments } from '@/engine/contextSegmentsEditor';
import { allStorylines } from '@/engine/storylines';

function editorForbidden(): Response | null {
  if (process.env.NODE_ENV === 'production') {
    return Response.json({ error: 'Editor API is disabled in production' }, { status: 403 });
  }
  return null;
}

export async function PUT(req: Request, ctx: { params: Promise<{ npcId: string }> }) {
  const denied = editorForbidden();
  if (denied) return denied;

  const { npcId } = await ctx.params;
  const body = (await req.json()) as { segments?: Record<string, string> };
  if (!body?.segments || typeof body.segments !== 'object') {
    return Response.json({ error: 'Body.segments object required' }, { status: 400 });
  }

  const ids = new Set(allStorylines.map((g) => g.id));
  try {
    const result = putNpcContextSegments(npcId, body.segments, ids);
    if (!result.ok) {
      return Response.json(
        {
          error: 'delete_blocked',
          blocked: result.blocked,
        },
        { status: 400 },
      );
    }
    return Response.json({ ok: true, updatedStorylineIds: result.updatedStorylineIds });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Save failed';
    return Response.json({ error: msg }, { status: 500 });
  }
}
