# Requirements: SpeakQuest

**Defined:** 2025-02-23
**Core Value:** Every child, including those with TEA, can practice English in a fun, adaptive environment they want to return to daily.

## v1 Requirements

### Foundation (COMPLETE)

- [x] **FOUND-01**: Next.js 16 + TypeScript + Tailwind CSS 4 project setup with route groups
- [x] **FOUND-02**: TEA accessibility system with 3 sensory profiles via CSS variables
- [x] **FOUND-03**: Mobile-first layout with BottomNav, XPBar, AppShell (max-w-lg)
- [x] **FOUND-04**: Zustand persistent store with proper hydration detection
- [x] **FOUND-05**: Onboarding flow (name, age, level, sensory preference)
- [x] **FOUND-06**: PWA manifest + service worker registration
- [x] **FOUND-07**: All main pages: Dashboard, Learn, Collection, Packs, Quests, Profile
- [x] **FOUND-08**: Gamification: XP system, 5 Ranks, Streaks with shields
- [x] **FOUND-09**: Word Pack system with 4 rarity tiers and pack opener with animation
- [x] **FOUND-10**: Exercise engine with 6 exercise types
- [x] **FOUND-11**: SM-2 spaced repetition algorithm implementation
- [x] **FOUND-12**: Daily quests connected to game store
- [x] **FOUND-13**: Notification system (toast layer)

### Content & Exercises

- [ ] **CONT-01**: Seed initial vocabulary (50+ words) for each of 8 themes
- [ ] **CONT-02**: Seed initial phrases (20+ phrases) for each of 8 themes
- [ ] **CONT-03**: Exercise session builder creates coherent 5-10 exercise sessions
- [ ] **CONT-04**: Content difficulty mapping (beginner → advanced per word/phrase)
- [ ] **CONT-05**: Exercise type selection based on content type and difficulty
- [ ] **CONT-06**: Progress-aware content selection (SM-2 scheduling integration)

### Voice

- [ ] **VOICE-01**: TTS pronunciation playback for all English content
- [ ] **VOICE-02**: STT recording and transcription for pronunciation exercises
- [ ] **VOICE-03**: Pronunciation scoring (comparison of spoken vs expected)
- [ ] **VOICE-04**: Voice factory pattern (Web Speech → Chatterbox/Whisper swap)
- [ ] **VOICE-05**: Visual feedback during recording (waveform or indicator)

### Claude Content Generation

- [ ] **CLAUD-01**: Content generation API route with rate limiting
- [ ] **CLAUD-02**: Themed prompt templates for vocabulary generation
- [ ] **CLAUD-03**: Themed prompt templates for phrase/dialogue generation
- [ ] **CLAUD-04**: Age-appropriate content filtering
- [ ] **CLAUD-05**: Content review/approval pipeline before adding to pool

### Full Gamification

- [ ] **GAMI-01**: Weekly quests alongside daily quests
- [ ] **GAMI-02**: Achievement/badge system with unlock conditions
- [ ] **GAMI-03**: Season system with themed rewards and English Pass
- [ ] **GAMI-04**: Collection albums with completion rewards
- [ ] **GAMI-05**: Streak shield mechanics (earn/use)

### Authentication & Backend

- [ ] **AUTH-01**: Directus authentication (email/password sign up)
- [ ] **AUTH-02**: Session persistence across browser refresh
- [ ] **AUTH-03**: Sync local Zustand state to Directus on login
- [ ] **AUTH-04**: Conflict resolution (local vs server state)

### Polish & Performance

- [ ] **PERF-01**: Offline-first service worker with smart caching
- [ ] **PERF-02**: 60fps animations with reduced motion support
- [ ] **PERF-03**: Loading skeletons for all async content
- [ ] **PERF-04**: Error boundaries with friendly error messages
- [ ] **TEA-01**: Full runtime sensory profile switching
- [ ] **TEA-02**: Sensory overload detection with auto calm-down

## v2 Requirements

### Social & Classroom

- **SOCL-01**: Class/group system for teachers
- **SOCL-02**: Teacher dashboard for progress monitoring
- **SOCL-03**: Parent dashboard with progress reports
- **SOCL-04**: Optional leaderboard (class-scoped, not global)

### Advanced Voice

- **ADVV-01**: Chatterbox TTS for more natural voice
- **ADVV-02**: Whisper STT for better pronunciation analysis
- **ADVV-03**: Dialogue practice with AI conversation partner

### Monetization

- **MONT-01**: Premium English Pass with exclusive rewards
- **MONT-02**: In-app purchase for cosmetic items
- **MONT-03**: School/institution licensing

## Out of Scope

| Feature | Reason |
|---------|--------|
| Native mobile app | PWA-first approach, native only if traction proves it |
| Real-time multiplayer | Too complex for v1, safety concerns with children |
| Video lessons | Bandwidth/storage costs, text+audio sufficient |
| User-generated content | Moderation complexity with children |
| Chat/messaging | Child safety concerns, requires moderation infrastructure |
| OAuth/social login | Email/password sufficient, avoids third-party data sharing for minors |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 to FOUND-13 | Phase 1 | Complete |
| CONT-01, CONT-02, CONT-04 | Phase 2 | Pending |
| CONT-03, CONT-05, CONT-06 | Phase 3 | Pending |
| VOICE-01, VOICE-02, VOICE-03, VOICE-04, VOICE-05 | Phase 4 | Pending |
| CLAUD-01, CLAUD-02, CLAUD-03, CLAUD-04, CLAUD-05 | Phase 5 | Pending |
| GAMI-01, GAMI-02, GAMI-03, GAMI-04, GAMI-05 | Phase 6 | Pending |
| AUTH-01, AUTH-02, AUTH-03, AUTH-04 | Phase 7 | Pending |
| PERF-01 to PERF-04, TEA-01, TEA-02 | Phase 8 | Pending |

**Coverage:**
- v1 requirements: 39 total
- Mapped to phases: 39
- Unmapped: 0 ✓

---
*Requirements defined: 2025-02-23*
*Last updated: 2025-02-23 after Phase 1 completion*
