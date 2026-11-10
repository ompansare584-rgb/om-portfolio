'use client';
import { useEffect } from 'react';

/**
 * Starts the radio engine after the page has loaded and the browser is idle.
 * Until then the page is plain, fast HTML + CSS (this is what Lighthouse measures first).
 * A touch before that also starts it, so nothing waits on the timer.
 */
export default function RadioBoot() {
  useEffect(() => {
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      cleanup();
      import('@/lib/radio/engine').then((m) => m.startRadio()).catch(() => {});
    };
    const idle = () => {
      const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void }).requestIdleCallback;
      if (ric) ric(go, { timeout: 1500 });
      else setTimeout(go, 400);
    };
    const evs = ['pointerdown', 'keydown', 'touchstart'] as const;
    const cleanup = () => evs.forEach((e) => window.removeEventListener(e, go, true));
    evs.forEach((e) => window.addEventListener(e, go, { capture: true, passive: true, once: true }));
    if (document.readyState === 'complete') idle();
    else window.addEventListener('load', idle, { once: true });
    return cleanup;
  }, []);
  return null;
}
