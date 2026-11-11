import { fontVars } from '@/lib/fonts';
import { baseMetadata, baseViewport } from '@/lib/siteMeta';
import { TOD } from '@/lib/homeHtml';
import '@/styles/radio/radio.css';

export const viewport = baseViewport;
export const metadata = baseMetadata;

// This group is the radio: one fixed screen, no page scroll. Its CSS is isolated from the scrolling pages
// (the two groups are separate root layouts, so moving between them is a normal page load).
export default function RadioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js');" + TOD }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
