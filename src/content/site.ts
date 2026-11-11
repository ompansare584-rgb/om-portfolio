/**
 * Single source of truth for who Om is. Every page, the JSON-LD, llms.txt and llms-full.txt read from here.
 * RULE: only facts from Om's own introduction. Never invent employers, projects, metrics or links.
 */
export const PERSON = {
  name: 'Om Pansare',
  jobTitle: 'Aspiring video editor, and first-year B.Tech Computer Science student',
  tagline: 'A curious mind, a creative perspective, and an appreciation for technology, art and meaningful experiences.',
  description:
    'Om Pansare is a beginner video editor learning DaVinci Resolve, Premiere Pro, After Effects, Photoshop and Canva. His portfolio is a vintage radio that tunes to the raga of the hour. First-year B.Tech student at VIT Pune.',
  institution: 'Vishwakarma Institute of Technology (VIT Pune)',
  institutionShort: 'VIT Pune',
  degree: 'Bachelor of Technology (B.Tech), Computer Science Engineering',
  academicYear: 'First year, 2026–27',
  city: 'Pune',
  region: 'Maharashtra',
  country: 'India',
  countryCode: 'IN',
  email: 'ompansare584@gmail.com',
  github: 'https://github.com/ompansare584-rgb',
  githubUser: 'ompansare584-rgb',
  linkedin: 'https://www.linkedin.com/in/om-pansare-934bb2301',
  image: '/images/om-portrait.webp',
  imageAlt: 'Portrait of Om Pansare in a navy suit and blue tie, framed in a thin gold ring',
  interests: [
    'Cinematic storytelling, filmmaking and video editing',
    'Visual composition and thoughtful visual design',
    'Indian classical music and ragas',
    'Gaming and digital culture',
    'Software, artificial intelligence and digital innovation',
    'Flute (as a hobby)',
  ],
  /** Said plainly on purpose. This is Om's own request: no fictional projects, no placeholder achievements. */
  honestStatus:
    'Om has only just started his video-editing journey: no client work, no showreel and no published edits yet. This portfolio will grow as his work does, and he prefers to say that plainly rather than dress up practice as achievement.',
  values:
    'Curious, observant and ambitious. Prefers authenticity and an understated presence, and would rather let his interests and work speak than announce himself.',
} as const;

export const NAV = [
  { href: '/', label: 'Radio', title: 'The radio: tune to the raga of the hour' },
  { href: '/editing', label: 'Edit bay', title: 'Edit bay: tools, reels and how to send a brief' },
  { href: '/ragas', label: 'Programme guide', title: 'All eight programmes on one page' },
] as const;
