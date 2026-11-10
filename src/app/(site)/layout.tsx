import { fontVars } from '@/lib/fonts';
import { baseMetadata, baseViewport } from '@/lib/siteMeta';
import '@/styles/site/site.scss';

export const viewport = baseViewport;
export const metadata = baseMetadata;

// Sets the colour of the window from the visitor's local hour before the first paint (no flash, no JS library).
const TOD = `(function(){var h=new Date().getHours(),t=h<5||h>=21?'night':h<8?'dawn':h<16?'day':h<19?'golden':'dusk';document.documentElement.setAttribute('data-tod',t)})();`;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: TOD }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
