# Stack Analysis

## Runtime & Framework

- **Next.js 16.1.6** — App Router, React Server Components (though most pages are "use client")
- **React 19.2.3** — Latest with concurrent features
- **TypeScript 5** — Strict mode enabled
- **Node.js** — Windows environment

## Build System

- **Turbopack** — Default bundler in Next.js 16 (no Webpack fallback)
- **PostCSS** — Via `@tailwindcss/postcss` plugin
- **ESLint 9** — With `eslint-config-next`

## Styling

- **Tailwind CSS 4** — New `@theme inline` syntax, CSS-first config
- **CSS Custom Properties** — Extensive use for TEA sensory profiles
- **clsx + tailwind-merge** — Dynamic class composition via `cn()` utility

## State Management

- **Zustand 5.0.11** — With `persist` middleware for localStorage
- **Custom hydration hook** — `useGameStoreHydrated()` for SSR compat

## Data Fetching

- **TanStack React Query 5** — Configured but not yet heavily used (pending backend)
- **Directus SDK 21.1.0** — Client configured, schema defined, not yet active

## AI Integration

- **@anthropic-ai/sdk 0.78.0** — Claude API for content generation (API route exists)

## UI

- **Lucide React 0.575.0** — Icon library
- **Custom UI components** — Button, Card, Badge, ProgressBar, Toast (all in src/components/ui/)

## Dev Environment

- **Windows** — Path quoting needed for parentheses in route groups
- **Port 5000** — Dev server runs on `next dev -p 5000` (port 3000 often occupied)
- **No testing framework** — Not yet configured (will need in Phase 8)

## Key Versions

```json
{
  "next": "16.1.6",
  "react": "19.2.3",
  "typescript": "^5",
  "tailwindcss": "^4",
  "zustand": "^5.0.11",
  "@directus/sdk": "^21.1.0",
  "@anthropic-ai/sdk": "^0.78.0",
  "@tanstack/react-query": "^5.90.21"
}
```
