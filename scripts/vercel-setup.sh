#!/usr/bin/env bash
set -euo pipefail

# Run from project root: bash scripts/vercel-setup.sh
# Links this repo to Vercel and deploys to production (no GitHub integration required).

cd "$(dirname "$0")/.."

echo "→ Checking Vercel login..."
if ! vercel whoami >/dev/null 2>&1; then
  echo "Not logged in. Opening Vercel login..."
  vercel login
fi

echo "→ Linking project to Vercel (team: allister-diniz-s-projects)..."
vercel link --yes

echo "→ Deploying to production..."
vercel deploy --prod --yes

echo ""
echo "Done. Your live URL is printed above."
echo "To connect GitHub later: Vercel dashboard → Project → Settings → Git"
