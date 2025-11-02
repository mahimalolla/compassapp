# Compass • Career Match (Prototype)

A frontend-only React + Vite + Tailwind app (no backend) that you can deploy on **Netlify**.
- Short **RIASEC** + optional **Work-Style (Big Five)** + **Hobbies**
- Returns **career matches**, **subject suggestions**, and a **Because Note**
- **Download Report (HTML)** button (you can Print → Save as PDF)

## Quick Start

```bash
npm i
npm run dev
# open http://localhost:5173
```

## Build + Deploy (Netlify)

```bash
npm run build
# dist/ will be generated
# Deploy:
# - Drag & drop the dist/ folder into Netlify Drop, OR
# - Connect GitHub repo in Netlify and set Build command: npm run build, Publish dir: dist
```

## Project Structure

```
.
├─ index.html
├─ vite.config.js
├─ tailwind.config.js
├─ postcss.config.js
├─ package.json
└─ src/
   ├─ styles.css
   ├─ data.js
   ├─ utils.js
   ├─ main.jsx
   └─ App.jsx
```

## Customize

- Edit `src/data.js` to add more occupations, programs, and subject rules.
- Adjust scoring / notes in `src/utils.js`.
- All logic is client-side so it’s easy to iterate for demos.

---

© Compass MVP demo. Educational use.
