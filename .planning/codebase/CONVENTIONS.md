# Conventions Analysis

## Code Style

### TypeScript
- **Strict mode** enabled in tsconfig
- **Path aliases**: `@/*` maps to `./src/*`
- **Type casting**: `as any` used for browser APIs without TS types (Web Speech API, NextAuth v5 beta)
- **Interface naming**: PascalCase, no `I` prefix (e.g., `GameState`, `ContentUnit`)

### React
- **"use client"** directive on all pages (mobile-first PWA, heavy interactivity)
- **Hooks rules**: All hooks MUST be called before any early returns (React requirement)
- **useEffect for side effects**: Never call setTimeout/setInterval in render body
- **Store access**: `useGameStore((s) => s.property)` selector pattern

### Component Patterns
- **Functional components** exclusively (no class components)
- **Named exports** for components: `export function Dashboard() {}`
- **Default exports** for pages: `export default function DashboardPage() {}`
- **Props interfaces**: Inline or separate `interface Props {}` above component

### File Naming
- **Pages**: `page.tsx` (Next.js convention)
- **Components**: PascalCase: `AppShell.tsx`, `QuestCard.tsx`
- **Utilities**: camelCase: `constants.ts`, `cn.ts`
- **Types**: camelCase: `gamification.ts`, `exercises.ts`
- **Stores**: camelCase with suffix: `game-store.ts`, `notification-store.ts`

## Styling Conventions

### Tailwind CSS 4
- **@theme inline** syntax for custom properties (not `@layer`)
- **CSS custom properties** for TEA sensory profiles: `var(--color-primary)`, `var(--shadow-lg)`
- **`cn()` utility** for dynamic class composition: `cn("base-class", conditional && "extra")`
- **Responsive**: Mobile-first, breakpoints rarely used (mobile is the primary target)

### Layout Rules
- **max-w-lg mx-auto** for all page content (centered mobile layout)
- **px-4 py-4** standard page padding
- **pb-24** bottom padding to clear BottomNav
- **No Sidebar** visible (hidden class, mobile-first)
- **grid-cols-2 gap-3** for card grids

### TEA Accessibility
- **data-sensory** attribute on `<html>`: "standard" | "calm" | "minimal"
- **data-high-contrast** attribute for high contrast mode
- **CSS variables** change per profile (no JS needed for visual changes)
- **No flashing animations** in calm/minimal profiles

## Naming Conventions

### Game Concepts
- **XP**: Experience points (xpTotal, addXP)
- **Rank**: Player tier (RankId type: "rookie" | "player" | "pro" | "champion" | "legend")
- **Streak**: Consecutive play days (currentStreak, bestStreak)
- **Pack**: Card pack with rarity tier
- **Card**: Collected vocabulary/phrase card

### Data Patterns
- **Constants** centralized in `src/lib/utils/constants.ts`
- **Types** in `src/types/` (one file per domain)
- **Business logic** in `src/lib/` (one folder per domain)
- **State** in `src/stores/` (Zustand stores)

## Import Conventions

```typescript
// 1. React/Next imports
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 2. External libraries
import { useGameStore } from "@/stores/game-store";

// 3. Internal components
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

// 4. Types
import type { RankId } from "@/lib/utils/constants";
```

## Git Conventions

- **Branch**: `master` (single branch so far)
- **No commits yet** for the main feature work (large uncommitted changeset)
- **Future**: GSD will enforce atomic commits per task
