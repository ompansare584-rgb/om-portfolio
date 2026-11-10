import { buildHomeHtml, PREPAINT } from '@/lib/homeHtml';
import RadioBoot from '@/components/radio/RadioBoot';
import { pageMetadata, personLd, websiteLd } from '@/lib/seo';
import { PERSON } from '@/content/site';

export const dynamic = 'force-static';

export const metadata = pageMetadata({
  title: 'Om Pansare · Raag Radio: a portfolio that tunes itself to the hour',
  description: `${PERSON.name} is a first-year B.Tech Computer Science student at VIT Pune who loves technology, design, cinema, ragas and the flute. Tune the dial: every hour has its raga.`,
  path: '/',
});

export default function Home() {
  const ld = [personLd(), websiteLd()];
  return (
    <>
      {/* The radio is static markup from src/content/home.html, so it is in the HTML crawlers and AI agents download. */}
      <div dangerouslySetInnerHTML={{ __html: buildHomeHtml() }} suppressHydrationWarning />
      <script dangerouslySetInnerHTML={{ __html: PREPAINT }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <RadioBoot />
    </>
  );
}
