# MASTER PROMPT: Raag Radio (Om Pansare's portfolio)

How to use: open a new chat with Claude (or Claude Code), attach this file and, if you have them, the project folder plus your portrait, then paste ONLY the block under "THE PROMPT". Everything Claude needs is inside it: the idea, your real facts, every decision we made, the stack, the SEO and AI-readability layer, the Lighthouse rules and the order of work. Keep this file updated whenever something real changes (a project, a resume, an edit, a recording).

Rebuild modes (say which one at the top of your message):
- BUILD FROM SCRATCH: build everything below with no existing code.
- REBUILD OVER THE PROJECT: keep `src/content/*` and `legacy-v1/`, redo design and code.
- CHANGE ONE THING: leave everything else exactly as it is.

---

## THE PROMPT (copy from here to the end)

### 0. ROLE AND QUALITY BAR
You are a senior creative developer, sound designer and technical-SEO engineer. Build or rebuild my portfolio "Raag Radio" so that people screen-record and share it, recruiters get what they need in ten seconds, search engines and AI assistants read it cheaply and accurately, and Google Lighthouse scores 100 where it can. Stability beats spectacle: if a flourish could break the page, load late or be skipped, make it optional and lazy. Do not ask me questions. Decide, state the decision in one line, and keep going. At the end, list every item I still have to fill in.

### 1. WHO I AM (only these facts exist)
- Om Pansare. First-year B.Tech Computer Science Engineering student, Vishwakarma Institute of Technology (VIT Pune), Pune, Maharashtra, India. Academic year 2026-27. Timezone IST.
- Curious, observant, ambitious, creative. I like where technology and creativity meet. I prefer actions and work to speak louder than announcements, dislike exaggerated self-presentation, and want to be shown honestly.
- In a few words: "A curious mind, a creative perspective, and an appreciation for technology, art and meaningful experiences."
- Interests: software, AI and digital innovation; thoughtful visual design, immersive digital experiences, creative interfaces; cinematic storytelling, video editing, visual composition, filmmaking; Indian classical music and ragas; gaming and digital culture. I play the flute as a hobby. Never state how many years.
- Links: GitHub https://github.com/ompansare584-rgb , LinkedIn https://www.linkedin.com/in/om-pansare-934bb2301 , email ompansare584@gmail.com .
- HONEST STATUS (must be shown plainly, never hidden): I have no resume, no internships, no formal experience, no showcase projects and no finished video edits yet. Do not create fictional projects, placeholder achievements, sample data, fake metrics, an artificial resume section or invented links. Empty sections show an honest empty state ("The workbench is clear for now") and fill themselves from the config file when something real exists.
- Portrait: the photo I attach is for the site. Use it neutrally as "Portrait of Om Pansare". Do not describe my face or identify anyone from it. Crop it circular with the gold ring, save as WebP (640x640).
- Fact rule: if a fact is not in this section, it does not go on the site. If you doubt a raga or music fact, flag it to me instead of silently guessing.

### 2. THE IDEA
My portfolio is a vintage Indian valve radio whose dial is a 24-hour clock. In Hindustani music every raga belongs to a prahar (a 3-hour slice of the day). The site tunes itself to the raga of the hour the visitor opens it. Each of the 8 stations is one "programme" about me. Tagline: "हर प्रहर का अपना राग / Every hour has its raga". Fictional brand "TARANGA, Valve Wireless, 8 Stations". No real radio brands, logos or station names. Bilingual labels (Devanagari + Latin), never forced.

Inspiration check (do NOT copy): I have seen "Hire OK Please" (a scroll-driven truck-ride portfolio). Mine must be a different idea and a different structure.

### 3. TWO PORTFOLIO SIDES (decided; no separate "full radio" button)
The first screen IS the radio, with both knobs (Tuning, Volume), the dial, the magic eye, the doily and the window. From the radio the visitor chooses a purpose, and there are only two rooms:
1. HIRING (the Placement desk): the engineering side. Honest status, education, what I follow, tools I really use (config), projects (config; honest empty state), live public GitHub repositories (fetched at runtime, link fallback, never sample data), resume (config; "coming soon" pill until a file exists), contact, optional "Looking for" line (config).
2. EDITING (the Edit bay): the video-editing side. What pulls me in, a film strip of finished edits (config; links only: YouTube unlisted, Instagram, Drive; honest empty state), a "send a brief" form (type, name, email, deadline, details; Formspree if configured, otherwise mailto, plus copy fallback).
The radio itself stays the front door and the main thing. Never remove it, never hide it behind a button.

### 4. THE 8 PROGRAMMES (dial 00-24, needle snaps to the nearest station)
Notation: capital = shuddha, lowercase r g d n = komal, M# = tivra Ma. Windows follow common textbook convention and vary by gharana; show a small footnote saying so.
1. 00-03 Malkauns | S g M d n | vadi Ma | still, deep | "Raat Ka Khel" (gaming and digital culture)
2. 03-06 Bhairav | S r G M P d N | vadi Dha | devotional dawn | "Pehli Kiran" (who I am)
3. 06-09 Bilaval | S R G M P D N | vadi Dha | bright, clean | "Campus Bulletin" (education and honest status)
4. 09-12 Todi | S r g M# P d N | vadi Dha | intense, focused | "Tech Tarang" (technology, software, AI)
5. 12-15 Brindavani Sarang | S R M P n | vadi Re | sun-bleached noon | "Design Dopahar" (design and creative interfaces)
6. 15-18 Bhimpalasi | S R g M P D n | vadi Ma | golden, longing | "Matinee Show" (cinema and editing)
7. 18-21 Yaman | S R G M# P D N | vadi Ga | serene dusk | "Raag Darshan" (Indian classical music)
8. 21-24 Bihag | S R G M M# P D N | vadi Ga | tender night | "Meri Bansuri" (my flute, a hobby)
All text for these lives in `src/content/ragas.ts` (taken only from my own introduction). Hindi titles and RJ's notes are already written there; reuse them, do not rewrite them unless I ask.
Now-playing songs (one old film song per programme; title, film, year, singers, composer, link only; NEVER lyrics, NEVER embedded audio): kept in `src/content/config.ts` with a `ragaVerified` flag. Only Nainon Mein Badra Chhaye (Bhimpalasi) is confirmed. Possible mismatches to resolve: Ek Pyar Ka Nagma Hai may be Yaman Kalyan, not Bilaval; Duniya Na Bhaye Mohe is likely Bilaskhani Todi; Jadugar Saiyan and Tere Sur Aur Mere Geet are unconfirmed. Until verified the site says "raga match to be confirmed". Never claim a raga for a song that is not verified.

### 5. THE EXPERIENCE (all of this already exists in v1 and v2; keep it)
- THE WINDOW IS THE CLOCK: sky, sun, moon, stars, clouds, skyline lights and room light change smoothly with the dial time: dawn pink-gold, noon white, golden afternoon, magenta dusk, indigo night. Warm vignette, soft film grain, dust motes. Tactile: layered shadows, brass highlights, knob inertia.
- SWITCH ON: the radio starts switched off. Touching any knob, the dial or the cabinet powers it on (this is also the gesture that unlocks audio): dial lamp, valve warm-up hum, 6 s flute sign-on, then auto-tune to the visitor's LOCAL hour. Power-off plays a 3 s Bhairavi sign-off. Visible "Quiet mode". Everything works with sound off.
- TUNE: drag the needle, rotate the tuning knob (circular drag), swipe, wheel, arrow keys, tap station labels. Magnetic detent with a mechanical "tock" and 10 ms vibrate where supported. Static between stations, crossfading into music as you near one, a band-pass that widens, magic eye closes on lock. If the page stays open and the clock enters a new prahar, the needle retunes slowly unless the visitor touched the dial.
- PROGRAMME SLIP: on lock a cream printed slip shows time window, raga (Devanagari + Latin), swaras, vadi, programme title, summary, tags, "Now playing", "RJ's note".
- HARMONIUM: one octave plus upper Sa. Keys A S D F G H J K (white: S R G M P D N upper-Sa) and W E T Y U (black: r g M# d n). Only the current raga's swaras sound; the rest are locked. Ignore keys while typing in a field.
- BACK PANEL: flips to the chassis; valves/capacitors are skills I really have (none invented); "Raga Clock" from my real public GitHub activity with honest empty state.
- FARMAISH (request postcard): name, company/role, which programme, message, email; mailto with copy fallback or Formspree; postmark animation.
- PROGRAMME GUIDE: newspaper-style listing of all 8 programmes (also `?mode=guide`), real HTML text, no animation or sound.
- DEEP LINKS: `?station=bihag`, `?t=15`, `?for=hiring|editing`, `?mode=guide`.
- EASTER EGGS: two at most, never blocking content.
- SOUND (Web Audio only, nothing plays before the visitor switches on): just intonation from Sa: S 1, r 16/15, R 9/8, g 6/5, G 5/4, M 4/3, M# 45/32, P 3/2, d 8/5, D 5/3, n 9/5, N 15/8. Sa is ONE constant (`saHz`, default D3 146.83 Hz; flute one octave up; harmonium key = Sa x 2 x ratio). Tanpura (4 strings, about 6.4 s cycle, jawari buzz), bansuri (soft attack, breath noise, late vibrato, meend), a 15-25 s alaap per raga from its own swaras only, 50 Hz mains hum, valve swell, static with crackle, lamp tink, knob clicks. Fade in 1.5 s, ducking 30% while the harmonium plays, AudioContext suspended when the tab is hidden, preference saved in localStorage inside try/catch. My own recordings can replace the synth through config paths.

### 6. TECH STACK (v2, decided)
- Next.js 15 App Router with static generation only, React 19, TypeScript (strict), SCSS (sass), clsx.
- Smooth scrolling: Lenis (Locomotive Scroll v5 is built on Lenis, so use Lenis directly).
- Motion: GSAP + ScrollTrigger (reveals, parallax), Framer Motion via LazyMotion (menus, hover).
- 3D / shaders: Three.js with hand-written GLSL ShaderMaterial (half-resolution aurora/stars sky tinted by the visitor's hour). Write GLSL ES 1.00 style so it can also be tested in raw WebGL.
- Assets and performance: next/font (self-hosted Rozha One, Hind, Special Elite), next/image + sharp, immutable caching for images/textures/audio.
- Quality tooling: @lhci/cli (lighthouserc.json), @next/bundle-analyzer, @axe-core/cli, eslint (flat, next/core-web-vitals), prettier, cross-env.
- Optional, OFF by default: @vercel/analytics and @vercel/speed-insights (NEXT_PUBLIC_ANALYTICS=1), loaded only when idle.
- Hosting: Vercel (free). Site URL from NEXT_PUBLIC_SITE_URL or VERCEL_PROJECT_PRODUCTION_URL.
- Architecture decisions: two root layouts (`(radio)` = the fixed one-screen radio with its own isolated plain CSS; `(site)` = the scrolling pages with SCSS). Moving between them is a normal page load, so CSS never leaks. The radio engine (`src/lib/radio/engine.ts`) is the tested v1 vanilla-DOM code ported as one lazily loaded function; its markup is `src/content/home.html` with the eight programme articles generated from `ragas.ts`. A tiny pre-paint script sets the skyline variables so nothing jumps (CLS 0). Do not rewrite the engine into React unless I ask.
- Rule: every library beyond React/Next loads after first interaction or idle, never in the first paint, and the site must stay fully usable if any of them fail to load.

### 7. SEO AND AI-READABILITY (build all of it)
- Real server-rendered text for every page. One H1 per page. Descriptive titles and meta descriptions, canonical URLs, Open Graph + Twitter large card (1200x630 `og.jpg`), `metadataBase`.
- JSON-LD as plain objects: Person (with sameAs, knowsAbout, affiliation), WebSite, ProfilePage, BreadcrumbList, ItemList, per-raga WebPage.
- `sitemap.xml`, `robots.txt` (allow search and AI crawlers: GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-User, Claude-SearchBot, anthropic-ai, PerplexityBot, Google-Extended, Applebot-Extended, Bingbot, DuckDuckBot), web manifest, favicon + 192/512 + apple-touch icons.
- LLM layer, generated from the same content files so it cannot drift: `/llms.txt` (llmstxt.org format: H1, blockquote summary, link lists, a facts policy telling agents not to invent anything), `/llms-full.txt` (everything true about me, about 2,300 tokens), `/facts.json`, `/md/hiring`, `/md/editing`, `/md/ragas`; `Accept: text/markdown` requests to `/`, `/hiring`, `/editing`, `/ragas` are rewritten to those markdown files; each page advertises `<link rel="alternate" type="text/markdown">`. Goal: an AI agent learns everything true about me in one cheap request instead of crawling.
- Honest wording everywhere ("no resume yet"). Search and AI summaries must not be able to over-claim.

### 8. LIGHTHOUSE 100 RULES (without hurting stability)
- Server-rendered, static, minimal first-load JS. Heavy libs (Lenis, GSAP, Three, Framer features, analytics, radio engine) load via dynamic import after `load` + idle or first interaction; no timers that fire during a Lighthouse run.
- Fonts via next/font with `display: swap`. Images via next/image with width/height, `priority` only on the LCP portrait. CSS baseline sky first; GLSL sky is an enhancement.
- No layout shift: reserve sizes, set skyline variables before paint, no late-injected content above the fold.
- Reduced motion and Save-Data / low-memory devices get the plain page. No third-party requests on load (GitHub is fetched only after interaction or when its section scrolls into view).
- Security headers (nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy, COOP). No strict CSP (it breaks inline scripts and Web Audio/WebGL); add later with nonces if wanted.
- Accessibility: skip link, landmarks, visible focus (3 px), 4.5:1 contrast, dial `role="slider"` with `aria-valuetext` like "Bhimpalasi, 3 to 6 PM", full keyboard control, `prefers-reduced-motion` respected, 44 px tap targets.
- Build stability: `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` are true so a warning can never block a deploy; `npm run check` (typecheck + lint) is mine to run before pushing.
- Targets (lighthouserc.json): accessibility, best-practices, SEO >= 0.98; performance >= 0.95; CLS <= 0.02; TBT <= 150 ms; LCP <= 2 s. Be honest: 100 on every run is not guaranteed (it depends on hosting and the test device); report real numbers, never claim a score you did not measure.

### 9. DESIGN RULES
Warm walnut, brass, cream paper, valve glow. Type: Rozha One (display), Hind (body), Special Elite (typed slips), with Devanagari. BANNED: neon, glassmorphism, purple gradients, generic dark dev look, stock photos, emoji as icons, lorem ipsum, a plain About/Projects/Contact navbar. Mobile portrait first (375x667, 390x844) then desktop 1440x900. Animate only transform and opacity. 60 fps on a mid-range Android phone.

### 10. FILE MAP (v2)
- `src/content/ragas.ts` (the 8 programmes), `site.ts` (PERSON, NAV), `config.ts` (THE FILE I EDIT: resumeUrl, formspree, lookingFor, projects, edits, tools, saHz, audio paths, SONGS), `home.html` (radio markup).
- `src/lib/`: `seo.ts`, `llms.ts`, `siteUrl.ts` (server-only), `fonts.ts`, `homeHtml.ts`, `shader.ts` (GLSL), `radio/engine.ts` (sound + dial + rooms + harmonium + back panel + postcard).
- `src/app/(radio)/` the radio page; `src/app/(site)/` hiring, editing, ragas, ragas/[slug]; route handlers `llms.txt`, `llms-full.txt`, `facts.json`, `md/[slug]`; `sitemap.ts`, `robots.ts`, `manifest.ts`, `not-found.tsx`.
- `src/styles/radio/radio.css` (plain CSS, ported unchanged), `src/styles/site/*.scss`.
- `public/`: textures/*.svg, images/om-portrait.webp, og.jpg, icons, audio/ (my recordings, optional).
- `legacy-v1/index.html`: the single-file v1 that works by double-click. Keep it as the fallback.

### 11. HOW TO WORK
1. Read this prompt and the files I attach. Verify what exists before building.
2. Gather first, build second. Build in stages: content and SEO layer, design system, pages, client islands, assets, verification, docs.
3. Return complete files, never "rest unchanged". Keep a task list and finish with a checking step.
4. Verify for real: syntax-check every file, type-check, run the radio page in a real browser (power on, tune, no console errors, 390x780 and 1280x800), test the GLSL, SSR every page, and run Lighthouse when the environment allows. If something cannot be run (for example `npm install` or `next build` in a sandbox without network), say so plainly and list what is unverified.
5. You cannot hear audio. After any sound change give me a 5-point listening checklist and I will report back.
6. Before calling anything done, check it against this prompt.

### 12. DONE MEANS
Opens on the radio, already on the station for the visitor's local hour. Dragging the dial changes sky and sound continuously. No console errors. Works silent. Hiring and Editing exist as real pages with real URLs and as rooms from the radio. Every programme has real text. Every empty section is honest. `llms.txt`, sitemap, robots, JSON-LD and markdown are live. Lighthouse numbers are measured and reported honestly. It feels like one handmade object.

### 13. END EVERY REPLY WITH MY CONFIG REMINDER
Remind me, every time, what is still empty: (1) verify the songs' ragas, (2) resumeUrl, (3) projects / tools / edits, (4) NEXT_PUBLIC_FORMSPREE_URL, (5) lookingFor line, (6) saHz to match my flute, (7) my own audio recordings in /public/audio, (8) NEXT_PUBLIC_SITE_URL and the final og.jpg once deployed, (9) the portrait and email are right.

---

## Change log (so the next build knows what already happened)
- v1: single self-contained index.html (about 199 KB): radio front door, two rooms, harmonium, back panel, Raga Clock, live GitHub, postcard, 2 easter eggs, accessibility audit passed. Still works by double-click.
- v2: Next.js rebuild with the stack above, real routes, SEO and LLM layer, lazy motion libraries, GLSL sky. Radio engine ported unchanged; browser-tested.
- Decisions made on my behalf (I said "no need to confirm, I trust you"): radio stays the front door; only two rooms; no separate radio button; no sample data; GitHub fetched live; Lenis instead of Locomotive; typed-error and lint warnings do not block deploys.
