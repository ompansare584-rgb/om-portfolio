/**
 * THE FILE OM EDITS. Everything here is optional and starts empty or honest.
 * Fill things in as they become real. Never add something that is not true.
 */
export type Project = {
  name: string;
  line: string;
  tech?: string[];
  url?: string; // live link
  repo?: string; // GitHub link
  lesson?: string; // one real thing learned
};
export type EditItem = { title: string; line: string; url: string; thumb?: string };
export type Song = {
  title: string;
  film: string;
  year: number;
  singers: string[];
  composer: string;
  url: string; // link only. Never lyrics, never embedded audio
  /** true only when the raga of the song is confirmed from a reliable source */
  ragaVerified: boolean;
};

export const CONFIG = {
  /** Put a file in /public (e.g. '/resume.pdf') or a web address. Empty = "coming soon". */
  resumeUrl: '',
  /** Formspree form address for the postcard and the edit brief. Empty = opens the visitor's mail app. */
  formspree: process.env.NEXT_PUBLIC_FORMSPREE_URL || '',
  /** One honest line shown on the Hiring page, e.g. 'An internship where I can learn on real projects.' */
  lookingFor: '',
  /** Finished projects only. Example: { name: '', line: '', tech: ['HTML'], url: '', repo: '', lesson: '' } */
  projects: [] as Project[],
  /** Finished edits, one per frame on the film strip. Links only. */
  edits: [] as EditItem[],
  /** Tools you really use, e.g. ['HTML', 'CSS', 'JavaScript', 'Git']. */
  tools: [] as string[],
  /** Tanpura Sa in Hz. The flute plays one octave higher. D3 = 146.83. Change this ONE number to match your flute. */
  saHz: 146.83,
  /** Optional recordings. Put mp3 files in /public/audio and write the path, e.g. '/audio/bihag.mp3'. Empty = the synth plays. */
  audio: {
    signOn: '',
    signOff: '',
    tanpura: '',
    phrases: {} as Record<string, string>,
  },
} as const;

/**
 * One old film song per programme. Link only.
 * ragaVerified is false where the raga of the song is NOT confirmed yet. The site then says "to be confirmed"
 * instead of claiming it. Ask your flute teacher or search "[song] raga", then flip it to true.
 */
export const SONGS: Record<string, Song> = {
  malkauns: { title: 'Man Tarpat Hari Darshan Ko Aaj', film: 'Baiju Bawra', year: 1952, singers: ['Mohammed Rafi'], composer: 'Naushad', url: 'https://www.youtube.com/results?search_query=Man+Tarpat+Hari+Darshan+Ko+Aaj', ragaVerified: false },
  bhairav: { title: 'Jaago Mohan Pyare', film: 'Jagte Raho', year: 1956, singers: ['Lata Mangeshkar'], composer: 'Salil Chowdhury', url: 'https://www.youtube.com/results?search_query=Jaago+Mohan+Pyare+Jagte+Raho', ragaVerified: false },
  bilaval: { title: 'Ek Pyar Ka Nagma Hai', film: 'Shor', year: 1972, singers: ['Lata Mangeshkar', 'Mukesh'], composer: 'Laxmikant-Pyarelal', url: 'https://www.youtube.com/results?search_query=Ek+Pyar+Ka+Nagma+Hai+Shor', ragaVerified: false },
  todi: { title: 'Duniya Na Bhaye Mohe', film: 'Basant Bahar', year: 1956, singers: ['Mohammed Rafi'], composer: 'Shankar-Jaikishan', url: 'https://www.youtube.com/results?search_query=Duniya+Na+Bhaye+Mohe+Basant+Bahar', ragaVerified: false },
  'brindavani-sarang': { title: 'Jadugar Saiyan', film: 'Nagin', year: 1954, singers: ['Lata Mangeshkar'], composer: 'Hemant Kumar', url: 'https://www.youtube.com/results?search_query=Jadugar+Saiyan+Nagin+1954', ragaVerified: false },
  bhimpalasi: { title: 'Nainon Mein Badra Chhaye', film: 'Mera Saaya', year: 1966, singers: ['Lata Mangeshkar'], composer: 'Madan Mohan', url: 'https://www.youtube.com/results?search_query=Nainon+Mein+Badra+Chhaye', ragaVerified: true },
  yaman: { title: 'Abhi Na Jao Chhod Kar', film: 'Hum Dono', year: 1961, singers: ['Mohammed Rafi', 'Asha Bhosle'], composer: 'Jaidev', url: 'https://www.youtube.com/results?search_query=Abhi+Na+Jao+Chhod+Kar+Hum+Dono', ragaVerified: false },
  bihag: { title: 'Tere Sur Aur Mere Geet', film: 'Goonj Uthi Shehnai', year: 1959, singers: ['Lata Mangeshkar'], composer: 'Vasant Desai', url: 'https://www.youtube.com/results?search_query=Tere+Sur+Aur+Mere+Geet', ragaVerified: false },
};
