'use client';
import { useEffect, useState } from 'react';
import { trackNSLEvent } from '@neuronsearchlab/nextjs/react';
import { content, type Article } from '@/lib/content';

function visitorId() { const key = 'nsl-starter-visitor'; let id = localStorage.getItem(key); if (!id) { id = crypto.randomUUID(); localStorage.setItem(key, id); } return id; }
export function Feed() {
  const [items, setItems] = useState<Article[]>(content);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const id = visitorId(); fetch(`/api/nsl/recommendations?userId=${encodeURIComponent(id)}&context=homepage&limit=6`).then(r => r.json()).then(data => { if (Array.isArray(data.items)) setItems(data.items); }).finally(() => setLoading(false)); }, []);
  async function open(article: Article) { await trackNSLEvent({ userId: visitorId(), itemId: article.id, event: 'click' }); setItems(current => [article, ...current.filter(item => item.id !== article.id)]); }
  return <section className={`feed ${loading ? 'loading' : ''}`}><div className="feed-title"><h2>For you</h2><p>Try opening Football stories, then refresh.</p></div><div className="grid">{items.map((article, index) => <article key={article.id} onClick={() => void open(article)}><div className="art" style={{ background: article.accent }}><span>{String(index + 1).padStart(2, '0')}</span><b>{article.category.slice(0, 1)}</b></div><div className="meta"><span>{article.category}</span><span>{article.readTime}</span></div><h3>{article.title}</h3><p>{article.summary}</p><button>Read story <span>→</span></button></article>)}</div></section>;
}
