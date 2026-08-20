import { nsl } from '@neuronsearchlab/nextjs/server';
import { byId, content, nslItems } from '@/lib/content';

export const runtime = 'nodejs';
let catalogueReady: Promise<unknown> | undefined;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  if (!userId) return Response.json({ error: 'userId is required' }, { status: 400 });
  try {
    catalogueReady ??= nsl.syncContent(nslItems);
    await catalogueReady;
    const result = await nsl.recommend({ userId, context: url.searchParams.get('context') ?? 'homepage', limit: Math.min(Number(url.searchParams.get('limit')) || 10, 20) });
    const raw = (result as { data?: Array<{ item_id?: string; id?: string }>; recommendations?: Array<{ item_id?: string; id?: string }> }).data
      ?? (result as { recommendations?: Array<{ item_id?: string; id?: string }> }).recommendations ?? [];
    const ranked = raw.map(item => byId.get(String(item.item_id ?? item.id))).filter(Boolean);
    const seen = new Set(ranked.map(item => item!.id));
    return Response.json({ items: [...ranked, ...content.filter(item => !seen.has(item.id))], personalized: ranked.length > 0 }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[starter] recommendation serving unavailable; returning editorial order', error);
    catalogueReady = undefined;
    return Response.json({ items: content, personalized: false }, { headers: { 'Cache-Control': 'no-store', 'X-NSL-Fallback': 'serving-unavailable' } });
  }
}
