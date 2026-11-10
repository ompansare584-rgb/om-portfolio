import { Hind, Rozha_One, Special_Elite } from 'next/font/google';

// Self-hosted at build time by next/font: no render-blocking request to Google, no layout shift.
export const display = Rozha_One({ subsets: ['latin', 'devanagari'], weight: '400', variable: '--ff-display', display: 'swap' });
export const body = Hind({ subsets: ['latin', 'devanagari'], weight: ['400', '500', '600'], variable: '--ff-body', display: 'swap' });
export const typed = Special_Elite({ subsets: ['latin'], weight: '400', variable: '--ff-type', display: 'swap', preload: false });

export const fontVars = `${display.variable} ${body.variable} ${typed.variable}`;
