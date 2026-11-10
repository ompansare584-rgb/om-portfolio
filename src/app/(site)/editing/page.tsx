import SiteShell from '@/components/site/SiteShell';
import BriefForm from '@/components/site/BriefForm';
import { CONFIG } from '@/content/config';
import { PERSON } from '@/content/site';
import { breadcrumbLd, pageMetadata, personLd, profilePageLd } from '@/lib/seo';

export const dynamic = 'force-static';

const TITLE = 'Editing: Om Pansare, video editing and cinematic storytelling';
const DESC = 'The video editing side of Om Pansare: cinematic storytelling, pacing, sound and atmosphere. Finished edits will be listed here; send a brief any time.';
export const metadata = pageMetadata({ title: TITLE, description: DESC, path: '/editing', type: 'profile' });

export default function Editing() {
  const ld = [personLd(), profilePageLd('/editing', TITLE, DESC), breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Editing', path: '/editing' }])];
  return (
    <SiteShell current="/editing" ld={ld}>
      <section className="sheet sheet--dark" aria-labelledby="h">
        <p className="eyebrow">Edit bay · the video editing side</p>
        <h1 className="h1" id="h">Pictures, sound and pace</h1>
        <p className="lede">I am drawn to cinematic storytelling: how a cut, a pause or a sound can carry emotion without a word. Editing is where that gets practised.</p>
        <div className="row">
          <a className="btn" href="#brief">Send a brief</a>
          <a className="btn btn--ghost" href="/">Tune the radio</a>
        </div>
      </section>

      <section className="sheet" aria-labelledby="he" data-reveal>
        <h2 className="h2" id="he">The film strip</h2>
        {CONFIG.edits.length === 0 ? (
          <div className="empty">
            <p><b>No finished edits are online yet.</b> The first frames go here as soon as they are real: a link, a one-line note on what it is, and the app used. Until then, the strip stays honestly empty.</p>
          </div>
        ) : (
          <div className="grid grid--3">
            {CONFIG.edits.map((e) => (
              <a key={e.url} className="repo" href={e.url} target="_blank" rel="noopener noreferrer">
                <b>{e.title}</b>
                <span>{e.line}</span>
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="sheet" aria-labelledby="hf" data-reveal>
        <h2 className="h2" id="hf">What pulls me in</h2>
        <ul className="chips">
          <li>Cinematic storytelling</li>
          <li>Video editing</li>
          <li>Visual composition</li>
          <li>Filmmaking</li>
          <li>Sound and atmosphere</li>
        </ul>
      </section>

      <section className="sheet" id="brief" aria-labelledby="hb" data-reveal>
        <h2 className="h2" id="hb">Send a brief</h2>
        <p className="soft" style={{ marginBottom: 14 }}>Tell me what you have in mind. It goes to {PERSON.email}.</p>
        <BriefForm email={PERSON.email} formspree={CONFIG.formspree} />
      </section>
    </SiteShell>
  );
}
