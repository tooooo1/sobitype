# Sobitype — 내 소비 캐릭터는?

바이럴 소비 캐릭터 테스트. 4문항 밸런스게임 → 8캐릭터 결과 → 공유 루프.

## Tech Stack
- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript (strict)
- Tailwind CSS v4
- Biome (linter + formatter)
- Bun (package manager + runtime)

## Project Structure
```
src/
  app/           # Next.js App Router pages
    layout.tsx   # Root layout (Korean locale, fonts, meta)
    page.tsx     # Entry point → SpendingTest component
    globals.css  # Global styles, animations, dark theme
  components/    # React client components
    spending-test.tsx    # Main orchestrator (state machine)
    question-screen.tsx  # Balance-game question UI
    result-screen.tsx    # Character card + share + compat
    loading-screen.tsx   # Loading animation
    ref-preview.tsx      # Friend's character preview
    stat-bar.tsx         # Animated stat bar
    progress-bar.tsx     # Question progress indicator
  lib/           # Pure logic, no React
    characters.ts  # All character data, questions, compat comments
    utils.ts       # Helper functions (GA4, URL, sharing)
  types/         # TypeScript type definitions
    index.ts       # All shared types
```

## Conventions
- All components are client components ("use client")
- Data and types are separated from components
- Korean text in components, English in code/comments
- Mobile-first design (max-width: 420px target)
- Dark mode only (background: #06060f)
- No external state management (React useState/useCallback only)

## Key Commands
- `bun dev` — Start dev server (Turbopack)
- `bun run build` — Production build
- `bun run lint` — Biome check
- `bun run lint:fix` — Biome auto-fix
- `bun run format` — Biome format

## Character System
- 4 axes: S/P (spending), E/I (openness), N/R (investment), F/L (time)
- 8 main characters from 3 axes (S/P × N/R × F/L)
- E/I axis determines sub-variant tags
- Random tag adds variety (G/T equivalent)
