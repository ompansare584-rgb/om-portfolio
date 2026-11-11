import Link from 'next/link';
import { NAV, PERSON } from '@/content/site';
import ClientFX from './ClientFX';
import MobileNav from './MobileNav';
import Analytics from './Analytics';

export default function SiteShell({ current, children, ld }: { current: string; children: React.ReactNode; ld?: object[] }) {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <ClientFX />
      <div className="page">
        <header className="hdr">
          <div className="wrap hdr__in" style={{ position: 'relative' }}>
            <a className="brand" href="/" aria-label="Om Pansare, Raag Radio: back to the radio">
              <b>Om Pansare</b>
              <span>राग रेडियो · Raag Radio</span>
            </a>
            <nav className="nav" aria-label="Main">
              {NAV.map((n) =>
                n.href === '/' ? (
                  <a key={n.href} href={n.href} title={n.title}>{n.label}</a>
                ) : (
                  <Link key={n.href} href={n.href} title={n.title} aria-current={current === n.href ? 'page' : undefined}>{n.label}</Link>
                ),
              )}
            </nav>
            <MobileNav current={current} />
          </div>
        </header>
        <main id="main" className="wrap main">{children}</main>
        <footer className="ftr">
          <div className="wrap ftr__in">
            <div>
              <h2>{PERSON.name}</h2>
              <p>{PERSON.tagline}</p>
              <p>First-year B.Tech Computer Science, VIT Pune.</p>
            </div>
            <div>
              <h2>Find me</h2>
              <ul>
                <li><a href={`mailto:${PERSON.email}`}>Email</a></li>
                <li><a href={PERSON.linkedin} rel="noopener noreferrer" target="_blank">LinkedIn</a></li>
              </ul>
            </div>
            <div>
              <h2>Explore</h2>
              <ul>
                {NAV.map((n) => (<li key={n.href}><a href={n.href}>{n.label}</a></li>))}
                <li><a href="/llms.txt">For AI agents: llms.txt</a></li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
      {ld?.map((o, i) => (<script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(o) }} />))}
      <Analytics />
    </>
  );
}
