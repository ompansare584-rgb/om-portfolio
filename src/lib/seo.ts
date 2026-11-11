import type { Metadata } from 'next';
import { PERSON } from '@/content/site';
import { SITE_URL } from '@/lib/siteUrl';
import { RAGAS, type Raga } from '@/content/ragas';

export const SITE_TITLE = 'Om Pansare · Raag Radio';
export const abs = (path = '/') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

type MetaInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  type?: 'website' | 'profile';
};

/** One place for titles, descriptions, canonical, Open Graph and Twitter cards. */
export function pageMetadata({ title, description, path, image = '/og.jpg', noindex, type = 'website' }: MetaInput): Metadata {
  const url = abs(path);
  const img = abs(image);
  return {
    title,
    description,
    alternates: { canonical: url, types: { 'text/markdown': abs('/llms-full.txt') } },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: SITE_TITLE,
      locale: 'en_IN',
      images: [{ url: img, width: 1200, height: 630, alt: `${PERSON.name}: ${SITE_TITLE}` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [img] },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
  };
}

type LD = Record<string, unknown>;

export const personLd = (): LD => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: PERSON.name,
  url: SITE_URL,
  image: abs(PERSON.image),
  jobTitle: PERSON.jobTitle,
  description: PERSON.description,
  email: `mailto:${PERSON.email}`,
  affiliation: { '@type': 'CollegeOrUniversity', name: PERSON.institution, address: { '@type': 'PostalAddress', addressLocality: PERSON.city, addressRegion: PERSON.region, addressCountry: PERSON.countryCode } },
  address: { '@type': 'PostalAddress', addressLocality: PERSON.city, addressRegion: PERSON.region, addressCountry: PERSON.countryCode },
  knowsAbout: ['Video editing', 'Filmmaking', 'Cinematic storytelling', 'DaVinci Resolve', 'Adobe Premiere Pro', 'Adobe After Effects', 'Adobe Photoshop', 'Canva', 'Colour grading', 'Indian classical music', 'Ragas', 'Flute'],
  sameAs: [PERSON.github, PERSON.linkedin],
});

export const websiteLd = (): LD => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_TITLE,
  description: PERSON.description,
  inLanguage: 'en-IN',
  publisher: { '@id': `${SITE_URL}/#person` },
});

export const profilePageLd = (path: string, name: string, description: string): LD => ({
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url: abs(path),
  name,
  description,
  mainEntity: { '@id': `${SITE_URL}/#person` },
  isPartOf: { '@id': `${SITE_URL}/#website` },
});

export const breadcrumbLd = (items: { name: string; path: string }[]): LD => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
});

export const ragaPageLd = (r: Raga): LD => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  url: abs(`/ragas/${r.slug}`),
  name: `Raag ${r.nameLat}: ${r.titleLat}`,
  description: r.summary,
  inLanguage: 'en-IN',
  about: { '@type': 'Thing', name: `Raag ${r.nameLat}` },
  isPartOf: { '@id': `${SITE_URL}/#website` },
  author: { '@id': `${SITE_URL}/#person` },
});

export const ALL_PATHS = ['/', '/editing', '/ragas', ...RAGAS.map((r) => `/ragas/${r.slug}`)];
