/**
 * Small original line icons for the five apps (and the flute). They are drawn for this site, not copies of
 * any company logo: each one pictures what the app is for (colour wheels, a timeline, keyframes, layers, a
 * design sparkle). They use currentColor, so they match the text they sit beside.
 */
const BODY: Record<string, string> = {
  resolve: '<circle cx="9" cy="9" r="5"/><circle cx="15" cy="9" r="5"/><circle cx="12" cy="15" r="5"/>',
  premiere: '<rect x="3" y="4" width="9" height="4" rx="1"/><rect x="8" y="10" width="13" height="4" rx="1"/><rect x="3" y="16" width="8" height="4" rx="1"/><path d="M16 2.5v19"/>',
  aftereffects: '<path d="M3 18c4 0 5-12 9-12s5 12 9 12"/><path d="M3 15.2l2.4 2.8L3 20.8.6 18z"/><path d="M12 3.2l2.4 2.8L12 8.8 9.6 6z"/><path d="M21 15.2l2.4 2.8-2.4 2.8-2.4-2.8z"/>',
  photoshop: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 16l9 5 9-5"/>',
  canva: '<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 7l1.5 3.5L17 12l-3.5 1.5L12 17l-1.5-3.5L7 12l3.5-1.5z"/>',
  flute: '<g transform="rotate(-35 12 12)"><rect x="0.5" y="10.2" width="23" height="3.6" rx="1.8"/><circle cx="7" cy="12" r=".7"/><circle cx="11" cy="12" r=".7"/><circle cx="15" cy="12" r=".7"/><circle cx="19" cy="12" r=".7"/></g>',
};

export function toolKey(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('resolve')) return 'resolve';
  if (n.includes('premiere')) return 'premiere';
  if (n.includes('after')) return 'aftereffects';
  if (n.includes('photoshop')) return 'photoshop';
  if (n.includes('canva')) return 'canva';
  if (n.includes('flute')) return 'flute';
  return '';
}

/** Inner SVG shapes only (for nesting inside another <svg>). Empty string for an unknown name. */
export function toolIconBody(name: string): string {
  return BODY[toolKey(name)] ?? '';
}

/** A complete inline icon. Decorative: the app name always sits next to it in text. */
export function toolIcon(name: string, cls = 'ti-svg'): string {
  const b = toolIconBody(name);
  return b
    ? `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${b}</svg>`
    : '';
}
