# Petal Press

A mobile-first personal flower diary — photograph flowers on neighborhood walks, get them identified and given floriography meanings, and collect them in a beautiful garden index.

## Run & Operate

- `pnpm --filter @workspace/petal-press run dev` — run the React frontend (reads PORT env var)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Framer Motion, wouter
- No backend yet — all state is in-memory React context
- Fonts: Fraunces (serif display), system sans

## Where things live

- `artifacts/petal-press/` — the main React app
- `artifacts/petal-press/src/data/flowers.ts` — mock flower data (source of truth for sample entries)
- `artifacts/petal-press/src/context/GardenContext.tsx` — global in-memory state
- `artifacts/petal-press/src/pages/` — Home (garden grid), EntryCard, CaptureFlow, BouquetView
- `artifacts/petal-press/src/index.css` — theme tokens (Fraunces font, cream/petal palette)

## Architecture decisions

- No backend on first build — all state lives in GardenContext (React context). Wire up Pl@ntNet + Claude API later.
- Router base path reads from `import.meta.env.BASE_URL` for proxy compatibility
- Flower images are AI-generated botanical photography (generate_image), stored as URLs in mock data
- Paper texture achieved via CSS noise overlay in index.css
- Capture flow uses local step state + Framer Motion transitions (not separate routes per step)

## Product

- **Garden Index** — grid of pressed flowers with color filters, "4 of 5 pressed" counter, undiscovered silhouette slot
- **Entry Card** — full editorial view: name, Latin name, nickname, floriography meaning, date, location, editable notes, bouquet toggle
- **Capture Flow** — multi-step: upload → identifying animation → ID candidates → confirm & save
- **Bouquet View** — curated scattered layout of selected flowers, shareable gift design

## User preferences

- Working title "Petal Press" (alternatives: "Pressed", "Bloomdex")
- Pl@ntNet for plant ID API, Claude for floriography meanings — to be wired up later
- Aesthetic: pressed-flower scrapbook meets indie game, NOT sleek SaaS

## Gotchas

- Google Font @import must be the very first line in index.css (before @import "tailwindcss") or PostCSS silently fails
- All CSS custom property placeholders ("red") must be replaced with real HSL values before components render

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Pl@ntNet API docs: https://my.plantnet.org/doc/openapi
