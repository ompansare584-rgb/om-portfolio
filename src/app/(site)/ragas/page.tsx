import SiteShell from '@/components/site/SiteShell';
import ProgrammeGrid from '@/components/site/ProgrammeGrid';
import { RAGAS } from '@/content/ragas';
import { breadcrumbLd, pageMetadata, personLd } from '@/lib/seo';

export const dynamic = 'force-static';

const TITLE = 'Programme guide: eight ragas, eight stories about Om Pansare';
const DESC = 'In Hindustani music every raga belongs to a part of the day. Here each of the eight is a programme about Om Pansare: who he is, what he studies, and what he loves.';
export const metadata = pageMetadata({ title: TITLE, description: DESC, path: '/ragas' });

export default function Ragas() {
  const ld = [
    personLd(),
    breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Programme guide', path: '/ragas' }]),
    { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Programme guide', itemListElement: RAGAS.map((r, i) => ({ '@type': 'ListItem', position: i + 1, name: `Raag ${r.nameLat}: ${r.titleLat}`, url: `/ragas/${r.slug}` })) },
  ];
  return (
    <SiteShell current="/ragas" ld={ld}>
      <section className="sheet" aria-labelledby="h">
        <p className="eyebrow">राग रेडियो · Programme guide</p>
        <h1 className="h1" id="h">Every hour has its raga</h1>
        <p className="lede">Eight ragas, three hours each, one full day. Each is a short programme about me. The radio on the <a href="/">front page</a> tunes itself to the programme of your local hour.</p>
      </section>
      <ProgrammeGrid ragas={RAGAS} />
      <p className="soft" style={{ color: '#cdb98d' }}>Raga hours follow common textbook convention and vary by gharana.</p>
    </SiteShell>
  );
}
