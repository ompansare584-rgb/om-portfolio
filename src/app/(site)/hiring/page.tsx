import Image from 'next/image';
import SiteShell from '@/components/site/SiteShell';
import GithubShelf from '@/components/site/GithubShelf';
import { CONFIG } from '@/content/config';
import { PERSON } from '@/content/site';
import { breadcrumbLd, pageMetadata, personLd, profilePageLd } from '@/lib/seo';

export const dynamic = 'force-static';

const TITLE = 'Hiring: Om Pansare, first-year B.Tech CSE at VIT Pune';
const DESC = `${PERSON.name} is a first-year B.Tech Computer Science student at VIT Pune. An honest look at where he is, what he follows, and how to reach him. No inflated claims.`;
export const metadata = pageMetadata({ title: TITLE, description: DESC, path: '/hiring', type: 'profile' });

export default function Hiring() {
  const ld = [personLd(), profilePageLd('/hiring', TITLE, DESC), breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Hiring', path: '/hiring' }])];
  return (
    <SiteShell current="/hiring" ld={ld}>
      <section className="sheet" aria-labelledby="h">
        <div className="hero">
          <div>
            <p className="eyebrow">Placement desk · the engineering side</p>
            <h1 className="h1" id="h">{PERSON.name}</h1>
            <p className="lede">{PERSON.jobTitle} at {PERSON.institutionShort}, {PERSON.city}. {PERSON.tagline}</p>
            <div className="row">
              <a className="btn on-paper" href={`mailto:${PERSON.email}`}>Write to me</a>
              <a className="btn btn--ghost" href="/">Tune the radio</a>
            </div>
          </div>
          <div className="hero__pic" data-parallax>
            <Image src={PERSON.image} alt={PERSON.imageAlt} width={640} height={640} priority sizes="(max-width: 760px) 60vw, 260px" />
          </div>
        </div>
      </section>

      <section className="sheet" aria-labelledby="hs" data-reveal>
        <h2 className="h2" id="hs">Honest status</h2>
        <p className="lede">{PERSON.honestStatus}</p>
        <div className="facts" style={{ marginTop: 18 }}>
          <div><h3>Studying</h3><p>{PERSON.degree}, {PERSON.academicYear}, {PERSON.institutionShort}.</p></div>
          <div><h3>Based in</h3><p>{PERSON.city}, {PERSON.region}, {PERSON.country}.</p></div>
          <div><h3>Character</h3><p>{PERSON.values}</p></div>
        </div>
        {CONFIG.lookingFor ? <p style={{ marginTop: 16 }}><b>Looking for: </b>{CONFIG.lookingFor}</p> : null}
      </section>

      <section className="sheet" aria-labelledby="hi" data-reveal>
        <h2 className="h2" id="hi">What I follow</h2>
        <ul className="chips">{PERSON.interests.map((i) => (<li key={i}>{i}</li>))}</ul>
        {CONFIG.tools.length > 0 && (
          <>
            <h3 className="h3" style={{ marginTop: 22 }}>Tools I use</h3>
            <ul className="chips">{CONFIG.tools.map((t) => (<li key={t}>{t}</li>))}</ul>
          </>
        )}
      </section>

      <section className="sheet" aria-labelledby="hp" data-reveal>
        <h2 className="h2" id="hp">Projects</h2>
        {CONFIG.projects.length === 0 ? (
          <div className="empty">
            <p><b>The workbench is clear for now.</b> I would rather show nothing than dress up unfinished experiments. Finished projects will be pinned here, each with what I learned from it.</p>
          </div>
        ) : (
          <div className="grid">
            {CONFIG.projects.map((p) => (
              <article className="repo" key={p.name}>
                <b>{p.name}</b>
                <span>{p.line}{p.tech?.length ? ` · ${p.tech.join(', ')}` : ''}</span>
                {p.lesson ? <span style={{ display: 'block', marginTop: 6 }}>Learned: {p.lesson}</span> : null}
                <span style={{ display: 'block', marginTop: 8 }}>
                  {p.url ? <a href={p.url} target="_blank" rel="noopener noreferrer">Live</a> : null}
                  {p.url && p.repo ? ' · ' : null}
                  {p.repo ? <a href={p.repo} target="_blank" rel="noopener noreferrer">Code</a> : null}
                </span>
              </article>
            ))}
          </div>
        )}
        <h3 className="h3" style={{ marginTop: 24, marginBottom: 8 }}>On GitHub</h3>
        <GithubShelf user={PERSON.githubUser} />
      </section>

      <section className="sheet sheet--dark" aria-labelledby="hc" data-reveal>
        <h2 className="h2" id="hc">Resume and contact</h2>
        <p>
          {CONFIG.resumeUrl ? <a className="btn" href={CONFIG.resumeUrl} target="_blank" rel="noopener noreferrer">Download resume</a> : <span>Resume: coming soon, once there is something worth putting on it.</span>}
        </p>
        <div className="row">
          <a className="btn" href={`mailto:${PERSON.email}`}>Email</a>
          <a className="btn btn--ghost" href={PERSON.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className="btn btn--ghost" href={PERSON.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </section>
    </SiteShell>
  );
}
