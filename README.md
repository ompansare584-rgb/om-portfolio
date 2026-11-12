# Raag Radio: Om Pansare's video-editing portfolio (om-porfolio-edting)

A vintage Indian valve radio whose dial is a 24 hour clock. The site opens on the raga of the visitor's local hour; each of the 8 ragas is a short programme about Om's video-editing journey. One purpose: **editing**. (The engineering/hiring portfolio is a separate site, see `PROMPT_new-concept-portfolio_YATRA.md`.)

Stack: Next.js 15 (static), React 19, TypeScript, SCSS, Lenis, GSAP + ScrollTrigger, Framer Motion, Three.js + GLSL, next/font, next/image + sharp. Every heavy library loads lazily, so the first paint stays light and the site still works if one of them fails.

## What is new in this version
- Editing only: the Hiring room, GitHub feed, resume and project grid are gone. The Edit bay has a toolbox (DaVinci Resolve, Premiere Pro, After Effects, Photoshop, Canva, each honestly marked "Learning"), a film strip for finished edits, a learning log, how-I-work steps and a brief form.
- The front page scrolls. The radio fits the window by width and height, so it no longer runs under the Windows taskbar, and the dock no longer covers the VOLUME label.
- Harmonium: bigger, free play by default (every key sounds), optional Raga lock, octave shift.
- Listen: flute, sargam, a film song in that raga (link only), or mute. A round mute button is always in reach; the knobs stay.
- Songs re-checked against published raga lists. Bilaval has no confirmed song yet and says "Farmaish pending".

## Run it
```bash
npm install
cp .env.example .env.local      # optional locally
npm run dev                     # http://localhost:3000
npm run build && npm run start  # production build
```
Node 26 (Vercel dropped Node 20; `engines` is set to 26.x, locally use Node 22 or newer). The `npm warn deprecated ...` lines you may see during install are harmless notices from other packages, not errors. A real error starts with `npm error`.

Quick look without Node: open the folder `static-preview` in VS Code and use Live Server (right-click `index.html`, Open with Live Server). It is a generated snapshot of the radio only, good for checking layout and sound. It does not include the `/editing` page or the SEO files, and it is not what you deploy.

## The one file you edit: `src/content/config.ts`
- `reelUrl` and `socials` (Instagram, YouTube, Behance): empty until they exist. Empty shows "Showreel · coming soon" and hides the social buttons.
- `tools`: the five apps. Everything starts at `learning`. Change a level to `practising` or `comfortable` only when it is true.
- `edits`: one entry per finished edit: `{ title, line, url, tool, thumb }`. Links only (YouTube unlisted, Instagram, Drive). Each one adds a frame to the film strip.
- `learning`: short true notes, newest first, e.g. `{ date: 'Nov 2026', note: 'Finished my first 30-second cut in DaVinci Resolve.' }`.
- `lookingFor`, `availability`, `formspree`, `saHz` (match your flute), `audio` (your own recordings in `public/audio`), and `SONGS` (one film song per raga, with `raga` and `ragaVerified`).
Facts about you live in `src/content/site.ts`; the 8 programmes live in `src/content/ragas.ts`. `/llms.txt`, `/llms-full.txt`, `/facts.json` and `/md/*` rebuild themselves from those files.

## Deploy (Vercel, free)
1. Push this folder to a GitHub repository (the `static-preview` folder is ignored by `.vercelignore`).
2. vercel.com, New Project, import the repo, Deploy. Next.js is detected automatically.
3. Project Settings, Environment Variables: `NEXT_PUBLIC_SITE_URL` = your live address (no trailing slash). Optional: `NEXT_PUBLIC_FORMSPREE_URL`. Redeploy.
4. Search Console: add the site, submit `/sitemap.xml`. Check the social preview after the first share.
`/hiring` redirects permanently to `/editing`, so old links keep working.

## Lighthouse
```bash
npm run build && npm run lhci   # 4 pages x 3 runs, asserts in lighthouserc.json
npm run analyze                 # bundle report
```
Targets: accessibility / best-practices / SEO 0.98+, performance 0.95+, CLS 0.02 or less, TBT 150 ms or less, LCP 2 s or less. A perfect 100 on every run is a target, not a promise: it depends on the test device and hosting. Measure on the deployed URL (Chrome DevTools Lighthouse or PageSpeed Insights). Local dev servers and VS Code Live Server do not compress files, which lowers the mobile score; Vercel does compress.

What keeps the score high:
- Static, server-rendered HTML; the radio markup is in the page, so crawlers and AI agents see it.
- Lenis, GSAP, Three.js, Framer features, the radio engine and analytics load only after `load` + idle or the first touch.
- Fonts via `next/font`. Portrait via `next/image`. Textures are small SVG files with immutable caching.
- The skyline and sky-colour variables are set before first paint (CLS 0).
- Below-the-fold sections use `content-visibility:auto`; the film-grain animation is off on phones; reduced-motion, Save-Data and low-memory visitors get the plain page.
- No third-party request on load. A lint or type warning cannot block a deploy; run `npm run check` yourself before you push.

## Layout of the project
```
src/content/   ragas.ts, site.ts, config.ts (you edit), home.html (radio markup)
src/lib/       seo.ts, llms.ts, shader.ts (GLSL), fonts.ts, homeHtml.ts, radio/engine.ts (sound, dial, Edit bay, Listen, harmonium)
src/app/(radio)/   the radio (fixed screen that scrolls into the page below it)
src/app/(site)/    editing, ragas, ragas/[slug] (SCSS pages)
src/app/           llms.txt, llms-full.txt, facts.json, md/[slug], sitemap, robots, manifest, 404
static-preview/    generated snapshot for Live Server
```

## What was verified, and what was not
Verified here: the whole project type-checks against typed stand-ins for the libraries; the radio was run in a real headless browser at 1366x650, 1280x800, 1092x520, 390x780 and 360x640 (power on, tuning, Edit bay, Listen modes, sargam chip, free-play and raga-lock harmonium, octave shift, mute button, page scroll, no console errors, no horizontal overflow on phones); every page server-renders with one H1 and valid JSON-LD; the markdown, `llms.txt` and sitemap build correctly; CSS braces balance and parse.

Not verified here (no network in the build sandbox): `npm install`, `next build`, SCSS compilation, `next/font` downloads, a Lighthouse run, and how any of the sound modes actually sound. If the first build prints an error, paste it to Claude with `MASTER_PROMPT.md` and it will be fixed.

## Rebuilding later
Open a new chat, attach `MASTER_PROMPT.md` and this folder, paste the prompt block.
