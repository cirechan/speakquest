# Architecture Analysis

## Application Architecture

**Pattern**: Next.js App Router with client-heavy pages (mobile PWA)

### Route Structure

```
src/app/
├── (auth)/              # Auth route group (not yet implemented)
├── (app)/               # Authenticated app routes
│   ├── layout.tsx       # Onboarding guard + AppShell wrapper
│   ├── dashboard/       # Home — XP, streak, quick play
│   ├── learn/           # Theme selection → exercise play
│   │   └── play/        # Exercise session runner
│   ├── collection/      # Card collection viewer
│   ├── packs/           # Pack inventory
│   │   └── open/        # Pack opener with animation
│   ├── quests/          # Daily/weekly quests
│   ├── profile/         # User profile + stats
│   │   └── settings/    # App settings
│   └── english-pass/    # Season pass (mock)
├── onboarding/          # First-time user flow
├── api/content/generate/ # Claude API content generation
└── page.tsx             # Landing/splash redirect
```

### Layout Hierarchy

```
RootLayout (html, body, Providers)
  └── (app)/layout.tsx (client: hydration check, onboarding guard)
      └── AppShell (XPBar sticky + main content + BottomNav fixed)
          └── Page content (max-w-lg mx-auto, px-4)
```

### Data Flow

```
Zustand Store (game-store.ts)
  ├── Persist to localStorage (automatic)
  ├── Hydration detection (useGameStoreHydrated hook)
  └── Consumed by all (app) pages via hooks

Future: Zustand ←→ Directus sync (Phase 7)
```

## Component Architecture

### Layout Components
- **AppShell** — Root wrapper: sticky XPBar + scrollable content + fixed BottomNav
- **BottomNav** — 5 tabs: Dashboard, Learn, Collection, Packs, Profile (always visible)
- **XPBar** — Sticky top bar showing XP, rank, streak
- **Sidebar** — Desktop nav (permanently hidden in mobile-first approach)
- **NotificationLayer** — Toast notifications overlay

### UI Primitives
- **Button** — Variants: primary, secondary, ghost, danger; sizes: sm, md, lg
- **Card** — Container with padding variants and hover states
- **Badge** — Status indicators with color variants
- **ProgressBar** — Animated XP/quest progress
- **Toast** — Notification popups

### Feature Components
- **QuestCard** — Quest display with progress bar
- **StreakCounter** — Visual streak display
- **ThemeCard** — Theme selection cards for learn page

## State Architecture

### game-store.ts (Central State)

```typescript
interface GameState {
  // User
  userName, userAge, englishLevel, sensoryProfile
  onboardingComplete

  // Gamification
  xpTotal, rank, currentStreak, bestStreak
  streakShields, lastPlayDate

  // Content
  collectedCards[], availablePacks[]
  dailyQuests[]

  // Session
  currentSession, exerciseHistory[]

  // Actions
  addXP(), completeExercise(), openPack()
  updateQuestProgress(), markCardsAsSeen()
  completeOnboarding()
}
```

### notification-store.ts
- Toast queue management
- Auto-dismiss timers

## TEA Accessibility Architecture

**Three sensory profiles applied via `data-sensory` attribute on `<html>`:**

1. **Standard** — Full animations, celebrations, sound effects
2. **Calm** — Reduced motion, muted colors, slower transitions
3. **Minimal** — No animations, minimal color, text-focused

**Implementation**: CSS custom properties defined per profile in `globals.css`, consumed by Tailwind via `var(--property)` references.

## PWA Architecture

- **manifest.json** — Standalone display, start_url: /dashboard
- **sw.js** — Basic service worker (registered via React component)
- **ServiceWorkerRegistration.tsx** — Client-side registration with fallback
