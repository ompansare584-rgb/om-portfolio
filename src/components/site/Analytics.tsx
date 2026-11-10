'use client';
import { useEffect, useState } from 'react';

/**
 * Optional Vercel Analytics + Speed Insights. OFF unless NEXT_PUBLIC_ANALYTICS=1, and even then it loads
 * after the page is idle, so it cannot touch the Lighthouse score or the first paint.
 */
export default function Analytics() {
  const [mods, setMods] = useState<{ A: React.ComponentType; S: React.ComponentType } | null>(null);
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ANALYTICS !== '1') return;
    const run = () =>
      Promise.all([import('@vercel/analytics/react'), import('@vercel/speed-insights/next')])
        .then(([a, s]) => setMods({ A: a.Analytics as React.ComponentType, S: s.SpeedInsights as React.ComponentType }))
        .catch(() => {});
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback;
    if (ric) ric(run);
    else setTimeout(run, 2000);
  }, []);
  if (!mods) return null;
  return (<><mods.A /><mods.S /></>);
}
