# PaintView Pro

**PaintView Pro** is a mobile-first web app for painters and decorators. It helps you prepare faster, better-looking decorating quotes from room photos.

## What it does

- Create decorating projects with client and decorator details
- Take or upload room photos from a phone
- Mark wall areas visually on the photo
- Enter **real** wall measurements for calculations
- Choose paint colours and preview them on the marked wall
- Calculate paint quantity and tin suggestions
- Build professional quotes with labour, materials, VAT and contingency
- Copy, share, print and save projects locally in the browser

## Important: no fake measurement

> This MVP uses **manually entered measurements** for actual quote calculations. Photo marking is for visual preview and communication, not guaranteed measurement.

The app does **not** claim to measure rooms accurately from a single photo. That workflow is unreliable and risky for real quotes.

Future slots are reserved for:

- iPhone LiDAR / ARKit RoomPlan
- Android ARCore depth
- OpenAI Vision wall-outline suggestions
- Professional laser-measure import

## Run locally

```bash
npm run dev
```

Open **http://localhost:5173**

You can also open `index.html` directly, but a local server is recommended for PWA and camera features.

## Test on your phone

1. Run `npm run dev` on your Mac
2. Find your Mac IP: `ipconfig getifaddr en0`
3. On your phone (same Wi‑Fi): `http://YOUR_IP:5173`

Or deploy to Vercel and open the production URL.

## Deploy

### Vercel

1. Push to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. No build command needed — static site

### Netlify / GitHub Pages / Hostinger

Upload these files to your static host:

- `index.html`
- `styles.css`
- `app.js`
- `manifest.json`
- `service-worker.js`
- `assets/`
- `vercel.json` (Vercel only)

## API slots

The **API slots** section stores optional keys locally for future features:

- Cloud project sync (Supabase)
- AI wall suggestions (OpenAI Vision)
- Payments (Stripe)
- Paint brand colour matching

**No API keys are required** for the MVP. The app works offline for quote preparation.

## Recommended next stage

1. Shareable quote links with Supabase
2. Branded PDF export
3. AI-assisted wall outline suggestions (with confidence warnings)
4. Stripe subscriptions for decorator teams

## Tech

- Static HTML, CSS and JavaScript
- localStorage persistence
- PWA manifest and service worker
- Web Share API for mobile quote sharing
