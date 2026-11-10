import fs from 'node:fs';
import path from 'node:path';
import { RAGAS } from '@/content/ragas';

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

let cache: string | null = null;

export function buildHomeHtml(): string {
  if (cache) return cache;
  const raw = fs.readFileSync(path.join(process.cwd(), 'src/content/home.html'), 'utf8');
  if (!raw.includes('<!--@PROGS@-->')) throw new Error('home.html lost its <!--@PROGS@--> marker');
  cache = raw.replace('<!--@PROGS@-->', progs());
  return cache;
}

/**
 * Runs before first paint. Does the one layout job the radio engine would otherwise do after load,
 * so the skyline does not jump (keeps Cumulative Layout Shift at 0). Same maths as layout() in engine.ts.
 */
export const PREPAINT = `(function(){try{var w=document.getElementById('wrap');if(!w)return;var H=innerHeight,c=function(v,a,b){return v<a?a:v>b?b:v};var r=w.getBoundingClientRect(),k=Math.round(c(H*.2,110,200)),s=document.documentElement.style;s.setProperty('--deskY',Math.round(c(H*.24,Math.min(130,H*.3),230))+'px');s.setProperty('--sk-h',k+'px');s.setProperty('--sk-top',Math.round(r.top+44-k)+'px')}catch(e){}})();`;
