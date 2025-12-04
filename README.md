# ContentEarnings — CPM/RPM Rate Calculator (Project Setup)

This document describes how to create a small, single-page CPM/RPM rate calculator project for content creators. The instructions assume you're working in the repository root and will create a directory `cpm-rpm-project` containing the project files.

## Goals

- Provide a simple, client-side calculator to estimate earnings from monthly views using CPM and RPM.
- Keep the initial implementation minimal: one HTML file, one JS (or TS) file, and a small dataset for typical niche rates.
- Make it easy to run locally and deploy as a static site.

## Directory structure

Create the following structure inside `cpm-rpm-project`:

```
cpm-rpm-project/
  README.md        # this file
  index.html       # single-page UI
  styles.css       # optional styles
  script.js        # calculator logic (or script.ts)
  data.json        # optional niche CPM/RPM defaults
  dist/            # produced build (optional)
```

## Step-by-step setup

1. Create the project folder

   ```bash
   mkdir cpm-rpm-project
   cd cpm-rpm-project
   ```

2. Initialize a Git repo (optional)

   ```bash
   git init
   git add .
   git commit -m "chore: scaffold CPM/RPM project"
   ```

3. Create minimal files

   - `index.html`: basic page with inputs for Niche, Monthly Views, and Calculate button.
   - `script.js`: contains the calculation logic and a small mapping of niches -> CPM/RPM.
   - `data.json` (optional): more comprehensive niche table if you prefer JSON-driven data.

   Example `index.html` (very small):

   ```html
   <!doctype html>
   <html>
   <head>
     <meta charset="utf-8" />
     <meta name="viewport" content="width=device-width,initial-scale=1" />
     <title>ContentEarnings — CPM/RPM Calculator</title>
     <link rel="stylesheet" href="styles.css">
   </head>
   <body>
     <main>
       <h1>CPM / RPM Rate Calculator</h1>
       <label>Niche
         <select id="niche"></select>
       </label>
       <label>Average Monthly Views
         <input id="views" type="number" value="10000" />
       </label>
       <button id="calc">Calculate</button>
       <div id="result"></div>
     </main>
     <script src="script.js"></script>
   </body>
   </html>
   ```

   Example `script.js` (simple logic):

   ```javascript
   const niches = {
     "general": { cpm: 2, rpm: 1 },
     "tech": { cpm: 5, rpm: 3 },
     "finance": { cpm: 10, rpm: 6 },
     "lifestyle": { cpm: 1.5, rpm: 0.9 }
   };

   function formatMoney(n){ return '$' + Number(n).toFixed(2); }

   const nicheEl = document.getElementById('niche');
   const viewsEl = document.getElementById('views');
   const calcBtn = document.getElementById('calc');
   const resultEl = document.getElementById('result');

   // Populate niche select
   Object.keys(niches).forEach(k => {
     const opt = document.createElement('option');
     opt.value = k; opt.textContent = k;
     nicheEl.appendChild(opt);
   });

   calcBtn.addEventListener('click', ()=>{
     const niche = nicheEl.value;
     const views = Number(viewsEl.value) || 0;
     const {cpm, rpm} = niches[niche] || niches['general'];

     const estByCPM = (views/1000) * cpm;
     const estByRPM = (views/1000) * rpm;

     resultEl.innerHTML = `Estimated revenue: <strong>${formatMoney(estByRPM)}</strong> (RPM) — <em>advertiser CPM suggests ${formatMoney(estByCPM)}</em>`;
   });
   ```

4. Run locally

   - Quick static server (Python):

     ```bash
     # from inside cpm-rpm-project
     python -m http.server 8000
     # then open http://localhost:8000
     ```

   - Or install `live-server` (npm) for auto-reload:

     ```bash
     npm install -g live-server
     live-server --port=8000
     ```

5. Data and tuning

   - Replace the small `niches` table with `data.json` if you want to store more niches and ranges.
   - Provide low/median/high CPM/RPM values to show a range rather than a single number.
   - Add explanation text and a small FAQ for SEO.

6. Deployment

   - Buildless: Deploy the folder as a static site to GitHub Pages, Netlify, or Vercel.
   - If you use a bundler (Rollup/Vite), add `npm init -y` and the build scripts.

7. Optional improvements (next steps)

   - Add TypeScript for better developer DX (`script.ts`) and a minimal bundler like Vite.
   - Add unit tests for the calculation function.
   - Add a rate-editor UI for users to add custom CPM/RPM values.
   - Add structured data and meta tags for SEO + share images.

## Example Commands

```bash
# create folder and files
mkdir cpm-rpm-project && cd cpm-rpm-project
echo "(add index.html, script.js, styles.css)"

# run a quick server
python -m http.server 8000

# or use live-server
live-server --port=8000
```

## Notes from the spec file

- Project name chosen: `ContentEarnings`.
- Focus on a minimal, SEO-friendly landing page and a simple, highly shareable tool.
- Monetization can be simple: display ads or an optional pro report.

---

If you'd like, I can also:

- Create the initial `index.html`, `script.js`, and `styles.css` files inside `cpm-rpm-project` now.
- Initialize `package.json` and add a `dev` script using `live-server` or `vite`.

Tell me which of those you'd like me to do next.
