# Deploying Raag Radio on Vercel (no build step)

Your site is two files: `index.html` and `og-image.jpg`.

1. **GitHub:** create a new repository (e.g. `portfolio`). Use "Add file > Upload files" and upload `index.html` and `og-image.jpg`. Commit.
2. **Vercel:** vercel.com > Add New > Project > Import that repository. Framework preset: **Other**. Leave Build Command and Output Directory empty. Deploy.
3. **Preview image:** once you have your address (for example `https://om-pansare.vercel.app`), open `index.html`, find the line
   `<meta property="og:image" content="og-image.jpg">` and change it to
   `<meta property="og:image" content="https://om-pansare.vercel.app/og-image.jpg">`. Commit; Vercel redeploys by itself.
4. **Audio recordings (optional):** make an `audio/` folder in the repository, upload your bansuri files, and list their paths in `CONFIG.audio` at the top of `index.html`. They only load over https, so test them on the live site, not by double-clicking the file.
5. **Check on your phone:** open the link, tap a key (sound starts only after a tap), try Hiring, Editing, the radio, the harmonium and the back panel.

Whenever you change `index.html` on GitHub, Vercel publishes the new version in about a minute.
