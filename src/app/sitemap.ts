import type { MetadataRoute } from 'next';
import { ALL_PATHS, abs } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ALL_PATHS.map((p) => ({
    url: abs(p),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: p === '/' ? 1 : p === '/hiring' || p === '/editing' ? 0.9 : p === '/ragas' ? 0.8 : 0.6,
  }));
}
