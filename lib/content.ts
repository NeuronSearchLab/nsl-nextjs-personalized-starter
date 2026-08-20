export type Article = { id: string; title: string; summary: string; category: string; readTime: string; accent: string };
export const content: Article[] = [
  { id: 'football-pressing', title: 'Why pressing systems are changing football again', summary: 'The tactical rotations behind this season’s most aggressive teams.', category: 'Football', readTime: '6 min', accent: '#d7ff64' },
  { id: 'design-calm-software', title: 'The quiet craft of calm software', summary: 'Interfaces that help people make decisions without demanding attention.', category: 'Design', readTime: '5 min', accent: '#b9d6ff' },
  { id: 'football-academies', title: 'The academies producing the next great midfielders', summary: 'Five development systems turning intelligence into elite performance.', category: 'Football', readTime: '8 min', accent: '#ffb4a5' },
  { id: 'science-ocean-map', title: 'A new map of the deep ocean', summary: 'Autonomous vessels are revealing a landscape we have barely seen.', category: 'Science', readTime: '7 min', accent: '#aee9df' },
  { id: 'culture-small-cinemas', title: 'The return of the small cinema', summary: 'Independent screens are rebuilding movie culture one neighbourhood at a time.', category: 'Culture', readTime: '4 min', accent: '#f8d5ff' },
  { id: 'football-set-pieces', title: 'Football’s set-piece laboratory', summary: 'How specialist coaches find goals in the margins.', category: 'Football', readTime: '6 min', accent: '#ffd978' },
];
export const byId = new Map(content.map(article => [article.id, article]));
export const nslItems = content.map(article => ({ id: article.id, name: article.title, description: article.summary, metadata: { category: article.category, readTime: article.readTime } }));
