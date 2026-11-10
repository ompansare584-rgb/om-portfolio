/**
 * The 8 programmes (ragas). Every word here comes from Om's own introduction. Nothing is invented.
 * Raga hours follow common textbook convention and vary by gharana.
 * Notation: capital = shuddha, lowercase r g d n = komal, M# = tivra Ma.
 */
export type Raga = {
  slug: string;
  index: number;
  no: number;
  nameLat: string;
  nameDev: string;
  dialLat: string;
  dialDev: string;
  hourStart: number;
  hourEnd: number;
  time: string;
  mood: string;
  swaras: string[];
  vadi: string;
  vadiKey: string;
  titleLat: string;
  titleDev: string;
  subtitle: string;
  summary: string;
  tags: string[];
  note: string;
};

export const RAGAS: Raga[] = [
  {
    "slug": "malkauns",
    "index": 0,
    "no": 1,
    "nameLat": "Malkauns",
    "nameDev": "मालकौंस",
    "dialLat": "Malkauns",
    "dialDev": "मालकौंस",
    "hourStart": 0,
    "hourEnd": 3,
    "time": "12 – 3 AM",
    "mood": "Still, deep",
    "swaras": [
      "S",
      "g",
      "M",
      "d",
      "n"
    ],
    "vadi": "Ma",
    "vadiKey": "M",
    "titleLat": "Raat Ka Khel",
    "titleDev": "रात का खेल",
    "subtitle": "The late-hour bulletin on games and digital worlds.",
    "summary": "Games are interactive worlds that someone designed on purpose. I enjoy the environments, the rules and the creativity behind them, and the wider digital culture that grows around them.",
    "tags": [
      "Gaming",
      "Digital culture",
      "Interactive worlds"
    ],
    "note": "I’m drawn to interactive experiences that have an identity of their own, and I notice the small details that make them memorable. That eye for detail is what I want to bring to the things I build."
  },
  {
    "slug": "bhairav",
    "index": 1,
    "no": 2,
    "nameLat": "Bhairav",
    "nameDev": "भैरव",
    "dialLat": "Bhairav",
    "dialDev": "भैरव",
    "hourStart": 3,
    "hourEnd": 6,
    "time": "3 – 6 AM",
    "mood": "Devotional dawn",
    "swaras": [
      "S",
      "r",
      "G",
      "M",
      "P",
      "d",
      "N"
    ],
    "vadi": "Dha",
    "vadiKey": "d",
    "titleLat": "Pehli Kiran",
    "titleDev": "पहली किरण",
    "subtitle": "The first bulletin of the day: who is behind the dial.",
    "summary": "I’m Om Pansare, a first-year B.Tech Computer Science student in Pune. Curious, observant and ambitious, and happiest where technology meets creativity.",
    "tags": [
      "Computer Science",
      "Pune",
      "Curious & creative"
    ],
    "note": "Namaste, I’m Om, and I’d rather let my interests and my work speak than announce myself. In a few words: a curious mind, a creative perspective, and an appreciation for technology, art and meaningful experiences."
  },
  {
    "slug": "bilaval",
    "index": 2,
    "no": 3,
    "nameLat": "Bilaval",
    "nameDev": "बिलावल",
    "dialLat": "Bilaval",
    "dialDev": "बिलावल",
    "hourStart": 6,
    "hourEnd": 9,
    "time": "6 – 9 AM",
    "mood": "Bright, clean",
    "swaras": [
      "S",
      "R",
      "G",
      "M",
      "P",
      "D",
      "N"
    ],
    "vadi": "Dha",
    "vadiKey": "D",
    "titleLat": "Campus Bulletin",
    "titleDev": "कैंपस बुलेटिन",
    "subtitle": "Where I study, and where I honestly stand.",
    "summary": "B.Tech in Computer Science Engineering at Vishwakarma Institute of Technology (VIT Pune), Maharashtra. First year, academic year 2026–27.",
    "tags": [
      "VIT Pune",
      "B.Tech CSE",
      "2026–27"
    ],
    "note": "I’m at the very start of my professional journey: no internships, no formal resume and no showcase projects yet. I’d rather tell you that plainly than dress up unfinished experiments as achievements."
  },
  {
    "slug": "todi",
    "index": 3,
    "no": 4,
    "nameLat": "Todi",
    "nameDev": "तोड़ी",
    "dialLat": "Todi",
    "dialDev": "तोड़ी",
    "hourStart": 9,
    "hourEnd": 12,
    "time": "9 AM – 12 PM",
    "mood": "Intense, focused",
    "swaras": [
      "S",
      "r",
      "g",
      "M#",
      "P",
      "d",
      "N"
    ],
    "vadi": "Dha",
    "vadiKey": "d",
    "titleLat": "Tech Tarang",
    "titleDev": "टेक तरंग",
    "subtitle": "Software, AI and the ideas behind them.",
    "summary": "I follow software, artificial intelligence and digital innovation closely: how technology solves problems, creates experiences and turns ordinary ideas into something extraordinary.",
    "tags": [
      "Software",
      "Artificial intelligence",
      "Digital innovation"
    ],
    "note": "I enjoy understanding how things work and trying out new concepts. I won’t call an experiment finished work until it is, so here you’ll find curiosity, not inflated claims."
  },
  {
    "slug": "brindavani-sarang",
    "index": 4,
    "no": 5,
    "nameLat": "Brindavani Sarang",
    "nameDev": "वृंदावनी सारंग",
    "dialLat": "Sarang",
    "dialDev": "सारंग",
    "hourStart": 12,
    "hourEnd": 15,
    "time": "12 – 3 PM",
    "mood": "Sun-bleached noon",
    "swaras": [
      "S",
      "R",
      "M",
      "P",
      "n"
    ],
    "vadi": "Re",
    "vadiKey": "R",
    "titleLat": "Design Dopahar",
    "titleDev": "डिज़ाइन दोपहर",
    "subtitle": "Interfaces, atmosphere and small details.",
    "summary": "Thoughtful visual design, immersive digital experiences and creative interfaces: the small details that make something memorable and give it an identity of its own.",
    "tags": [
      "Visual design",
      "Creative interfaces",
      "Immersive experiences"
    ],
    "note": "I’m drawn to work with its own identity rather than conventional patterns. Technology gives me possibilities to explore, and creativity gives them individuality and expression."
  },
  {
    "slug": "bhimpalasi",
    "index": 5,
    "no": 6,
    "nameLat": "Bhimpalasi",
    "nameDev": "भीमपलासी",
    "dialLat": "Bhimpalasi",
    "dialDev": "भीमपलासी",
    "hourStart": 15,
    "hourEnd": 18,
    "time": "3 – 6 PM",
    "mood": "Golden, longing",
    "swaras": [
      "S",
      "R",
      "g",
      "M",
      "P",
      "D",
      "n"
    ],
    "vadi": "Ma",
    "vadiKey": "M",
    "titleLat": "Matinee Show",
    "titleDev": "मैटिनी शो",
    "subtitle": "Cinema, editing and the language of images.",
    "summary": "Cinematic storytelling, filmmaking, video editing and visual composition: how visuals, sound and atmosphere carry emotion without needing words.",
    "tags": [
      "Filmmaking",
      "Video editing",
      "Visual composition"
    ],
    "note": "I love how a frame, a sound and a mood can say what words can’t. I’d like the things I build to carry that same feeling."
  },
  {
    "slug": "yaman",
    "index": 6,
    "no": 7,
    "nameLat": "Yaman",
    "nameDev": "यमन",
    "dialLat": "Yaman",
    "dialDev": "यमन",
    "hourStart": 18,
    "hourEnd": 21,
    "time": "6 – 9 PM",
    "mood": "Serene dusk",
    "swaras": [
      "S",
      "R",
      "G",
      "M#",
      "P",
      "D",
      "N"
    ],
    "vadi": "Ga",
    "vadiKey": "G",
    "titleLat": "Raag Darshan",
    "titleDev": "राग दर्शन",
    "subtitle": "A closer look at Indian classical music.",
    "summary": "The world of ragas: their depth, structure, emotional expression and cultural heritage. Each raga evokes its own mood, and each one has its own hour of the day.",
    "tags": [
      "Indian classical music",
      "Ragas",
      "Mood and structure"
    ],
    "note": "The way different ragas evoke different emotions is what draws me to them. This radio is my small way of tuning a portfolio to that idea."
  },
  {
    "slug": "bihag",
    "index": 7,
    "no": 8,
    "nameLat": "Bihag",
    "nameDev": "बिहाग",
    "dialLat": "Bihag",
    "dialDev": "बिहाग",
    "hourStart": 21,
    "hourEnd": 24,
    "time": "9 PM – 12 AM",
    "mood": "Tender night",
    "swaras": [
      "S",
      "R",
      "G",
      "M",
      "M#",
      "P",
      "D",
      "N"
    ],
    "vadi": "Ga",
    "vadiKey": "G",
    "titleLat": "Meri Bansuri",
    "titleDev": "मेरी बांसुरी",
    "subtitle": "The night shift of this station: my flute.",
    "summary": "I play the flute as a hobby, for the joy of it. It is the quiet, personal side of this station, alongside my love of Indian classical music.",
    "tags": [
      "Flute",
      "Hobby",
      "Music"
    ],
    "note": "I play the flute as a hobby, for the love of it. Alongside code, cinema and ragas, it’s one more way I express myself."
  }
];

export const RAGA_BY_SLUG: Record<string, Raga> = Object.fromEntries(RAGAS.map((r) => [r.slug, r]));

/** Index 0..7 of the programme on air at a given local hour (0..24). */
export const ragaIndexForHour = (h: number) => Math.min(7, Math.max(0, Math.floor(h / 3)));
