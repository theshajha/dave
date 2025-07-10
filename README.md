# Dangerous Dave – Modern Web Remake

A faithful, open-source recreation of the classic 1980s platformer, rebuilt with **TypeScript**, **Next.js (App Router)**, and a custom HTML5-Canvas engine.

---

## 🎯 Project Goals

### Gameplay

- Preserve original mechanics – jump physics, trophy collection, 10 levels + warp zones.
- Responsive feel at a locked 60 FPS on desktop & mobile.
- Keyboard on desktop, virtual D-Pad on touch devices.

### Technical

- 100 % TypeScript with strict types.
- Modular code: tiny files, single-purpose helpers.
- Zero third-party game libraries (engine written from scratch).

---

## 🚀 Quick Start

```bash
# clone & install
npm install

# dev server (http://localhost:3000)
npm run dev

# production build & start
npm run build
npm run start
```

### Useful scripts

```
npm run lint      # ESLint
npm run format    # Prettier write
npm run test      # Jest (unit tests)
```

---

## 📁 Repository Layout

```
app/                         Next.js pages / layouts
  page.tsx                   Landing page → embeds <GameCanvas/>
  game/                      /game route (SSR disabled)

components/
  game/                      React wrappers around core engine
    GameCanvas.tsx           Canvas + engine bootstrap
    GameUI.tsx               HUD, touch controls, instructions
    MobileControls.tsx       Virtual D-Pad & buttons (touch only)
    DebugInfo.tsx            FPS / memory overlay (dev)
  ui/                        Generic UI helpers (ErrorBoundary …)

lib/
  engine/
    core/                    canvas.ts (resize / crisp-pixels), loop.ts
    physics/                 collisions, bounds, utils
    states/                  menu, playing, paused, game-over …
    input/                   keyboard + touch managers
    GameEngine.ts            Thin orchestrator – holds refs to all subsystems

  entities/
    player/                  PlayerBase + composable modules (input/physics/render…)
  levels/                    LEVEL1_GRID, LEVEL2_GRID … (tile maps)
  utils/                     constants, helpers, type defs

public/assets/
  sprites/                   dave.png, tiles.png, collectibles …

README.md                    You are here
```

---

## ⚙️  Tech Stack

| Area        | Choice                 |
|-------------|------------------------|
| Framework   | Next.js 13 (App Router)|
| Language    | TypeScript             |
| Styling     | Tailwind CSS           |
| Rendering   | HTML5 Canvas API       |
| Hosting     | Vercel                 |

---

## ☁️  Deploying to Vercel

1. Push the repo to GitHub.
2. In Vercel → **New Project** → import the repo.
3. Framework preset **Next.js** (build = `npm run build`).
4. Hit deploy – that’s it.

No custom config / API routes required; everything is static + client-side JS.

---

## 🙏  Credits

- Original game design – **John Romero (1988)**.
- Sprite art redrawn from DOS assets for educational purposes.

> This remake is for learning & nostalgia. Not affiliated with the original IP owners.
