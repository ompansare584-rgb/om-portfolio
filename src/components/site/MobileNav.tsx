'use client';
import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, LazyMotion, m } from 'framer-motion';
import { NAV } from '@/content/site';

/** Small-screen menu. Framer Motion loads its animation features on demand (LazyMotion), not with the page. */
export default function MobileNav({ current }: { current: string }) {
  const [open, setOpen] = useState(false);
  return (
    <LazyMotion features={() => import('./features').then((r) => r.default)} strict>
      <button type="button" className="menu-btn" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
        {open ? 'Close' : 'Menu'}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <m.nav
            id="mobile-menu"
            className="menu"
            aria-label="Mobile"
            style={{ position: 'absolute', left: 0, right: 0, top: '100%', background: '#2a160a' }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            {NAV.map((n) =>
              n.href === '/' ? (
                <a key={n.href} href={n.href}>{n.label}</a>
              ) : (
                <Link key={n.href} href={n.href} aria-current={current === n.href ? 'page' : undefined} onClick={() => setOpen(false)}>
                  {n.label}
                </Link>
              ),
            )}
          </m.nav>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
