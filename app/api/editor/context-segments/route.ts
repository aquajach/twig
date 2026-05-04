import { buildReferenceIndex, loadAllSegmentMaps } from '@/engine/contextSegmentsEditor';
import { allStorylines } from '@/engine/storylines';

function editorForbidden(): Response | null {
  if (process.env.NODE_ENV === 'production') {
    return Response.json({ error: 'Editor API is disabled in production' }, { status: 403 });
  }
  return null;
}

export async function GET() {
  const denied = editorForbidden();
  if (denied) return denied;

  const ids = new Set(allStorylines.map((g) => g.id));
  const segments = loadAllSegmentMaps();
  const references = buildReferenceIndex(ids);
  return Response.json({ segments, references });
}
