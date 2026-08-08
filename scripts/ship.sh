#!/usr/bin/env bash
# ship.sh "commit message" — build-verify, push, and (if vercel CLI is authed)
# instant prebuilt deploy. Falls back to Vercel's git-triggered build (~45s).
set -euo pipefail
cd "$(dirname "$0")/.."

msg="${1:?usage: scripts/ship.sh \"commit message\"}"

if [ -z "$(git status --porcelain)" ]; then
  echo "nothing to ship (working tree clean)"
  exit 0
fi

npm run build
git add -A
git commit -m "$msg"
git pull --rebase origin main
git push origin main
echo "pushed — git-triggered deploy is underway"

# Tier 2: skip the Vercel build queue with a prebuilt deploy.
# Auth: either `vercel login` once, or VERCEL_TOKEN in ~/.config/huse-dev/vercel.env
if command -v vercel >/dev/null 2>&1; then
  TOKEN_ARGS=()
  ENV_FILE="$HOME/.config/huse-dev/vercel.env"
  if [ -f "$ENV_FILE" ]; then
    # shellcheck source=/dev/null
    . "$ENV_FILE"
    [ -n "${VERCEL_TOKEN:-}" ] && TOKEN_ARGS=(--token "$VERCEL_TOKEN")
  fi
  if vercel whoami "${TOKEN_ARGS[@]}" >/dev/null 2>&1; then
    vercel pull --yes --environment=production "${TOKEN_ARGS[@]}" >/dev/null 2>&1
    vercel build --prod "${TOKEN_ARGS[@]}" >/dev/null 2>&1
    vercel deploy --prebuilt --prod "${TOKEN_ARGS[@]}"
    echo "live (prebuilt deploy, no build queue)"
  else
    echo "vercel CLI not authed — run 'vercel login' once (or put VERCEL_TOKEN in $ENV_FILE) to enable ~15s deploys"
  fi
fi
