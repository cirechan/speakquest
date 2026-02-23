# Concerns & Technical Debt

## High Priority

### 1. No Version Control for Feature Work
**Impact**: HIGH — All Phase 1 work is uncommitted
**Details**: The entire src/ directory (components, pages, stores, types, lib) is untracked in git. A single `git reset --hard` or disk failure would lose everything.
**Resolution**: Commit all current work before starting Phase 2. GSD will enforce atomic commits going forward.

### 2. All Data is Mock/Local Only
**Impact**: HIGH — No real content, no backend connection
**Details**: Exercise content, vocabulary, and phrases are hardcoded. All user state lives in localStorage only (Zustand persist). No Directus backend is active.
**Resolution**: Phase 2 (content seeding) and Phase 7 (auth + sync) address this.

### 3. No Error Boundaries
**Impact**: MEDIUM — Errors crash entire app
**Details**: No React error boundaries exist. A runtime error in any component crashes the full page with no recovery.
**Resolution**: Phase 8 (Polish) adds error boundaries with friendly messages.

## Medium Priority

### 4. Windows + Turbopack Cache Issues
**Impact**: MEDIUM — Dev experience pain
**Details**: Turbopack occasionally produces ChunkLoadError. Fix requires killing all Node processes (`taskkill /F /IM node.exe`), deleting `.next/`, and restarting. Browser cache also needs hard refresh.
**Resolution**: Ongoing dev workflow issue. No code fix available — Turbopack limitation.

### 5. NextAuth v5 Beta Typing Issues
**Impact**: LOW — Cosmetic, `as any` casts work
**Details**: NextAuth v5 beta has incomplete TypeScript types. Current workaround: `as any` casts for session objects.
**Resolution**: Will improve as NextAuth v5 stabilizes. Not blocking.

### 6. No Offline Support
**Impact**: MEDIUM — PWA promise not fully delivered
**Details**: Service worker exists but only does basic caching. Core exercise flow should work offline.
**Resolution**: Phase 8 implements proper caching strategies.

### 7. Empty Component Directories
**Impact**: LOW — Placeholders for future features
**Details**: `src/components/accessibility/`, `src/components/exercises/`, `src/components/voice/` are empty directories waiting for Phase 3-4 implementations.
**Resolution**: Will be populated as respective phases execute.

## Low Priority

### 8. Sidebar Component Unused
**Impact**: LOW — Dead code
**Details**: `Sidebar.tsx` exists but is permanently hidden (`className="hidden"`). Kept for potential desktop enhancement in v2.
**Resolution**: Can remove in Phase 8 cleanup, or repurpose for desktop breakpoint in v2.

### 9. English Pass Page is Mock
**Impact**: LOW — Placeholder for Season system
**Details**: `english-pass/page.tsx` uses hardcoded mock data. Will be connected to real season data in Phase 6.
**Resolution**: Phase 6 (Full Gamification) implements real seasons.

### 10. No Logging or Analytics
**Impact**: LOW — No visibility into production usage
**Details**: No error tracking, analytics, or logging configured.
**Resolution**: v2 concern — add when preparing for production deployment.

## Technical Debt Summary

| Category | Count | Blocking? |
|----------|-------|-----------|
| Data/State | 2 | Phases 2, 7 |
| Error handling | 1 | Phase 8 |
| Dev experience | 2 | Ongoing |
| Dead code | 2 | Phase 8 cleanup |
| Infrastructure | 1 | v2 |
