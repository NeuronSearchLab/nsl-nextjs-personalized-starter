import { nsl } from '@neuronsearchlab/nextjs/server';
import { content, nslItems } from '@/lib/content';

export const runtime = 'nodejs';
let catalogueReady: Promise<Map<number, (typeof content)[number]>> | undefined;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  if (!userId) return Response.json({ error: 'userId is required' }, { status: 400 });
  try {
    const contextId = Number(process.env.NSL_CONTEXT_ID);
    const clickEventId = Number(process.env.NSL_EVENT_CLICK_ID);
    if (!Number.isSafeInteger(contextId) || contextId <= 0) throw new Error('NSL_CONTEXT_ID must be a positive dashboard context ID');
    if (!Number.isSafeInteger(clickEventId) || clickEventId === 0) throw new Error('NSL_EVENT_CLICK_ID must be a non-zero dashboard event ID');
    catalogueReady ??= nsl.syncContent(nslItems).then((response: unknown) => {
      const rows = Array.isArray(response) ? response : ((response as { data?: unknown[] })?.data ?? [response]);
      return new Map(rows.flatMap((row, index) => {
        const itemId = Number((row as { id?: unknown })?.id);
        return Number.isSafeInteger(itemId) && content[index] ? [[itemId, content[index]] as const] : [];
      }));
    });
    const catalogue = await catalogueReady;
    const result = await nsl.recommend({ userId, contextId, limit: Math.min(Number(url.searchParams.get('limit')) || 10, 20) });
    const raw = (result as { data?: Array<{ item_id?: number; id?: number }>; recommendations?: Array<{ item_id?: number; id?: number }> }).data
      ?? (result as { recommendations?: Array<{ item_id?: number; id?: number }> }).recommendations ?? [];
    const ranked = raw.map(item => {
      const nslItemId = Number(item.item_id ?? item.id);
      const article = catalogue.get(nslItemId);
      return article ? { ...article, nslItemId } : undefined;
    }).filter(Boolean);
    const seen = new Set(ranked.map(item => item!.id));
    return Response.json({ items: [...ranked, ...content.filter(item => !seen.has(item.id))], clickEventId, personalized: ranked.length > 0 }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[starter] recommendation serving unavailable; returning editorial order', error);
    catalogueReady = undefined;
    return Response.json({ items: content, personalized: false }, { headers: { 'Cache-Control': 'no-store', 'X-NSL-Fallback': 'serving-unavailable' } });
  }
}
