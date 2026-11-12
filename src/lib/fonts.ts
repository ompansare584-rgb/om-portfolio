import { Hind, Rozha_One, Special_Elite } from 'next/font/google';

// Self-hosted at build time by next/font: no render-blocking request to Google.
// Only the two Latin files the first screen needs are preloaded. The Devanagari files (Hindi labels) are separate
// families with preload off, so the browser fetches them only when a Devanagari letter is actually drawn.
// This keeps the first paint light and avoids the "preloaded but not used" console warnings.
export const display = Rozha_One({ subsets: ['latin'], weight: '400', variable: '--ff-display', display: 'swap' });
export const displayDev = Rozha_One({ subsets: ['devanagari'], weight: '400', variable: '--ff-display-dev', display: 'swap', preload: false });
export const body = Hind({ subsets: ['latin'], weight: ['400', '600'], variable: '--ff-body', display: 'swap' });
export const bodyDev = Hind({ subsets: ['devanagari'], weight: ['400', '600'], variable: '--ff-body-dev', display: 'swap', preload: false });
export const typed = Special_Elite({ subsets: ['latin'], weight: '400', variable: '--ff-type', display: 'swap', preload: false });

export const fontVars = `${display.variable} ${displayDev.variable} ${body.variable} ${bodyDev.variable} ${typed.variable}`;
