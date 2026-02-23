# Project Structure

## Directory Tree

```
speakquest/
├── .claude/                    # GSD installation (commands, agents, hooks)
├── .planning/                  # GSD planning artifacts
├── directus/                   # Backend CMS configuration
│   ├── docker-compose.yml      # PostgreSQL + Directus containers
│   ├── .env.example            # Backend env template
│   ├── extensions/             # Directus custom extensions
│   └── snapshots/              # DB schema snapshots
├── public/
│   ├── icons/                  # App icons (SVG, maskable)
│   ├── images/                 # Static images
│   ├── sounds/                 # Audio effects (for exercises)
│   ├── manifest.json           # PWA manifest
│   └── sw.js                   # Service worker
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (app)/              # Authenticated routes (13 files)
│   │   ├── (auth)/             # Auth routes (empty, pending Phase 7)
│   │   ├── api/                # API routes (content generation)
│   │   ├── onboarding/         # First-time flow (2 files)
│   │   ├── globals.css         # Tailwind + TEA styles (~500 lines)
│   │   ├── layout.tsx          # Root layout with Providers
│   │   └── page.tsx            # Landing redirect
│   ├── components/
│   │   ├── layout/             # AppShell, BottomNav, Sidebar, XPBar, NotificationLayer
│   │   ├── gamification/       # QuestCard, StreakCounter, ThemeCard
│   │   ├── ui/                 # Button, Card, Badge, ProgressBar, Toast
│   │   ├── themes/             # Theme-specific components (SportsZaragoza)
│   │   ├── accessibility/      # TEA-specific components (empty, pending)
│   │   ├── exercises/          # Exercise UI components (empty, pending)
│   │   ├── voice/              # Voice UI components (empty, pending)
│   │   ├── Providers.tsx       # React Query provider wrapper
│   │   └── ServiceWorkerRegistration.tsx
│   ├── hooks/
│   │   └── useAccessibility.ts # TEA accessibility hook
│   ├── lib/
│   │   ├── content/            # generator.ts, prompts.ts
│   │   ├── directus/           # client.ts, schema.ts (~100 lines)
│   │   ├── exercises/          # adaptive.ts, scoring.ts
│   │   ├── gamification/       # packs.ts, streaks.ts, xp.ts
│   │   ├── spaced-repetition/  # sm2.ts
│   │   ├── voice/              # service.ts, web-speech-stt.ts, web-speech-tts.ts, pronunciation.ts
│   │   └── utils/              # constants.ts (~200 lines), cn.ts
│   ├── stores/
│   │   ├── game-store.ts       # Central Zustand store (~300 lines)
│   │   └── notification-store.ts
│   ├── types/
│   │   ├── content.ts
│   │   ├── exercises.ts
│   │   ├── gamification.ts
│   │   ├── user.ts
│   │   └── voice.ts
│   └── styles/                 # (empty, styles in globals.css)
├── scripts/                    # (empty, available for automation)
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── .env.local                  # Environment variables (gitignored)
```

## File Size Estimates

| Area | Files | LOC (approx) |
|------|-------|---------------|
| Pages (app/) | 13 | ~1500 |
| Components | 12 | ~800 |
| Lib (business logic) | 12 | ~1200 |
| Stores | 2 | ~400 |
| Types | 5 | ~300 |
| Styles (globals.css) | 1 | ~500 |
| **Total src/** | **~45** | **~4700** |

## Key Entry Points

- `src/app/layout.tsx` — Root layout, mounts Providers
- `src/app/(app)/layout.tsx` — App layout, hydration + onboarding guard
- `src/stores/game-store.ts` — Central state, all game data
- `src/lib/utils/constants.ts` — All game constants (ranks, XP values, rarity)
- `src/app/globals.css` — Design system (colors, TEA profiles, rarity effects)
