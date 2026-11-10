'use client';
import { useEffect, useRef } from 'react';

/**
 * All the "feel" libraries in one place, and all of them lazy:
 *  - Lenis: smooth scrolling
 *  - GSAP + ScrollTrigger: reveal on scroll (below-the-fold only, so nothing above the fold flashes)
 *  - Three.js + GLSL: the sky behind the page
 * Nothing here loads until the visitor first scrolls, moves or touches the page. That keeps the first paint
 * (what Lighthouse measures) free of them. Reduced-motion and Save-Data visitors get the plain page.
 */
export default function ClientFX() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    const lite = !!nav.connection?.saveData || (nav.deviceMemory !== undefined && nav.deviceMemory < 4);
    if (rm) return;

    const undo: Array<() => void> = [];
    let started = false;
    let gone = false;
    const evs = ['pointermove', 'wheel', 'touchstart', 'keydown', 'scroll'] as const;
    const off = () => evs.forEach((e) => removeEventListener(e, start));

    async function start() {
      if (started) return;
      started = true;
      off();
      try {
        const [{ default: Lenis }, gsapMod, stMod] = await Promise.all([import('lenis'), import('gsap'), import('gsap/ScrollTrigger')]);
        if (gone) return;
        const gsap = gsapMod.gsap || gsapMod.default;
        const ScrollTrigger = stMod.ScrollTrigger || stMod.default;
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
        lenis.on('scroll', ScrollTrigger.update);
        const tick = (t: number) => lenis.raf(t * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        const ctx = gsap.context(() => {
          gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
            if (el.getBoundingClientRect().top < innerHeight * 0.92) return; // already on screen: leave it alone
            gsap.from(el, { opacity: 0, y: 28, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
          });
          gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
            gsap.to(el, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
          });
        });
        undo.push(() => {
          ctx.revert();
          gsap.ticker.remove(tick);
          lenis.destroy();
        });
      } catch {
        /* the page works without any of this */
      }

      if (!lite && innerWidth >= 800 && canvas.current) {
        try {
          const { mountSky } = await import('@/lib/shader');
          if (!gone && canvas.current) undo.push(mountSky(canvas.current));
        } catch {
          /* CSS sky stays */
        }
      }
    }

    evs.forEach((e) => addEventListener(e, start, { passive: true, once: true }));
    return () => {
      gone = true;
      off();
      undo.forEach((u) => u());
    };
  }, []);

  return <canvas ref={canvas} className="atmos" aria-hidden="true" />;
}
