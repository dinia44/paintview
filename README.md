# PaintView — Mobile App

**Measure rooms. Preview colours. Create beautiful quotes.**

A premium mobile-first PWA for painters and decorators.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173 on your phone or use DevTools mobile view (390px).

## Deploy (Vercel)

Push to GitHub — Vercel auto-builds with Vite (`dist` output).

## User flow

1. **Home** — Scan, quote, projects
2. **Scan Room** — Mark wall corners, confirm measurement
3. **3D Room View** — Isometric room summary
4. **Colour Preview** — Swatches and finish selector
5. **Quote Summary** — Send quote / PDF
6. **Client Preview** — What the client sees

## Important

> Photo marking is for visual preview. Quote calculations use confirmed measurements — not fake AI scanning.

API integrations are hidden in Profile → Settings (coming soon).

## Tech

- React + TypeScript + Vite
- Tailwind CSS v4
- Framer Motion
- Zustand + localStorage
- PWA manifest + service worker
