import SiteShell from '@/components/site/SiteShell';
import BriefForm from '@/components/site/BriefForm';
import { CONFIG } from '@/content/config';
import { PERSON } from '@/content/site';
import { breadcrumbLd, pageMetadata, personLd, profilePageLd } from '@/lib/seo';

export const dynamic = 'force-static';

const TITLE = 'Edit bay: Om Pansare, beginner video editor';
const DESC = 'Om Pansare is learning video editing with DaVinci Resolve, Premiere Pro, After Effects, Photoshop and Canva. The toolbox, a learning log, finished edits as they appear, and how to send a brief.';
export const metadata = pageMetadata({ title: TITLE, description: DESC, path: '/editing', type: 'profile' });

const LEVEL: Record<string, string> = { learning: 'Learning', practising: 'Practising', comfortable: 'Comfortable' };
const STEPS = [
  ['Read the brief', 'What is it for, who watches it, how long, and where will it play?'],
  ['Assemble the story', 'Sort the footage, pick the best takes and build a rough cut that already makes sense.'],
  ['Shape the pace', 'Trim, cut on action, and let a pause do work where words would be too much.'],
  ['Sound and colour', 'Clean dialogue, music that supports the scene, and a grade that matches the mood.'],
  ['Titles and finish', 'Motion titles, thumbnail or cover, export for the right platform.'],
] as const;

export default function Editing() {
  const ld = [personLd(), profilePageLd('/editing', TITLE, DESC), breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Edit bay', path: '/editing' }])];
  return (
    <SiteShell current="/editing" ld={ld}>
      <section className="sheet sheet--dark" aria-labelledby="h">
        <p className="eyebrow">Edit bay · video editor in the making</p>
        <h1 className="h1" id="h">Cut, colour, compose</h1>
        <p className="lede">I have just started learning video editing. I am drawn to cinematic storytelling: how a cut, a pause or a sound can carry an emotion without a word.</p>
        <p className="soft"><b>Honest status.</b> {PERSON.honestStatus}</p>
        {CONFIG.lookingFor || CONFIG.availability ? (
          <p className="soft">
            {CONFIG.lookingFor ? <><b>Looking for:</b> {CONFIG.lookingFor} </> : null}
            {CONFIG.availability ? <><b>Availability:</b> {CONFIG.availability}</> : null}
          </p>
        ) : null}
        <div className="row">
          <a className="btn" href="#brief">Send a brief</a>
          <a className="btn btn--ghost" href="/">Tune the radio</a>
        </div>
      </section>

      <section className="sheet" aria-labelledby="ht" data-reveal>
        <h2 className="h2" id="ht">The toolbox</h2>
        <p className="soft" style={{ marginBottom: 14 }}>The five apps I am learning. Levels are self-reported and move only when it is true.</p>
        <ul className="chips" style={{ display: 'grid', gap: 10 }}>
          {CONFIG.tools.map((t) => (
            <li key={t.name}><b>{t.name}</b> · {t.use} · <em>{LEVEL[t.level] ?? 'Learning'}</em></li>
          ))}
        </ul>
      </section>

      <section className="sheet" aria-labelledby="he" data-reveal>
        <h2 className="h2" id="he">The film strip</h2>
        {CONFIG.edits.length === 0 ? (
          <div className="empty">
            <p><b>No finished edits are online yet.</b> The first frames go here as soon as they are real: a link, a one-line note on what it is, and the app used. Until then the strip stays honestly empty{CONFIG.reelUrl ? '' : '. Showreel: coming soon'}.</p>
          </div>
        ) : (
          <div className="grid grid--3">
            {CONFIG.edits.map((e) => (
              <a key={e.url} className="repo" href={e.url} target="_blank" rel="noopener noreferrer">
                <b>{e.title}</b>
                {e.line ? <span>{e.line}</span> : null}
                {e.tool ? <span>Made in {e.tool}</span> : null}
              </a>
            ))}
          </div>
        )}
        {CONFIG.reelUrl ? <p className="row"><a className="btn" href={CONFIG.reelUrl} target="_blank" rel="noopener noreferrer">Watch the showreel</a></p> : null}
      </section>

      <section className="sheet" aria-labelledby="hw" data-reveal>
        <h2 className="h2" id="hw">How I work through a brief</h2>
        <ol className="steps">
          {STEPS.map(([a, b]) => (<li key={a}><b>{a}</b> {b}</li>))}
        </ol>
      </section>

      <section className="sheet" aria-labelledby="hl" data-reveal>
        <h2 className="h2" id="hl">Learning log</h2>
        {CONFIG.learning.length === 0 ? (
          <div className="empty"><p>The log starts with my first finished practice edit.</p></div>
        ) : (
          <ul className="chips" style={{ display: 'grid', gap: 10 }}>
            {CONFIG.learning.map((l) => (<li key={l.date + l.note}><b>{l.date}</b> · {l.note}</li>))}
          </ul>
        )}
      </section>

      <section className="sheet" id="brief" aria-labelledby="hb" data-reveal>
        <h2 className="h2" id="hb">Send a brief</h2>
        <p className="soft" style={{ marginBottom: 14 }}>Tell me what you have in mind. It goes to {PERSON.email}.</p>
        <BriefForm email={PERSON.email} formspree={CONFIG.formspree} />
      </section>
    </SiteShell>
  );
}
