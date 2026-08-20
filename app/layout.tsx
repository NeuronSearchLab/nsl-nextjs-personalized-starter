import type { Metadata } from 'next';
import './styles.css';
export const metadata: Metadata = { title: 'The Current — Personalized by NeuronSearchLab', description: 'A personalized Next.js content starter.' };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
