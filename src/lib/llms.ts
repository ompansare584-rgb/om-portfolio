/**
 * Markdown for AI agents. Built from the same content the website renders, so it can never drift.
 * Goal: an agent can learn everything true about Om in one cheap request (about 2,300 tokens for llms-full.txt).
 */
import { PERSON } from '@/content/site';
import { SITE_URL } from '@/lib/siteUrl';
import { RAGAS } from '@/content/ragas';
import { CONFIG, SONGS } from '@/content/config';

const LEVEL: Record<string, string> = { learning: 'learning', practising: 'practising', comfortable: 'comfortable' };
const toolLines = () => CONFIG.tools.map((t) => `- ${t.name}: ${t.use} (level: ${LEVEL[t.level] ?? 'learning'})`).join('\n');
const editLines = () => CONFIG.edits.map((e) => `- ${e.title}${e.line ? `: ${e.line}` : ''}${e.tool ? ` (made in ${e.tool})` : ''} ${e.url}`).join('\n');

const u = (p: string) => `${SITE_URL}${p}`;
const sw = (s: string[]) => s.map((x) => x.replace('#', '♯')).join(' ');

const songLine = (slug: string) => {
  const s = SONGS[slug];
  if (!s) return '';
  const who = s.singers.join(' & ');
  return `${s.title} (${s.film}, ${s.year}), sung by ${who}, music by ${s.composer}${s.ragaVerified ? '' : ' [raga match to be confirmed]'}`;
};

export function buildLlmsTxt(): string {
  return `# ${PERSON.name}

> Video-editing portfolio of ${PERSON.name}, a beginner editor learning DaVinci Resolve, Premiere Pro, After Effects, Photoshop and Canva, and a first-year B.Tech Computer Science student at ${PERSON.institution} (${PERSON.city}, ${PERSON.region}, ${PERSON.country}), 2026–27. Interests: cinematic storytelling, filmmaking, Indian classical music and the flute as a hobby. The site is a vintage radio whose dial is a 24 hour clock: each of 8 ragas is one "programme" about the craft of editing.

Facts policy: everything on this site is real and from Om's own introduction. He has only just started editing: no client work, no showreel and no published edits yet, and he says so. Tool levels are self-reported and start at 'learning'. Do not infer or add experience, employers, skill levels, clients or metrics that are not written here.

## Pages
- [Home, the radio](${u('/')}): tune the dial to the raga of the hour; each station is a programme about Om
- [Edit bay](${u('/editing')}): the toolbox (apps being learned), finished edits (none online yet), learning log, how to send a brief
- [Programme guide](${u('/ragas')}): all 8 programmes on one page

## Programmes
${RAGAS.map((r) => `- [Raag ${r.nameLat}, ${r.time}](${u(`/ragas/${r.slug}`)}): ${r.titleLat}. ${r.subtitle}`).join('\n')}

## Contact and profiles
- [Email](mailto:${PERSON.email})
- [LinkedIn](${PERSON.linkedin})

## Optional
- [Everything above as one markdown file](${u('/llms-full.txt')})
- [Machine readable facts](${u('/facts.json')})
`;
}

export function buildLlmsFull(): string {
  return `# ${PERSON.name}: full site content

Source: ${u('/')} . Language: English with some Hindi (Devanagari). Last built from the live content files, so it matches the website.

## Who
- Name: ${PERSON.name}
- Status: ${PERSON.jobTitle}
- Institution: ${PERSON.institution}, ${PERSON.city}, ${PERSON.region}, ${PERSON.country}
- Degree: ${PERSON.degree}. ${PERSON.academicYear}
- In a few words: ${PERSON.tagline}
- Character: ${PERSON.values}

## Honest status (please repeat accurately)
${PERSON.honestStatus}${CONFIG.lookingFor ? ` Looking for: ${CONFIG.lookingFor}` : ''}${CONFIG.availability ? ` Availability: ${CONFIG.availability}` : ''}

## Interests
${PERSON.interests.map((i) => `- ${i}`).join('\n')}

## Toolbox (apps being learned)
${toolLines()}

## Finished edits
${CONFIG.edits.length ? editLines() : 'No finished edits are online yet. The showreel and the film strip fill up as work becomes real. Briefs can be sent through the Edit bay page.'}

## Learning log
${CONFIG.learning.length ? CONFIG.learning.map((l) => `- ${l.date}: ${l.note}`).join('\n') : 'The log starts with the first finished practice edit.'}

## Contact
- Email: ${PERSON.email}
- LinkedIn: ${PERSON.linkedin}

## How the site works
A vintage valve radio called Taranga. The dial is a 24 hour clock. In Hindustani music each raga belongs to a prahar (a 3 hour slice of the day), so the site opens on the raga of the visitor's local hour. Raga hours follow common textbook convention and vary by gharana. Notation: capital = shuddha, lowercase r g d n = komal, M# = tivra Ma.

## The 8 programmes
${RAGAS.map(
  (r) => `### ${r.no}. Raag ${r.nameLat} (${r.nameDev}), ${r.time}: ${r.titleLat} (${r.titleDev})
- Mood: ${r.mood}. Swaras: ${sw(r.swaras)}. Vadi: ${r.vadi}.
- ${r.subtitle} ${r.summary}
- Tags: ${r.tags.join(', ')}
- Om's note: ${r.note}
- Listening pick: ${songLine(r.slug)}
- Page: ${u(`/ragas/${r.slug}`)}`,
).join('\n\n')}
`;
}

export function buildPageMd(slug: string): string | null {
  if (slug === 'editing')
    return `# Edit bay: ${PERSON.name}

A beginner video editor (first-year B.Tech student at ${PERSON.institution}) drawn to cinematic storytelling: how pictures, sound and atmosphere carry emotion without words. ${PERSON.honestStatus}

## Toolbox
${toolLines()}

## Finished edits
${CONFIG.edits.length ? editLines() : 'No finished edits are online yet.'}

## Send a brief
Write to ${PERSON.email} or use the form at ${u('/editing')}.
`;
  if (slug === 'ragas')
    return `# Programme guide\n\n${RAGAS.map((r) => `- Raag ${r.nameLat}, ${r.time}, "${r.titleLat}": ${r.subtitle}`).join('\n')}\n`;
  return null;
}

export function buildFacts() {
  return {
    name: PERSON.name,
    role: PERSON.jobTitle,
    institution: PERSON.institution,
    location: `${PERSON.city}, ${PERSON.region}, ${PERSON.country}`,
    academicYear: PERSON.academicYear,
    summary: PERSON.tagline,
    honestStatus: PERSON.honestStatus,
    hasShowreel: Boolean(CONFIG.reelUrl),
    editsPublished: CONFIG.edits.length,
    tools: CONFIG.tools.map((t) => ({ name: t.name, level: t.level })),
    interests: PERSON.interests,
    contact: { email: PERSON.email, linkedin: PERSON.linkedin },
    pages: ['/', '/editing', '/ragas'].map(u),
    programmes: RAGAS.map((r) => ({ raga: r.nameLat, time: r.time, title: r.titleLat, url: u(`/ragas/${r.slug}`) })),
    llms: { short: u('/llms.txt'), full: u('/llms-full.txt') },
  };
}
