/**
 * THE FILE OM EDITS. Everything here is optional and starts empty or honest.
 * Fill things in as they become real. Never add something that is not true.
 */
export type Level = 'learning' | 'practising' | 'comfortable';
export type Tool = {
  name: string;
  /** what you use it for, in plain words */
  use: string;
  /** be honest: change this only when it is true. 'learning' is where everyone starts. */
  level: Level;
};
export type EditItem = {
  title: string;
  /** one line: what it is */
  line?: string;
  /** link only: YouTube (unlisted is fine), Instagram, Google Drive... */
  url: string;
  /** optional thumbnail path in /public, e.g. '/images/first-cut.webp' */
  thumb?: string;
  /** which app you used, e.g. 'DaVinci Resolve' */
  tool?: string;
};
export type LogItem = { date: string; note: string };
export type Song = {
  title: string;
  film: string;
  year: number;
  singers: string[];
  composer: string;
  /** the raga the song is based on */
  raga: string;
  url: string; // link only. Never lyrics, never embedded audio
  /** true only when the raga of the song is confirmed from a reliable source */
  ragaVerified: boolean;
};

export const CONFIG = {
  /** A link to your showreel (YouTube, Drive, Instagram...). Empty = "Showreel · coming soon". */
  reelUrl: '',
  /** Social links. Leave empty until the profile is real and has something on it. */
  socials: {
    instagram: '',
    youtube: '',
    behance: '',
  },
  /** Formspree form address for the brief and the postcard. Empty = opens the visitor's mail app. */
  formspree: process.env.NEXT_PUBLIC_FORMSPREE_URL || '',
  /** One honest line, e.g. 'Short reels and small projects while I learn.' Empty = hidden. */
  lookingFor: '',
  /** e.g. 'Open for small projects after college hours'. Empty = hidden. */
  availability: '',
  /**
   * The apps you are learning. Everything starts at 'learning', which is true today.
   * Change a level only when it is true, e.g. level: 'practising' once you have finished a few edits in it.
   */
  tools: [
    { name: 'DaVinci Resolve', use: 'Cutting, colour grading and sound', level: 'learning' },
    { name: 'Premiere Pro', use: 'Cutting and storytelling on the timeline', level: 'learning' },
    { name: 'After Effects', use: 'Motion graphics and animated titles', level: 'learning' },
    { name: 'Photoshop', use: 'Thumbnails, posters and cover images', level: 'learning' },
    { name: 'Canva', use: 'Quick graphics and social posts', level: 'learning' },
  ] as Tool[],
  /** Finished edits, one per frame on the film strip. Links only. Empty = honest empty strip. */
  edits: [] as EditItem[],
  /**
   * A learning log: short true notes about what you tried. Newest first.
   * Example: { date: 'Nov 2026', note: 'Finished my first 30-second cut in DaVinci Resolve.' }
   */
  learning: [] as LogItem[],
  /** Tanpura Sa in Hz. The flute plays one octave higher. D3 = 146.83. Change this ONE number to match your flute. */
  saHz: 146.83,
  /** Optional recordings. Put mp3 files in /public/audio and write the path, e.g. '/audio/bihag.mp3'. Empty = the synth plays. */
  audio: {
    signOn: '',
    signOff: '',
    tanpura: '',
    phrases: {} as Record<string, string>,
  },
};

/**
 * One old film song per programme (link only, never lyrics, never embedded audio).
 * Ragas below were checked against published lists of film songs by raga (Wikipedia "List of film songs based on Hindustani ragas",
 * songsofyore.com, notesandsargam.com). Bilaval is left empty on purpose: no song was confirmed for it yet. The site then says
 * "Farmaish pending" instead of guessing. Ask your flute teacher to double-check, then fill it in.
 */
export const SONGS: Record<string, Song> = {
  malkauns: { title: 'Man Tarpat Hari Darshan Ko Aaj', film: 'Baiju Bawra', year: 1952, singers: ['Mohammed Rafi'], composer: 'Naushad', raga: 'Malkauns', url: 'https://www.youtube.com/results?search_query=Man+Tarpat+Hari+Darshan+Ko+Aaj+Baiju+Bawra', ragaVerified: true },
  bhairav: { title: 'Jaago Mohan Pyare', film: 'Jagte Raho', year: 1956, singers: ['Lata Mangeshkar'], composer: 'Salil Chowdhury', raga: 'Bhairav', url: 'https://www.youtube.com/results?search_query=Jaago+Mohan+Pyare+Jagte+Raho', ragaVerified: true },
  todi: { title: 'Duniya Na Bhaye Mohe', film: 'Basant Bahar', year: 1956, singers: ['Mohammed Rafi'], composer: 'Shankar-Jaikishan', raga: 'Todi (Bilaskhani Todi)', url: 'https://www.youtube.com/results?search_query=Duniya+Na+Bhaye+Mohe+Basant+Bahar', ragaVerified: true },
  'brindavani-sarang': { title: 'Jadugar Saiyan', film: 'Nagin', year: 1954, singers: ['Lata Mangeshkar'], composer: 'Hemant Kumar', raga: 'Brindavani Sarang', url: 'https://www.youtube.com/results?search_query=Jadugar+Saiyan+Nagin+1954', ragaVerified: true },
  bhimpalasi: { title: 'Nainon Mein Badra Chhaye', film: 'Mera Saaya', year: 1966, singers: ['Lata Mangeshkar'], composer: 'Madan Mohan', raga: 'Bhimpalasi', url: 'https://www.youtube.com/results?search_query=Nainon+Mein+Badra+Chhaye', ragaVerified: true },
  yaman: { title: 'Abhi Na Jao Chhod Kar', film: 'Hum Dono', year: 1961, singers: ['Mohammed Rafi', 'Asha Bhosle'], composer: 'Jaidev', raga: 'Yaman', url: 'https://www.youtube.com/results?search_query=Abhi+Na+Jao+Chhod+Kar+Hum+Dono', ragaVerified: true },
  bihag: { title: 'Tere Sur Aur Mere Geet', film: 'Goonj Uthi Shehnai', year: 1959, singers: ['Lata Mangeshkar'], composer: 'Vasant Desai', raga: 'Bihag', url: 'https://www.youtube.com/results?search_query=Tere+Sur+Aur+Mere+Geet+Goonj+Uthi+Shehnai', ragaVerified: true },
};
