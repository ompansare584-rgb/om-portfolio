'use client';
import { useEffect } from 'react';

/**
 * Starts the radio engine after the page has loaded and the browser is idle.
 * Until then the page is plain, fast HTML + CSS (this is what Lighthouse measures first).
 * A touch before that also starts it, and a tap on a door key or the radio that arrives before the engine is
 * ready is remembered and replayed once it is, so a fast visitor never taps a dead button.
 */
export default function RadioBoot() {
  useEffect(() => {
    let done = false;
    let queued: Element | null = null;
    const go = () => {
      if (done) return;
      done = true;
      cleanup();
      import('@/lib/radio/engine')
        .then((m) => {
          m.startRadio();
          document.removeEventListener('click', early, true);
          const q = queued;
          queued = null;
          if (q && q.isConnected) (q as HTMLElement).click();
        })
        .catch(() => document.removeEventListener('click', early, true));
    };
    const early = (e: Event) => {
      if ((window as unknown as { __rrReady?: boolean }).__rrReady) return;
      const t = (e.target as Element | null)?.closest?.('[data-pick],[data-enter],[data-open],[data-guide],#moreBtn,#cueMore');
      if (t && !queued) {
        queued = t;
        e.stopPropagation();
        e.preventDefault();
      }
    };
    const idle = () => {
      const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void }).requestIdleCallback;
      if (ric) ric(go, { timeout: 700 });
      else setTimeout(go, 300);
    };
    const evs = ['pointerdown', 'keydown', 'touchstart'] as const;
    const cleanup = () => evs.forEach((e) => window.removeEventListener(e, go, true));
    evs.forEach((e) => window.addEventListener(e, go, { capture: true, passive: true, once: true }));
    document.addEventListener('click', early, true);
    if (document.readyState === 'complete') idle();
    else window.addEventListener('load', idle, { once: true });
    return () => {
      cleanup();
      document.removeEventListener('click', early, true);
    };
  }, []);
  return null;
}
