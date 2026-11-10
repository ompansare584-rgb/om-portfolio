'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LazyMotion, m } from 'framer-motion';
import type { Raga } from '@/content/ragas';

/** Server-rendered like everything else. After load it only adds "On air now" to the programme of the visitor's local hour. */
export default function ProgrammeGrid({ ragas }: { ragas: Raga[] }) {
  const [live, setLive] = useState(-1);
  useEffect(() => setLive(Math.min(7, Math.floor(new Date().getHours() / 3))), []);
  return (
    <LazyMotion features={() => import('./features').then((r) => r.default)} strict>
      <ul className="grid grid--4" style={{ listStyle: 'none', padding: 0 }}>
        {ragas.map((r) => (
          <li key={r.slug}>
            <m.div whileHover={{ y: -4 }} transition={{ duration: 0.18 }}>
              <Link className="card" href={`/ragas/${r.slug}`} data-reveal>
                <span className="meta">
                  <span className="no">{String(r.no).padStart(2, '0')}</span>
                  <span>{r.time}</span>
                  {live === r.index && <span className="live">● On air now</span>}
                </span>
                <span className="dev" lang="hi" style={{ display: 'block' }}>{r.nameDev}</span>
                <span className="t" style={{ display: 'block' }}>Raag {r.nameLat}</span>
                <span className="s" style={{ display: 'block' }}>{r.titleLat}: {r.subtitle}</span>
              </Link>
            </m.div>
          </li>
        ))}
      </ul>
    </LazyMotion>
  );
}
