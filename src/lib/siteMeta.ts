import type { Metadata, Viewport } from 'next';
import { SITE_URL } from '@/lib/siteUrl';

export const baseViewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#2a160a' };

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: 'Raag Radio',
  authors: [{ name: 'Om Pansare', url: SITE_URL }],
  creator: 'Om Pansare',
  icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }, { url: '/icon-192.png', sizes: '192x192', type: 'image/png' }], apple: '/apple-touch-icon.png' },
};
