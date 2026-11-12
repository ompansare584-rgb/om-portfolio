# PROMPT: "Yatra", a second portfolio on the same tech stack with a completely different concept

For: Om Pansare's HIRING / engineering portfolio (the Raag Radio now belongs to the video-editing portfolio, so this one needs its own idea).

How to use: open a new chat with Claude (or Claude Code), attach your portrait and, if you have it, your resume, then paste ONLY the block under "THE PROMPT". If you prefer another concept, change only Section 2 (three alternatives are listed at the bottom). Everything else stays valid for any concept.

---

## THE PROMPT (copy from here to the end)

### 0. ROLE AND QUALITY BAR
You are a senior creative developer and technical-SEO engineer. Build my hiring portfolio "Yatra" so that recruiters understand who I am in ten seconds, people screen-record and share it, search engines and AI assistants read it cheaply and accurately, and Google Lighthouse scores 99-100 on mobile and desktop wherever hosting allows. Stability beats spectacle: any flourish that could break the page must be optional and lazy. Do not ask me questions. Decide, state the decision in one line, keep going. At the end list every item I still have to fill in.

### 1. WHO I AM (only these facts exist)
- Om Pansare. First-year B.Tech Computer Science Engineering student, Vishwakarma Institute of Technology (VIT Pune), Pune, Maharashtra, India. Academic year 2026-27. Timezone IST.
- Curious, observant, ambitious, creative. I like where technology and creativity meet. I prefer work to speak louder than announcements and dislike exaggerated self-presentation. Show me honestly.
- Interests: software, AI and digital innovation; thoughtful visual design and creative interfaces; Indian classical music; gaming and digital culture; video editing (separate portfolio). I play the flute as a hobby (never state years).
- Links: GitHub https://github.com/ompansare584-rgb , LinkedIn https://www.linkedin.com/in/om-pansare-934bb2301 , email ompansare584@gmail.com .
- HONEST STATUS, shown plainly: no resume yet, no internships, no formal experience, no showcase projects yet. Never invent projects, achievements, metrics, testimonials, resume sections or links. Empty sections show an honest empty state and fill themselves from `src/content/config.ts` when something real exists. Public GitHub repositories are fetched live (never sample data).
- Portrait attached: use as "Portrait of Om Pansare"; do not describe the face.
- Fact rule: if it is not in this section, it does not go on the site.

### 2. THE CONCEPT: YATRA (an Indian Railways journey)
The portfolio is one long train journey. The visitor boards at a station called "Om Pansare Junction" and the page scrolls like the view from a window seat. Each stop is a section about me.
- First screen: a vintage station departure board (split-flap letters, built with Framer Motion + CSS 3D, not images) listing today's "departures": WHO I AM, WHAT I FOLLOW, TOOLS I USE, PROJECTS, GITHUB, CONTACT. The board is also the navigation. Tapping a row "boards" that stop.
- The ticket is the identity card: a printed railway ticket (PNR-style number made from my initials and the year, class "First-Year Sleeper", from "Pune" to "Wherever you are building") that contains my name, college, status and contact. No fake data: the ticket states "Resume: coming soon" until config has a file.
- Scroll = travel. A horizontal parallax landscape (GSAP ScrollTrigger scrub, transform-only) with layered hills, telegraph poles passing at speed, a small steam-to-electric locomotive silhouette, and a time-of-day sky that follows the visitor's local hour (GLSL ShaderMaterial in Three.js, half-resolution, tinted by hour). Stations are pinned sections where the train stops and the content card is "stamped" onto the platform.
- Stops (each with real text only): 1 Junction (who I am), 2 Platform Of Interests (software, AI, design, music, games), 3 Signal Cabin (tools I really use; honest empty state), 4 Goods Yard (projects; honest empty state "No goods loaded yet"), 5 Telegraph Office (live public GitHub repos), 6 Booking Counter (contact: mailto, copy button, optional Formspree, "Looking for" line from config).
- Sound is OPTIONAL and off by default: a soft rail rhythm and a distant whistle via Web Audio only after the visitor taps a visible "Sound on" switch. Mute button always visible. Everything works silent.
- Different from my radio portfolio and from "Hire OK Please" (a truck-ride scroll site): the board + ticket + horizontal travel is the structure; do not copy any existing site.
- Bilingual labels (Devanagari + Latin) where natural, never forced. No real railway brand, logo, station codes of real services or real train numbers.

### 3. TECH STACK (same as my other portfolio, do not drop anything)
- Next.js 15 App Router, static generation, React 19, TypeScript, SCSS (sass), clsx.
- Lenis smooth scroll (Locomotive Scroll v5 is built on Lenis, so use Lenis directly), GSAP + ScrollTrigger, Framer Motion (LazyMotion), Three.js + hand-written GLSL (ES 1.00 style so it can be tested in raw WebGL).
- next/font (self-hosted, display swap), next/image + sharp, immutable cache headers.
- Tooling: @lhci/cli, @next/bundle-analyzer, eslint (flat), prettier, cross-env. Optional OFF by default: @vercel/analytics, @vercel/speed-insights (loaded when idle).
- DO NOT add `@axe-core/cli` (its chromedriver download breaks installs). Set `"engines"` to the Node version Vercel currently supports (26.x as of Nov 2026; Vercel rejects discontinued versions).
- `next.config`: `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` true so a warning never blocks a deploy; security headers; immutable caching for static assets.
- Architecture: server-rendered content pages; every heavy library (Lenis, GSAP, Three, Framer features, analytics) loads by dynamic import after `load` + idle or first interaction; the page is fully readable and navigable if any of them fail or if reduced motion / Save-Data / low memory is detected.
- Content lives in `src/content/*.ts` (`site.ts`, `config.ts` = the file I edit). The SEO/LLM layer is generated from the same files so it cannot drift.

### 4. SEO AND AI-READABILITY (build all of it)
- One H1 per page, descriptive titles and descriptions, canonical URLs, Open Graph + Twitter large card (`og.jpg` 1200x630), `metadataBase`.
- JSON-LD plain objects: Person (sameAs, knowsAbout, affiliation), WebSite, ProfilePage, BreadcrumbList.
- `sitemap.xml`, `robots.txt` (allow AI and search crawlers: GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-User, Claude-SearchBot, anthropic-ai, PerplexityBot, Google-Extended, Applebot-Extended, Bingbot, DuckDuckBot), manifest, favicon + 192/512 + apple-touch icons.
- LLM layer: `/llms.txt` (llmstxt.org format with a facts policy), `/llms-full.txt`, `/facts.json`, `/md/<page>`, `Accept: text/markdown` rewrites, `<link rel="alternate" type="text/markdown">`. Honest wording ("no resume yet") so no summary can over-claim.

### 5. LIGHTHOUSE RULES (mobile 99-100 goal, without hurting stability)
- Server-render all text. Minimal first-load JS. Non-blocking fonts. Only `transform` and `opacity` animated. LCP element = text or the portrait with `priority` and explicit width/height.
- No layout shift: reserve sizes, set sky variables with a tiny inline pre-paint script. No third-party request on load. No timers firing during a Lighthouse run.
- `content-visibility:auto` for below-the-fold sections; disable heavy animation under 900 px width and for reduced motion.
- Accessibility: skip link, landmarks, visible 3 px focus, 4.5:1 contrast, 44 px targets, full keyboard control, the departure board is real HTML text with `aria-label`s, `prefers-reduced-motion` gives a plain stacked page.
- Be honest: measure and report real numbers; never claim a score you did not measure. Note that a local dev server without gzip lowers scores; test on the deployed URL.

### 6. DESIGN RULES
Warm sepia paper, enamel signboard red and cream, brass, soot black, signal-lamp amber. Type: one characterful display face (e.g. Rozha One or a slab like Arvo for signboards), Hind for body, Special Elite for typed tickets, Devanagari support. BANNED: neon, glassmorphism, purple gradients, generic dark dev look, stock photos, emoji as icons, lorem ipsum, a plain About/Projects/Contact navbar. Mobile portrait first (375x667, 390x844), then 1440x900. Check short laptop heights (1366x650) so nothing runs under the taskbar.

### 7. LESSONS FROM MY LAST BUILD (apply them)
- When porting CSS from a single file, extract by markers (`<style>` ... `</style>`), never by line numbers: a dropped closing brace once broke the Vercel build ("Unclosed block").
- Do not read `process.env` in any file the browser bundle imports; keep SITE_URL in a server-only module.
- Put external textures in files, not JS data-URIs. Defer any network call (GitHub) until first interaction.
- Never leave a fixed-height layout sized by width only; also bound it by viewport height.
- Give every important action a visible, always-reachable control (for example the mute button).

### 8. HOW TO WORK
Verify what exists, gather first, build in stages (content and SEO, design system, pages, client islands, assets, verification, docs). Return complete files. Keep a task list ending with a checking step. Really verify: syntax, types, SSR of every page, a real browser run (no console errors, 390x780, 1366x650, 1440x900), GLSL in raw WebGL, and say plainly what could not be run (for example `npm install`/`next build` without network). You cannot hear audio: give me a short listening checklist.

### 9. DONE MEANS
Opens on the departure board. Scrolling travels the line and stops at six real stops. No console errors. Works silent. Every empty section is honest. `llms.txt`, sitemap, robots, JSON-LD, markdown are live. Lighthouse numbers are measured and reported. It feels like one handmade object.

### 10. END EVERY REPLY WITH MY CONFIG REMINDER
Remind me what is still empty: resumeUrl, projects, tools, lookingFor, NEXT_PUBLIC_FORMSPREE_URL, NEXT_PUBLIC_SITE_URL, og.jpg after deploy, portrait and email correct.

---

## Alternative concepts (swap Section 2 only)
1. **Chai Tapri**: a street-side tea stall; each project is a cup on the counter, the menu board is the navigation, steam rendered in GLSL.
2. **Survey of India map**: an antique hand-drawn map; scroll zooms between landmarks (projects), compass rose = nav, ink-bleed shader transitions.
3. **Control Room**: an ISRO-style mission console with telemetry panels (real GitHub activity as the live feed), countdown sequence as the intro.
