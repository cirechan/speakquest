# SpeakQuest

## What This Is

SpeakQuest is a gamified English-learning mobile-first PWA designed specifically for Spanish-speaking children aged 6-14, with built-in adaptations for children with TEA (autism spectrum). It combines spaced repetition, voice interaction, and game mechanics (XP, ranks, streaks, card collection, word packs) to make English practice engaging and consistent.

## Core Value

**Every child, including those with TEA, should be able to practice English in a fun, low-pressure environment that adapts to their sensory needs — and come back every day because they want to, not because they have to.**

## Requirements

### Validated

<!-- Shipped and confirmed working -->

- [x] **FOUND-01**: Project setup with Next.js 16 + TypeScript + Tailwind CSS 4 — Phase 1
- [x] **FOUND-02**: Route group architecture: (auth) for login/register, (app) for authenticated pages — Phase 1
- [x] **FOUND-03**: TEA accessibility system with 3 sensory profiles (standard/calm/minimal) via CSS variables — Phase 1
- [x] **FOUND-04**: Mobile-first layout with BottomNav, XPBar, centered content (max-w-lg) — Phase 1
- [x] **FOUND-05**: Zustand persistent state store with hydration detection — Phase 1
- [x] **FOUND-06**: Dashboard, Learn, Collection, Packs, Quests, Profile pages — Phase 1
- [x] **FOUND-07**: Onboarding flow capturing name, age, English level, sensory preferences — Phase 1
- [x] **FOUND-08**: PWA setup with manifest.json and service worker — Phase 1
- [x] **FOUND-09**: Gamification system: XP, Ranks (Rookie→Legend), Streaks with shields — Phase 1
- [x] **FOUND-10**: Word Pack system with rarity (Common/Rare/Epic/Legendary) and pack opener — Phase 1
- [x] **FOUND-11**: Exercise engine with 6 types: echo_challenge, spy_mission, speed_reader, word_builder, boss_challenge, tongue_twister — Phase 1
- [x] **FOUND-12**: SM-2 spaced repetition algorithm — Phase 1
- [x] **FOUND-13**: Daily quests system connected to game store — Phase 1

### Active

<!-- Current scope. Building toward these. -->

- [ ] **CONT-01**: Content seeding — populate initial vocabulary/phrases for all 8 themes
- [ ] **CONT-02**: Exercise session builder — create coherent 5-10 exercise sessions from content pool
- [ ] **CONT-03**: Difficulty progression — exercises adapt based on user performance history
- [ ] **VOICE-01**: Web Speech API TTS integration for English word/phrase pronunciation
- [ ] **VOICE-02**: Web Speech API STT for pronunciation practice and scoring
- [ ] **VOICE-03**: Voice abstraction factory pattern (swap to Chatterbox/Whisper later)
- [ ] **CLAUD-01**: Claude API content generation pipeline with themed prompts
- [ ] **CLAUD-02**: Dynamic exercise generation based on user level and theme preferences
- [ ] **GAMI-01**: Seasons/English Pass system with seasonal rewards
- [ ] **GAMI-02**: Achievement badges system
- [ ] **GAMI-03**: Leaderboard (optional, class-based)
- [ ] **AUTH-01**: User authentication via Directus (email/password)
- [ ] **AUTH-02**: User progress sync to Directus/PostgreSQL backend
- [ ] **PERF-01**: Offline-first with service worker caching strategies
- [ ] **PERF-02**: Smooth 60fps animations and transitions
- [ ] **TEA-01**: Full TEA profile switching at runtime with smooth transitions
- [ ] **TEA-02**: Sensory overload detection and automatic calm-down mode

### Out of Scope

<!-- Explicit boundaries -->

- Native mobile app (iOS/Android) — PWA-first, native later if traction proves it
- Real-time multiplayer — complexity too high for MVP, possible v2+
- Teacher/parent admin dashboard — separate project, after v1 student app ships
- Video lessons — bandwidth/storage costs, text+audio sufficient for v1
- Payments/subscriptions — free tier first, monetization after validation
- Social features (chat, friends) — safety concerns with children, defer to v2+

## Context

- **Target audience**: Spanish-speaking children aged 6-14, many with TEA/autism spectrum
- **Educational approach**: Gamification + spaced repetition + voice practice
- **Content themes**: 8 initial themes (Gaming, Sports, Movies/TV, Music, Daily Life, School, Food/Drinks, Travel)
- **Backend**: Directus CMS + PostgreSQL (Docker Compose for local dev)
- **AI integration**: Claude API (sonnet) for dynamic content generation
- **Voice**: Web Speech API now → Chatterbox TTS / Whisper STT later via factory pattern
- **Platform**: PWA deployed to web, installable on mobile

## Constraints

- **Tech Stack**: Next.js 16 + TypeScript + Tailwind CSS 4 + Directus — locked in, all code exists
- **Mobile-First**: ALL interfaces must be designed for mobile viewport first (max-w-lg), desktop is secondary
- **TEA Compliance**: Every visual/audio element must respect sensory profiles — no flashing, configurable animations
- **Windows Dev**: Development on Windows — bash paths with parentheses need quoting
- **Turbopack**: Next.js 16 uses Turbopack by default, cannot switch to Webpack
- **Children Safety**: No PII collection beyond name/age, no social features in v1
- **Offline**: Core exercise flow must work offline after initial load

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Zustand over Redux | Simpler API, built-in persist, less boilerplate | ✓ Good |
| Route groups (auth)/(app) | Clean separation of authenticated vs public pages | ✓ Good |
| CSS variables for TEA profiles | Runtime switching without JS, works with Tailwind 4 @theme | ✓ Good |
| SM-2 for spaced repetition | Proven algorithm, simple to implement, good for language learning | ✓ Good |
| Web Speech API first | Zero cost, built-in, factory pattern allows swap later | — Pending |
| Directus as CMS backend | SDK available, headless, good for content management | — Pending |
| Mobile-first, no Sidebar | BottomNav always visible, Sidebar permanently hidden | ✓ Good |
| Pack opener with animation phases | Engaging card reveal mechanic kids love | ✓ Good |

---
*Last updated: 2025-02-23 after Phase 1 completion and mobile-first rewrite*
