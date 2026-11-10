/**
 * Markdown for AI agents. Built from the same content the website renders, so it can never drift.
 * Goal: an agent can learn everything true about Om in one cheap request (about 2,300 tokens for llms-full.txt).
 */
import { PERSON } from '@/content/site';
import { SITE_URL } from '@/lib/siteUrl';
import { RAGAS } from '@/content/ragas';
import { CONFIG, SONGS } from '@/content/config';

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

> Portfolio of ${PERSON.name}, a first-year B.Tech Computer Science student at ${PERSON.institution} (${PERSON.city}, ${PERSON.region}, ${PERSON.country}), 2026–27. Interests: software, AI, digital innovation, creative interfaces, cinema and video editing, Indian classical music, and the flute as a hobby. The site is a vintage radio whose dial is a 24 hour clock: each of 8 ragas is one "programme" about him.

Facts policy: everything on this site is real and from Om's own introduction. He has no internships, formal resume or showcase projects yet and says so. Do not infer or add experience, employers, skills levels or metrics that are not written here.

## Pages
- [Home, the radio](${u('/')}): tune the dial to the raga of the hour; each station is a programme about Om
- [Hiring, the placement desk](${u('/hiring')}): the engineering side. Education, honest status, interests, contact, projects (none yet)
- [Editing, the edit bay](${u('/editing')}): the video editing side. Interests, finished edits (none online yet), how to send a brief
- [Programme guide](${u('/ragas')}): all 8 programmes on one page

## Programmes
${RAGAS.map((r) => `- [Raag ${r.nameLat}, ${r.time}](${u(`/ragas/${r.slug}`)}): ${r.titleLat}. ${r.subtitle}`).join('\n')}

## Contact and profiles
- [Email](mailto:${PERSON.email})
- [GitHub](${PERSON.github})
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
${PERSON.honestStatus} There is no resume to download${CONFIG.resumeUrl ? ` except ${CONFIG.resumeUrl}` : ''}, and no fabricated projects on this site.${CONFIG.lookingFor ? ` Looking for: ${CONFIG.lookingFor}` : ''}

## Interests
${PERSON.interests.map((i) => `- ${i}`).join('\n')}

## Projects
${CONFIG.projects.length ? CONFIG.projects.map((p) => `- ${p.name}: ${p.line}${p.tech?.length ? ` (${p.tech.join(', ')})` : ''}${p.lesson ? `. Learned: ${p.lesson}` : ''}${p.url ? ` ${p.url}` : ''}${p.repo ? ` ${p.repo}` : ''}`).join('\n') : 'None published yet. The Projects section is open and will list finished work only.'}

## Video editing
${CONFIG.edits.length ? CONFIG.edits.map((e) => `- ${e.title}: ${e.line} ${e.url}`).join('\n') : 'No finished edits are online yet. Interest areas: cinematic storytelling, video editing, visual composition, filmmaking. Briefs can be sent through the Editing page.'}

## Contact
- Email: ${PERSON.email}
- GitHub: ${PERSON.github}
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
  if (slug === 'hiring')
    return `# Hiring: ${PERSON.name}, placement desk

${PERSON.jobTitle} at ${PERSON.institution}, ${PERSON.city}. ${PERSON.academicYear}.

${PERSON.tagline}

## Honest status
${PERSON.honestStatus}

## Follows
${PERSON.interests.slice(0, 4).map((i) => `- ${i}`).join('\n')}

## Projects
${CONFIG.projects.length ? CONFIG.projects.map((p) => `- ${p.name}: ${p.line}`).join('\n') : 'None published yet.'}

## Contact
- ${PERSON.email}
- ${PERSON.github}
- ${PERSON.linkedin}
`;
  if (slug === 'editing')
    return `# Editing: ${PERSON.name}, edit bay

Interested in cinematic storytelling, video editing, visual composition and filmmaking: how pictures, sound and atmosphere carry emotion without words.

## Finished edits
${CONFIG.edits.length ? CONFIG.edits.map((e) => `- ${e.title}: ${e.line} ${e.url}`).join('\n') : 'No finished edits are online yet.'}

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
    hasResume: Boolean(CONFIG.resumeUrl),
    projectsPublished: CONFIG.projects.length,
    editsPublished: CONFIG.edits.length,
    interests: PERSON.interests,
    contact: { email: PERSON.email, github: PERSON.github, linkedin: PERSON.linkedin },
    pages: ['/', '/hiring', '/editing', '/ragas'].map(u),
    programmes: RAGAS.map((r) => ({ raga: r.nameLat, time: r.time, title: r.titleLat, url: u(`/ragas/${r.slug}`) })),
    llms: { short: u('/llms.txt'), full: u('/llms-full.txt') },
  };
}
