import { notFound } from 'next/navigation';
import SiteShell from '@/components/site/SiteShell';
import { RAGAS, RAGA_BY_SLUG } from '@/content/ragas';
import { SONGS } from '@/content/config';
import { abs, breadcrumbLd, pageMetadata, personLd, ragaPageLd } from '@/lib/seo';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const generateStaticParams = () => RAGAS.map((r) => ({ slug: r.slug }));

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P) {
  const { slug } = await params;
  const r = RAGA_BY_SLUG[slug];
  if (!r) return {};
  return pageMetadata({ title: `Raag ${r.nameLat}: ${r.titleLat} · Om Pansare`, description: `${r.subtitle} ${r.summary}`.slice(0, 300), path: `/ragas/${r.slug}` });
}

export default async function RagaPage({ params }: P) {
  const { slug } = await params;
  const r = RAGA_BY_SLUG[slug];
  if (!r) notFound();
  const prev = RAGAS[(r.index + 7) % 8];
  const next = RAGAS[(r.index + 1) % 8];
  const song = SONGS[r.slug];
  const ld = [personLd(), ragaPageLd(r), breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Programme guide', path: '/ragas' }, { name: `Raag ${r.nameLat}`, path: `/ragas/${r.slug}` }])];
  return (
    <SiteShell current="/ragas" ld={ld}>
      <nav className="crumbs" aria-label="Breadcrumb" style={{ color: '#cdb98d' }}>
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/ragas">Programme guide</a></li>
          <li aria-current="page">Raag {r.nameLat}</li>
        </ol>
      </nav>

      <article className="sheet" aria-labelledby="h">
        <p className="eyebrow">Programme {String(r.no).padStart(2, '0')} · {r.time} · {r.mood}</p>
        <h1 className="h1" id="h"><span className="dev" lang="hi">{r.nameDev}</span> · Raag {r.nameLat}</h1>
        <h2 className="h2">{r.titleLat} <span className="dev" lang="hi">({r.titleDev})</span></h2>
        <p className="lede">{r.subtitle}</p>
        <p style={{ marginTop: 12, maxWidth: '62ch' }}>{r.summary}</p>
        <ul className="chips">{r.tags.map((t) => (<li key={t}>{t}</li>))}</ul>

        <h3 className="h3" style={{ marginTop: 24 }}>Swaras</h3>
        <ul className="swaras" aria-label={`Notes of Raag ${r.nameLat}`}>
          {r.swaras.map((s) => (<li key={s} className={s === r.vadiKey ? 'vadi' : undefined}>{s.replace('#', '♯')}</li>))}
        </ul>
        <p className="soft">Vadi (the king note): {r.vadi}. Capital letters are shuddha, lowercase r g d n are komal, M♯ is tivra Ma.</p>

        <h3 className="h3" style={{ marginTop: 24 }}>RJ’s note</h3>
        <p style={{ maxWidth: '62ch' }}>{r.note}</p>

        {song && (
          <>
            <h3 className="h3" style={{ marginTop: 24 }}>Now playing</h3>
            <p>
              <a href={song.url} target="_blank" rel="noopener noreferrer">{song.title}</a> ({song.film}, {song.year}), sung by {song.singers.join(' and ')}, music by {song.composer}.
              {song.ragaVerified ? '' : ' The raga of this song is still to be confirmed.'}
            </p>
          </>
        )}

        <div className="row">
          <a className="btn on-paper" href={`/?station=${r.slug}`}>Tune the radio to this station</a>
          <a className="btn btn--ghost" href={abs('/llms-full.txt')} rel="alternate" type="text/markdown">Read as markdown</a>
        </div>
      </article>

      <nav className="pager" aria-label="Other programmes">
        <a className="btn btn--ghost" href={`/ragas/${prev.slug}`}>← Raag {prev.nameLat}</a>
        <a className="btn btn--ghost" href={`/ragas/${next.slug}`}>Raag {next.nameLat} →</a>
      </nav>
    </SiteShell>
  );
}
