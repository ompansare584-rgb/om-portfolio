# MASTER PROMPT: Raag Radio, the video-editing portfolio (Om Pansare)

How to use: open a new chat with Claude (or Claude Code), attach this file and, if you have them, the project folder plus your portrait, then paste ONLY the block under "THE PROMPT". Everything Claude needs is inside it: the idea, your real facts, every decision we made, the stack, the SEO and AI-readability layer, the Lighthouse rules and the order of work. Keep this file updated whenever something real changes (an edit, a tool level, a reel, a recording).

Rebuild modes (say which one at the top of your message):
- BUILD FROM SCRATCH: build everything below with no existing code.
- REBUILD OVER THE PROJECT: keep `src/content/*` and `legacy-v1/`, redo design and code.
- CHANGE ONE THING: leave everything else exactly as it is.

---

## THE PROMPT (copy from here to the end)

### 0. ROLE AND QUALITY BAR
You are a senior creative developer, sound designer and technical-SEO engineer. Build or rebuild my VIDEO-EDITING portfolio "Raag Radio" so that people screen-record and share it, clients and collaborators get what they need in ten seconds, search engines and AI assistants read it cheaply and accurately, and Google Lighthouse scores 100 where it can. Stability beats spectacle: if a flourish could break the page, load late or be skipped, make it optional and lazy. Do not ask me questions. Decide, state the decision in one line, and keep going. At the end, list every item I still have to fill in.

### 1. WHO I AM (only these facts exist)
- Om Pansare. A beginner video editor, and a first-year B.Tech Computer Science Engineering student at Vishwakarma Institute of Technology (VIT Pune), Pune, Maharashtra, India. Academic year 2026-27. Timezone IST.
- Curious, observant, ambitious, creative. I like where technology and creativity meet. I prefer work to speak louder than announcements, dislike exaggerated self-presentation, and want to be shown honestly.
- In a few words: "A curious mind, a creative perspective, and an appreciation for technology, art and meaningful experiences."
- Interests: cinematic storytelling, filmmaking, video editing, visual composition; Indian classical music and ragas; gaming and digital culture; software, AI and digital innovation. I play the flute as a hobby. Never state how many years.
- Tools I am LEARNING (all start at level "learning", changed only in config when true): DaVinci Resolve, Adobe Premiere Pro, Adobe After Effects, Adobe Photoshop, Canva.
- Links: LinkedIn https://www.linkedin.com/in/om-pansare-934bb2301 , email ompansare584@gmail.com . Instagram, YouTube, Behance and a showreel link are empty in config until they exist. This is NOT the hiring portfolio, so no GitHub feed, no resume, no project grid. (The hiring portfolio is a separate site with its own prompt.)
- HONEST STATUS (shown plainly, never hidden): I have only just started editing. No client work, no showreel and no published edits yet. Do not create fictional edits, clients, testimonials, view counts, placeholder achievements, sample data or invented links. Empty sections show an honest empty state ("First cut soon", "Showreel: coming soon", "The log starts with my first finished practice edit") and fill themselves from the config file when something real exists. The only demo is a "Raw to graded" wipe made on the site's own skyline, labelled as a practice piece.
- Portrait: the photo I attach is for the site. Use it neutrally as "Portrait of Om Pansare". Do not describe my face or identify anyone from it. Circular crop with the gold ring, WebP 640x640.
- Fact rule: if a fact is not in this section, it does not go on the site. If you doubt a raga or music fact, flag it to me instead of silently guessing.

### 2. THE IDEA
My portfolio is a vintage Indian valve radio whose dial is a 24-hour clock. In Hindustani music every raga belongs to a prahar (a 3-hour slice of the day). The site tunes itself to the raga of the hour the visitor opens it. Each of the 8 stations is one "programme" about me. Tagline: "हर प्रहर का अपना राग / Every hour has its raga". Fictional brand "TARANGA, Valve Wireless, 8 Stations". No real radio brands, logos or station names. Bilingual labels (Devanagari + Latin), never forced.

Inspiration check (do NOT copy): I have seen "Hire OK Please" (a scroll-driven truck-ride portfolio). Mine must be a different idea and a different structure.

### 3. ONE PURPOSE: EDITING (decided; the radio stays the front door)
The first screen IS the radio, with both knobs (Tuning, Volume), the dial, the magic eye, the doily and the window. There is one room, the EDIT BAY, reached from the radio and also a real page at `/editing`:
- Opening: clapperboard ("Scene 01 · Take 1 · Editor Om Pansare"), headline "Cut, colour, compose.", the honest-status note.
- Toolbox: five tool cards (DaVinci Resolve, Premiere Pro, After Effects, Photoshop, Canva) with what each is used for and a level pill (Learning / Practising / Comfortable) from config.
- Film strip: finished edits from config (links only: YouTube unlisted, Instagram, Drive; thumbnail optional; tool used). Empty = frames labelled "First cut soon". Showreel link from config, else "Showreel · coming soon".
- How I work through a brief (5 steps), a learning log from config (newest first), "Looking for" and "Availability" lines from config (hidden when empty).
- Send a brief: type, name, email, deadline, details; Formspree if configured, otherwise mailto, plus copy fallback.
Old links `?for=edit` and `/hiring` land on the Edit bay (`/hiring` is a permanent redirect to `/editing`). Never remove the radio, never hide it behind a button.

### 4. THE 8 PROGRAMMES (dial 00-24, needle snaps to the nearest station)
Notation: capital = shuddha, lowercase r g d n = komal, M# = tivra Ma. Windows follow common textbook convention and vary by gharana; show a small footnote saying so. Every programme is a short bulletin about my editing journey (what I am learning, never finished client work):
1. 00-03 Malkauns | S g M d n | vadi Ma | still, deep | "Raat Ka Cut": the first assembly, rough cuts
2. 03-06 Bhairav | S r G M P d N | vadi Dha | devotional dawn | "Pehla Frame": who I am, the honest start
3. 06-09 Bilaval | S R G M P D N | vadi Dha | bright, clean | "Saaf Cut": the fundamentals (where to cut, how long to hold)
4. 09-12 Todi | S r g M# P d N | vadi Dha | intense, focused | "Rang Tarang": colour grading, DaVinci Resolve (+ the Raw to graded wipe)
5. 12-15 Brindavani Sarang | S R M P n | vadi Re | sun-bleached noon | "Chalti Tasveer": motion and titles, After Effects
6. 15-18 Bhimpalasi | S R g M P D n | vadi Ma | golden, longing | "Matinee Show": cinematic storytelling, Premiere Pro
7. 18-21 Yaman | S R G M# P D N | vadi Ga | serene dusk | "Sur Ke Saath Cut": cutting to music and sound (flute, ragas)
8. 21-24 Bihag | S R G M M# P D N | vadi Ga | tender night | "Pehli Nazar": thumbnails, posters and covers, Photoshop and Canva
All text lives in `src/content/ragas.ts` and is already written; reuse it, do not rewrite unless I ask.
Now-playing songs (one old film song per programme; title, film, year, singers, composer, raga, link only; NEVER lyrics, NEVER embedded audio) live in `src/content/config.ts` with a `ragaVerified` flag. Checked against Wikipedia's "List of film songs based on Hindustani ragas", songsofyore.com and notesandsargam.com: Malkauns = Man Tarpat Hari Darshan Ko Aaj (Baiju Bawra); Bhairav = Jaago Mohan Pyare (Jagte Raho); Todi = Duniya Na Bhaye Mohe (Basant Bahar; sources call it Bilaskhani Todi); Brindavani Sarang = Jadugar Saiyan (Nagin); Bhimpalasi = Nainon Mein Badra Chhaye (Mera Saaya); Yaman = Abhi Na Jao Chhod Kar (Hum Dono); Bihag = Tere Sur Aur Mere Geet (Goonj Uthi Shehnai). BILAVAL has no confirmed song and shows "Farmaish pending". Ek Pyar Ka Nagma Hai is Yaman, not Bilaval. Never claim a raga for a song that is not verified; have my flute teacher double-check.

### 5. THE EXPERIENCE (all of this already exists; keep it)
- THE WINDOW IS THE CLOCK: sky, sun, moon, stars, clouds, skyline lights and room light change smoothly with the dial time: dawn pink-gold, noon white, golden afternoon, magenta dusk, indigo night. Warm vignette, soft film grain, dust motes. Tactile: layered shadows, brass highlights, knob inertia.
- SWITCH ON: the radio starts switched off. Touching any knob, the dial or the cabinet powers it on (this is also the gesture that unlocks audio): dial lamp, valve warm-up hum, 6 s flute sign-on, then auto-tune to the visitor's LOCAL hour. Power-off plays a 3 s Bhairavi sign-off. Visible "Quiet mode". Everything works with sound off.
- TUNE: drag the needle, rotate the tuning knob (circular drag), swipe, wheel, arrow keys, tap station labels. Magnetic detent with a mechanical "tock" and 10 ms vibrate where supported. Static between stations, crossfading into music as you near one, a band-pass that widens, magic eye closes on lock. If the page stays open and the clock enters a new prahar, the needle retunes slowly unless the visitor touched the dial.
- PROGRAMME SLIP: on lock a cream printed slip shows time window, raga (Devanagari + Latin), swaras, vadi, programme title, summary, tags, "Now playing", "RJ's note".
- HARMONIUM (big, up to 300 px keys): one octave plus upper Sa, octave shift -1/0/+1. Keys A S D F G H J K (white) and W E T Y U (black). Two modes: FREE PLAY (default: every key sounds) and RAGA LOCK (only the current raga's swaras sound, the rest are locked). Ignore keys while typing in a field.
- LISTEN (bottom sheet from the dock): what the radio plays for each raga: FLUTE (alaap from the raga's own swaras), SARGAM (aroha and avaroha sung as syllables with an on-screen chip), A FILM SONG (the raga's verified song as a link that opens on YouTube; never embedded), or MUTE. Choice saved in localStorage inside try/catch.
- MUTE BUTTON: a round always-visible button (desktop always; phone once the visitor scrolls past the radio), plus Quiet mode in the top bar and Mute in Listen. The knobs stay.
- SCROLLABLE FRONT PAGE: the radio fits any screen (sized by width AND height, so it never runs under a taskbar); below it the page scrolls: Meet Om, Two ways in (Edit bay / Programme guide), Eight programmes (real links), Listen your way, Find me, footer. The dock hides once scrolled.
- BACK PANEL: flips to the chassis; valves/capacitors are the editing skills and tools I am really learning (none invented); no GitHub feed in this portfolio.
- FARMAISH (request postcard): name, company/role, which programme, message, email; mailto with copy fallback or Formspree; postmark animation.
- PROGRAMME GUIDE: newspaper-style listing of all 8 programmes (also `?mode=guide`), real HTML text, no animation or sound.
- DEEP LINKS: `?station=bihag`, `?t=15`, `?for=edit`, `?mode=guide`.
- EASTER EGGS: two at most, never blocking content.
- SOUND (Web Audio only, nothing plays before the visitor switches on): just intonation from Sa: S 1, r 16/15, R 9/8, g 6/5, G 5/4, M 4/3, M# 45/32, P 3/2, d 8/5, D 5/3, n 9/5, N 15/8. Sa is ONE constant (`saHz`, default D3 146.83 Hz; flute one octave up; harmonium key = Sa x 2 x ratio). Tanpura (4 strings, about 6.4 s cycle, jawari buzz), bansuri (soft attack, breath noise, late vibrato, meend), a 15-25 s alaap per raga from its own swaras only, 50 Hz mains hum, valve swell, static with crackle, lamp tink, knob clicks. Fade in 1.5 s, ducking 30% while the harmonium plays, AudioContext suspended when the tab is hidden, preference saved in localStorage inside try/catch. My own recordings can replace the synth through config paths.

### 6. TECH STACK (decided; do not remove any library)
- Next.js 15 App Router with static generation only, React 19, TypeScript (strict), SCSS (sass), clsx.
- Smooth scrolling: Lenis (Locomotive Scroll v5 is built on Lenis, so use Lenis directly).
- Motion: GSAP + ScrollTrigger (reveals, parallax), Framer Motion via LazyMotion (menus, hover).
- 3D / shaders: Three.js with hand-written GLSL ShaderMaterial (half-resolution aurora/stars sky tinted by the visitor's hour). Write GLSL ES 1.00 style so it can also be tested in raw WebGL.
- Assets and performance: next/font (self-hosted Rozha One, Hind, Special Elite), next/image + sharp, immutable caching for images/textures/audio.
- Quality tooling: @lhci/cli (lighthouserc.json), @next/bundle-analyzer, eslint (flat, next/core-web-vitals), prettier, cross-env.
- Optional, OFF by default: @vercel/analytics and @vercel/speed-insights (NEXT_PUBLIC_ANALYTICS=1), loaded only when idle.
- Hosting: Vercel (free). Site URL from NEXT_PUBLIC_SITE_URL or VERCEL_PROJECT_PRODUCTION_URL.
- Architecture decisions: two root layouts (`(radio)` = the fixed one-screen radio with its own isolated plain CSS; `(site)` = the scrolling pages with SCSS). Moving between them is a normal page load, so CSS never leaks. The radio engine (`src/lib/radio/engine.ts`) is the tested v1 vanilla-DOM code ported as one lazily loaded function; its markup is `src/content/home.html` with the eight programme articles generated from `ragas.ts`. A tiny pre-paint script sets the skyline variables so nothing jumps (CLS 0). Do not rewrite the engine into React unless I ask.
- Rule: every library beyond React/Next loads after first interaction or idle, never in the first paint, and the site must stay fully usable if any of them fail to load.

### 7. SEO AND AI-READABILITY (build all of it)
- Real server-rendered text for every page. One H1 per page. Descriptive titles and meta descriptions, canonical URLs, Open Graph + Twitter large card (1200x630 `og.jpg`), `metadataBase`.
- JSON-LD as plain objects: Person (with sameAs, knowsAbout, affiliation), WebSite, ProfilePage, BreadcrumbList, ItemList, per-raga WebPage.
- `sitemap.xml`, `robots.txt` (allow search and AI crawlers: GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-User, Claude-SearchBot, anthropic-ai, PerplexityBot, Google-Extended, Applebot-Extended, Bingbot, DuckDuckBot), web manifest, favicon + 192/512 + apple-touch icons.
- LLM layer, generated from the same content files so it cannot drift: `/llms.txt` (llmstxt.org format: H1, blockquote summary, link lists, a facts policy telling agents not to invent anything), `/llms-full.txt` (everything true about me, about 2,300 tokens), `/facts.json`, `/md/editing`, `/md/ragas`; `Accept: text/markdown` requests to `/`, `/editing`, `/ragas` are rewritten to those markdown files; each page advertises `<link rel="alternate" type="text/markdown">`. Goal: an AI agent learns everything true about me in one cheap request instead of crawling.
- Honest wording everywhere ("no showreel yet"). Search and AI summaries must not be able to over-claim.

### 8. LIGHTHOUSE 100 RULES (without hurting stability)
- Server-rendered, static, minimal first-load JS. Heavy libs (Lenis, GSAP, Three, Framer features, analytics, radio engine) load via dynamic import after `load` + idle or first interaction; no timers that fire during a Lighthouse run.
- Fonts via next/font with `display: swap`. Images via next/image with width/height, `priority` only on the LCP portrait. CSS baseline sky first; GLSL sky is an enhancement.
- No layout shift: reserve sizes, set skyline variables before paint, no late-injected content above the fold.
- Reduced motion and Save-Data / low-memory devices get the plain page. No third-party requests on load (no GitHub call at all in this portfolio).
- Security headers (nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy, COOP). No strict CSP (it breaks inline scripts and Web Audio/WebGL); add later with nonces if wanted.
- Accessibility: skip link, landmarks, visible focus (3 px), 4.5:1 contrast, dial `role="slider"` with `aria-valuetext` like "Bhimpalasi, 3 to 6 PM", full keyboard control, `prefers-reduced-motion` respected, 44 px tap targets.
- Build stability: `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` are true so a warning can never block a deploy; `npm run check` (typecheck + lint) is mine to run before pushing.
- Targets (lighthouserc.json): accessibility, best-practices, SEO >= 0.98; performance >= 0.95; CLS <= 0.02; TBT <= 150 ms; LCP <= 2 s. Be honest: 100 on every run is not guaranteed (it depends on hosting and the test device); report real numbers, never claim a score you did not measure.

### 9. DESIGN RULES
Warm walnut, brass, cream paper, valve glow. Type: Rozha One (display), Hind (body), Special Elite (typed slips), with Devanagari. BANNED: neon, glassmorphism, purple gradients, generic dark dev look, stock photos, emoji as icons, lorem ipsum, a plain About/Projects/Contact navbar. Mobile portrait first (375x667, 390x844) then desktop 1440x900. Animate only transform and opacity. 60 fps on a mid-range Android phone.

### 10. FILE MAP
- `src/content/ragas.ts` (the 8 programmes), `site.ts` (PERSON, NAV), `config.ts` (THE FILE I EDIT: reelUrl, socials, formspree, lookingFor, availability, tools with levels, edits, learning log, saHz, audio paths, SONGS), `home.html` (radio markup with markers `<!--@PROGS@-->`, `@PROGCARDS@`, `@TOOLS@`, `@LOG@`, `@LOOKING@`, `@LINKS:slip|guide|below|edit@`).
- `src/lib/`: `seo.ts`, `llms.ts`, `siteUrl.ts` (server-only), `fonts.ts`, `homeHtml.ts` (fills the markers; exports PREPAINT and TOD), `shader.ts` (GLSL), `radio/engine.ts` (sound + dial + Edit bay room + Listen + harmonium + back panel + postcard).
- `src/app/(radio)/` the radio page; `src/app/(site)/` editing, ragas, ragas/[slug]; route handlers `llms.txt`, `llms-full.txt`, `facts.json`, `md/[slug]`; `sitemap.ts`, `robots.ts`, `manifest.ts`, `not-found.tsx`.
- `src/styles/radio/radio.css` (plain CSS), `src/styles/site/*.scss`.
- `public/`: textures/*.svg, images/om-portrait.webp, og.jpg, icons, audio/ (my recordings, optional).
- `static-preview/`: a generated snapshot (index.html, engine.js, radio.css, textures, images) that opens with VS Code Live Server for a quick look. It is a preview, not the deployed site.

### 11. HOW TO WORK
1. Read this prompt and the files I attach. Verify what exists before building.
2. Gather first, build second. Build in stages: content and SEO layer, design system, pages, client islands, assets, verification, docs.
3. Return complete files, never "rest unchanged". Keep a task list and finish with a checking step.
4. Verify for real: syntax-check every file, type-check, run the radio page in a real browser (power on, tune, no console errors, 390x780 and 1280x800), test the GLSL, SSR every page, and run Lighthouse when the environment allows. If something cannot be run (for example `npm install` or `next build` in a sandbox without network), say so plainly and list what is unverified.
5. You cannot hear audio. After any sound change give me a 5-point listening checklist and I will report back.
6. Before calling anything done, check it against this prompt.

### 12. DONE MEANS
Opens on the radio, already on the station for the visitor's local hour. Dragging the dial changes sky and sound continuously. No console errors. Works silent. The Edit bay exists as a real page (`/editing`) and as a room from the radio; the front page scrolls and the radio never runs under the taskbar; Listen (flute / sargam / song / mute), free-play harmonium and the mute button all work. Every programme has real text. Every empty section is honest. `llms.txt`, sitemap, robots, JSON-LD and markdown are live. Lighthouse numbers are measured and reported honestly. It feels like one handmade object.

### 13. END EVERY REPLY WITH MY CONFIG REMINDER
Remind me, every time, what is still empty: (1) verify the songs' ragas (Bilaval still has no song), (2) reelUrl and socials, (3) edits / tool levels / learning log, (4) NEXT_PUBLIC_FORMSPREE_URL, (5) lookingFor and availability lines, (6) saHz to match my flute, (7) my own audio recordings in /public/audio, (8) NEXT_PUBLIC_SITE_URL and the final og.jpg once deployed, (9) the portrait and email are right.

---

## Change log (so the next build knows what already happened)
- v1: single self-contained index.html (about 199 KB): radio front door, two rooms, harmonium, back panel, Raga Clock, live GitHub, postcard, 2 easter eggs, accessibility audit passed. Still works by double-click.
- v2: Next.js rebuild with the stack above, real routes, SEO and LLM layer, lazy motion libraries, GLSL sky. Radio engine ported unchanged; browser-tested.
- Decisions made on my behalf (I said "no need to confirm, I trust you"): radio stays the front door; only two rooms; no separate radio button; no sample data; GitHub fetched live; Lenis instead of Locomotive; typed-error and lint warnings do not block deploys.
- v3 (this build): the radio becomes the VIDEO-EDITING portfolio (`om-porfolio-edting`). Hiring room, GitHub feed, resume and projects removed; Edit bay expanded (toolbox with honest levels, film strip, brief steps, learning log). Eight programmes rewritten as editing bulletins. Front page scrolls with real content below; radio sized by width and height (no taskbar overlap); dock no longer covers the volume label. Free-play harmonium (octave shift), Listen modes (flute / sargam / song / mute), always-reachable mute button. Songs re-verified against published raga lists (Bilaval pending). Performance: non-blocking fonts, textures as files, prepaint scripts for sky and layout (CLS 0), grain animation off on phones, below-the-fold `content-visibility`, GitHub call removed.
- Lessons: when porting CSS from one file, extract by markers, never by line numbers (a dropped closing brace once broke the Vercel build with "Unclosed block"); never read `process.env` in code the browser bundles; `@axe-core/cli` breaks installs (chromedriver download), so it is not a dependency.
- The hiring portfolio is a separate project with its own prompt (concept "Yatra").

## 3.1 decisions (after first live deploy)
- The door panel under the radio must never clip: it adapts with container queries on `.side` (container `doorbox`), three tiers by available height.
- Never use `content-visibility:auto` on an element whose children have shadows, rings or outlines at its edge without padding plus an equal negative margin.
- Tool icons are original line icons from `src/content/icons.ts` (no company logos); used on the back-panel valves, the toolbox chips, the tools list and `/editing`.
- Fonts: only two Latin files preloaded; Devanagari as separate non-preloaded families (`--ff-display-dev`, `--ff-body-dev`). `experimental.inlineCss` is on. No `interest-cohort`, no `host:` in robots.
- SEO 69 on deployment links = Vercel noindex header; measure on the production domain in Incognito.
- Leftover files after copying a new version over an old repo are the usual cause of surprise build errors: delete removed files (`git rm`).
- 3.2: Sound is opt-in. First power-on asks "Switch the sound on?" (alertdialog); no AudioContext before the answer; answer persisted; early taps are queued by RadioBoot and replayed when the engine is ready (`rr-ready` class).
- 3.3: no inline layout script before first paint: skyline/desk variables are pure CSS (`clamp()` on `svh`, `--tb`, `--skygap`). Anything the engine fills in later must have its space reserved in CSS. Measure CLS and first paint with throttling before claiming a score.
