/**
 * Single source of truth for who Om is. Every page, the JSON-LD, llms.txt and llms-full.txt read from here.
 * RULE: only facts from Om's own introduction. Never invent employers, projects, metrics or links.
 */
export const PERSON = {
  name: 'Om Pansare',
  jobTitle: 'First-year B.Tech Computer Science Engineering student',
  tagline: 'A curious mind, a creative perspective, and an appreciation for technology, art and meaningful experiences.',
  description:
    'Om Pansare is a first-year B.Tech Computer Science student at VIT Pune who loves technology, design, cinema, ragas and the flute. Tune the dial: every hour has its raga.',
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
    'Software',
    'Artificial intelligence',
    'Digital innovation',
    'Creative interfaces and visual design',
    'Cinematic storytelling, filmmaking and video editing',
    'Indian classical music and ragas',
    'Gaming and digital culture',
    'Flute (as a hobby)',
  ],
  /** Said plainly on purpose. This is Om's own request: no fictional projects, no placeholder achievements. */
  honestStatus:
    'Om is at the very start of his professional journey: no internships, no formal resume and no showcase projects yet. He prefers to say that plainly rather than present unfinished experiments as achievements.',
  values:
    'Curious, observant and ambitious. Prefers authenticity and an understated presence, and would rather let his interests and work speak than announce himself.',
} as const;

export const NAV = [
  { href: '/', label: 'Radio', title: 'The radio: tune to the raga of the hour' },
  { href: '/hiring', label: 'Hiring', title: 'Placement desk: the engineering side' },
  { href: '/editing', label: 'Editing', title: 'Edit bay: the video editing side' },
  { href: '/ragas', label: 'Programme guide', title: 'All eight programmes on one page' },
] as const;
