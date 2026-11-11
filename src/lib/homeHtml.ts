import fs from 'node:fs';
import path from 'node:path';
import { RAGAS } from '@/content/ragas';
import { CONFIG } from '@/content/config';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** One <article> per programme. The radio engine reads these straight from the page (see lib/radio/engine.ts). */
function progs(): string {
  return RAGAS.map(
    (r) => `      <article class="prog" id="prog-${r.slug}" data-id="${r.slug}" data-zone="${esc(r.dialLat)}" data-zonedev="${esc(r.dialDev)}" data-swaras="${r.swaras.join(' ')}" data-vadi="${esc(r.vadi)}" data-vadikey="${esc(r.vadiKey)}">
        <p class="p-meta"><span class="p-no">${String(r.no).padStart(2, '0')}</span><span class="p-time">${esc(r.time)}</span><span class="p-mood">${esc(r.mood)}</span><span class="p-live">● On air now</span></p>
        <h3 class="p-raga"><span class="p-raga-dev" lang="hi">${esc(r.nameDev)}</span><span class="p-raga-lat">Raag ${esc(r.nameLat)}</span></h3>
        <p class="p-sw">${r.swaras.join(' ')} · vadi ${esc(r.vadi)}</p>
        <h4 class="p-title"><span class="p-title-dev" lang="hi">${esc(r.titleDev)}</span><span class="p-title-lat">${esc(r.titleLat)}</span></h4>
        <p class="p-sub">${esc(r.subtitle)}</p>
        <p class="p-sum">${esc(r.summary)}</p>
        <ul class="p-tags">${r.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
        <p class="p-note"><b>RJ’s note</b><span class="p-note-t">${esc(r.note)}</span></p>
      </article>`,
  ).join('\n\n');
}

/** The small cards under the radio. Each one is a real link to that programme's own page. */
function progCards(): string {
  return RAGAS.map(
    (r) => `        <a class="bl-prog" href="/ragas/${r.slug}"><span class="n">${String(r.no).padStart(2, '0')} · ${esc(r.time)}</span><b lang="hi">${esc(r.nameDev)}</b><span class="l">Raag ${esc(r.nameLat)}</span><span class="t">${esc(r.titleLat)}</span><span class="s">${esc(r.subtitle)}</span></a>`,
  ).join('\n');
}

const LEVEL: Record<string, string> = { learning: 'Learning', practising: 'Practising', comfortable: 'Comfortable' };
function toolsHtml(): string {
  return CONFIG.tools
    .map((t) => `<li class="tool"><b>${esc(t.name)}</b><span>${esc(t.use)}</span><em class="lvl l-${t.level}">${LEVEL[t.level] ?? 'Learning'}</em></li>`)
    .join('');
}
function logHtml(): string {
  if (!CONFIG.learning.length) return '<li class="log-empty">The log starts with my first finished practice edit.</li>';
  return CONFIG.learning.map((l) => `<li><time>${esc(l.date)}</time><span>${esc(l.note)}</span></li>`).join('');
}
function lookingHtml(): string {
  const bits: string[] = [];
  if (CONFIG.lookingFor) bits.push(`<b>Looking for:</b> ${esc(CONFIG.lookingFor)}`);
  if (CONFIG.availability) bits.push(`<b>Availability:</b> ${esc(CONFIG.availability)}`);
  return bits.length ? `<p class="bay-look">${bits.join(' · ')}</p>` : '';
}
/** Social links and the showreel. Empty config = nothing shown, and "Showreel · coming soon" where a reel link will go. */
function linksHtml(kind: 'slip' | 'guide' | 'below' | 'edit'): string {
  const out: string[] = [];
  const li = (href: string, label: string) => {
    const cls = kind === 'below' ? ' class="bl-btn ghost"' : '';
    out.push(`<a${cls} href="${esc(href)}" target="_blank" rel="noopener">${label} <span aria-hidden="true">↗</span></a>`);
  };
  li('https://www.linkedin.com/in/om-pansare-934bb2301', 'LinkedIn');
  if (CONFIG.socials.instagram) li(CONFIG.socials.instagram, 'Instagram');
  if (CONFIG.socials.youtube) li(CONFIG.socials.youtube, 'YouTube');
  if (CONFIG.socials.behance) li(CONFIG.socials.behance, 'Behance');
  if (CONFIG.reelUrl) li(CONFIG.reelUrl, 'Showreel');
  else out.push(kind === 'below' ? '<span class="bl-btn ghost" style="cursor:default">Showreel · coming soon</span>' : '<span class="soon">Showreel · coming soon</span>');
  return out.join('\n          ');
}

let cache: string | null = null;

export function buildHomeHtml(): string {
  if (cache) return cache;
  let raw = fs.readFileSync(path.join(process.cwd(), 'src/content/home.html'), 'utf8');
  for (const m of ['<!--@PROGS@-->', '<!--@PROGCARDS@-->', '<!--@TOOLS@-->', '<!--@LOG@-->', '<!--@LOOKING@-->', '<!--@LINKS:slip@-->', '<!--@LINKS:guide@-->', '<!--@LINKS:below@-->', '<!--@LINKS:edit@-->'])
    if (!raw.includes(m)) throw new Error(`home.html lost its ${m} marker`);
  raw = raw
    .replace('<!--@PROGS@-->', progs())
    .replace('<!--@PROGCARDS@-->', progCards())
    .replace('<!--@TOOLS@-->', toolsHtml())
    .replace('<!--@LOG@-->', logHtml())
    .replace('<!--@LOOKING@-->', lookingHtml())
    .replace('<!--@LINKS:slip@-->', linksHtml('slip'))
    .replace('<!--@LINKS:guide@-->', linksHtml('guide'))
    .replace('<!--@LINKS:below@-->', linksHtml('below'))
    .replace('<!--@LINKS:edit@-->', linksHtml('edit'));
  cache = raw;
  return cache;
}

/**
 * Runs before first paint. Does the one layout job the radio engine would otherwise do after load,
 * so the skyline does not jump (keeps Cumulative Layout Shift at 0). Same maths as layout() in engine.ts.
 */
export const PREPAINT = `(function(){try{var w=document.getElementById('wrap');if(!w)return;var H=innerHeight,c=function(v,a,b){return v<a?a:v>b?b:v};var r=w.getBoundingClientRect(),k=Math.round(c(H*.2,110,200)),s=document.documentElement.style;s.setProperty('--deskY',Math.round(c(H*.24,Math.min(130,H*.3),230))+'px');s.setProperty('--sk-h',k+'px');s.setProperty('--sk-top',Math.round(r.top+(window.scrollY||0)+44-k)+'px')}catch(e){}})();`;

/** Window colour from the visitor's local hour, set in <head> before first paint (no flash). Same bands as the site layout. */
export const TOD = `(function(){var h=new Date().getHours(),t=h<5||h>=21?'night':h<8?'dawn':h<16?'day':h<19?'golden':'dusk';document.documentElement.setAttribute('data-tod',t)})();`;
