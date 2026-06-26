# PaintView — Mobile App

**Measure rooms. Preview colours. Create beautiful quotes.**

A premium mobile-first PWA for painters and decorators.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173 on your phone or use DevTools mobile view (390px).

## Live URLs

| Host | URL |
|------|-----|
| **GitHub Pages** (backup) | https://dinia44.github.io/paintview/ |
| **Vercel** | Import at [vercel.com/new](https://vercel.com/new) → `dinia44/paintview` |

### Vercel settings (important)

If the link shows a blank page, the project is usually misconfigured:

| Setting | Value |
|---------|-------|
| Framework Preset | **Other** (or Vite) |
| Build Command | `npm run build` |
| Output Directory | **`dist`** |
| Install Command | `npm install` |

Do **not** set Output Directory to `.` — that serves the dev `index.html` and the app will not load.

After saving, click **Redeploy** → check **Use existing build cache** is **off**.

## User flow

1. **Home** — Scan, quote, projects
2. **Scan Room** — Mark wall corners, calibrate one dimension, confirm
3. **3D Room View** — Isometric room summary
4. **Colour Preview** — Wall-only colour overlay
5. **Quote Summary** — Send quote / PDF
6. **Client Preview** — What the client sees

## Important

> Photo marking is guided measurement — enter one real dimension and we calculate the rest. Not automatic LiDAR. Confirm with a tape measure for quotes.

Colour preview is approximate — always check a physical sample.

## Tech

- React + TypeScript + Vite
- Tailwind CSS v4
- Framer Motion
- Zustand + localStorage
