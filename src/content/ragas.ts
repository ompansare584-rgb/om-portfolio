/**
 * The 8 programmes (ragas). Every programme is about Om's video-editing journey. He has only just started, so the text describes what he is learning and what he cares about, never finished client work. Nothing is invented.
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
    "titleLat": "Raat Ka Cut",
    "titleDev": "रात का कट",
    "subtitle": "The late-hour bulletin on cutting: the first assembly.",
    "summary": "Every edit starts the same way: a pile of clips and an empty timeline. I am learning to sort footage, pick the best take and build a rough cut that tells the story before anything is polished.",
    "tags": [
      "Rough cut",
      "Assembly",
      "Timeline"
    ],
    "note": "I have only just started editing, so I treat every rough cut as practice. The first goal is a story that holds together. Looking good comes second."
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
    "titleLat": "Pehla Frame",
    "titleDev": "पहला फ्रेम",
    "subtitle": "The dawn bulletin: who is behind the cuts.",
    "summary": "I am Om, a first-year B.Tech student at VIT Pune, and I have just started learning video editing. I do not have a showreel yet and I will not pretend otherwise. This portfolio grows as my work does.",
    "tags": [
      "Beginner",
      "Honest status",
      "Learning in public"
    ],
    "note": "I would rather let the work speak than announce myself. So the first frame is an honest one: I am at the start, and I am learning on purpose."
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
    "titleLat": "Saaf Cut",
    "titleDev": "साफ़ कट",
    "subtitle": "The morning bulletin on clean, simple fundamentals.",
    "summary": "Before effects and tricks come the basics: where to cut, how long to hold a shot, how a sound can lead the picture. These are the fundamentals I am studying first, with simple practice edits.",
    "tags": [
      "Pacing",
      "Transitions",
      "Fundamentals"
    ],
    "note": "A clean cut is invisible. That is the standard I am practising towards, one small edit at a time."
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
    "titleLat": "Rang Tarang",
    "titleDev": "रंग तरंग",
    "subtitle": "The mid-morning bulletin on colour and mood.",
    "summary": "Colour is mood. DaVinci Resolve is built around grading, so it is where I am learning how contrast, white balance and a consistent look can turn plain footage into a feeling.",
    "tags": [
      "Colour grading",
      "DaVinci Resolve",
      "Mood"
    ],
    "note": "The Raw to graded slider in the Edit bay is a small demo I made on this room’s own skyline. It is a practice piece, not a client job."
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
    "titleLat": "Chalti Tasveer",
    "titleDev": "चलती तस्वीर",
    "subtitle": "The noon bulletin on motion and titles.",
    "summary": "After Effects is on my learning list for animated titles, lower thirds and small motion touches that make an edit feel finished. I am starting with the basics.",
    "tags": [
      "After Effects",
      "Motion graphics",
      "Titles"
    ],
    "note": "I notice small details in interfaces and games, and motion design is where that eye for detail can go to work. I am a beginner here and I am glad to be one."
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
    "subtitle": "The afternoon bulletin on cinematic storytelling.",
    "summary": "Cinema is what pulled me towards editing. I am studying how a scene is built: framing, rhythm, reaction shots and silence. Premiere Pro is the timeline where I practise putting that into a cut.",
    "tags": [
      "Storytelling",
      "Premiere Pro",
      "Cinema"
    ],
    "note": "I am drawn to how pictures, sound and atmosphere can carry an emotion without needing words. That is the kind of edit I want to make."
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
    "titleLat": "Sur Ke Saath Cut",
    "titleDev": "सुर के साथ कट",
    "subtitle": "The evening bulletin on cutting to music and sound.",
    "summary": "I love Indian classical music and play the flute as a hobby, so I listen for rhythm before I look at pictures. I want my cuts to land with the music, and I am learning how sound and music carry a scene.",
    "tags": [
      "Music sync",
      "Sound",
      "Indian classical",
      "Flute"
    ],
    "note": "A raga has a mood and a tempo, and so does an edit. Learning to feel one helps me with the other."
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
    "titleLat": "Pehli Nazar",
    "titleDev": "पहली नज़र",
    "subtitle": "The night desk for stills: thumbnails, posters and covers.",
    "summary": "Most people meet a video through its thumbnail. Photoshop and Canva are the tools I am learning for thumbnails, posters and covers that match the mood of the edit.",
    "tags": [
      "Photoshop",
      "Canva",
      "Thumbnails"
    ],
    "note": "The still image is the first impression of a video. I want it to look as considered as the cut itself."
  }
];

export const RAGA_BY_SLUG: Record<string, Raga> = Object.fromEntries(RAGAS.map((r) => [r.slug, r]));

/** Index 0..7 of the programme on air at a given local hour (0..24). */
export const ragaIndexForHour = (h: number) => Math.min(7, Math.max(0, Math.floor(h / 3)));
