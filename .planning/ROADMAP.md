# Roadmap: SpeakQuest

## Overview

SpeakQuest evolves from a working mobile-first PWA shell (Phase 1, complete) through content population, exercise intelligence, voice interaction, AI-powered content generation, full gamification, backend integration, and final polish — delivering a complete gamified English-learning experience for Spanish-speaking children with TEA support.

## Phases

- [x] **Phase 1: Foundation** - Project setup, layout, gamification, PWA, mobile-first UI
- [x] **Phase 2: Content Seeding** - Populate vocabulary and phrases for all 8 themes + session builder
- [ ] **Phase 3: Exercise Intelligence** - Difficulty progression, SM-2 scheduling integration
- [ ] **Phase 4: Voice Integration** - TTS/STT via Web Speech API with factory pattern
- [ ] **Phase 5: Claude Content Pipeline** - AI-powered content generation with themed prompts
- [ ] **Phase 6: Full Gamification** - Seasons, achievements, albums, streak shields
- [ ] **Phase 7: Auth & Backend Sync** - Directus authentication and state synchronization
- [ ] **Phase 8: Polish & Performance** - Offline-first, animations, error handling, TEA refinement

## Phase Details

### Phase 1: Foundation
**Goal**: Working mobile-first PWA with all pages, gamification, and TEA accessibility
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01 through FOUND-13
**Success Criteria** (what must be TRUE):
  1. App loads as PWA, installable on mobile
  2. Onboarding captures user preferences and sets sensory profile
  3. Dashboard shows XP, rank, streak, and daily quests
  4. Exercise play flow works end-to-end (start → play → results → rewards)
  5. Pack opener reveals cards with animation phases
  6. Collection displays earned cards filtered by rarity/theme
  7. All UI is mobile-first (max-w-lg), no horizontal overflow
**Plans**: 1 plan (completed as single implementation sprint)
**Status**: ✅ Complete

Plans:
- [x] 01-01: Foundation setup, layout, gamification, PWA, mobile-first pass

### Phase 2: Content Seeding
**Goal**: Populate the content database with vocabulary/phrases for all 8 themes at all difficulty levels
**Depends on**: Phase 1
**Requirements**: CONT-01, CONT-02, CONT-04
**Success Criteria** (what must be TRUE):
  1. Each of 8 themes has 50+ vocabulary words with translations and difficulty tags
  2. Each of 8 themes has 20+ phrases with context and translations
  3. Content has proper difficulty mapping (beginner → advanced)
  4. Content is stored in structured format accessible by exercise engine
**Plans**: TBD

**Status**: ✅ Complete

Plans:
- [x] 02-01: Content bank data structure and query helpers (bank.ts)
- [x] 02-02: Seed 160+ vocabulary items across 8 themes × 3 levels
- [x] 02-03: Seed 30+ phrases across 8 themes × 3 levels
- [x] 02-04: Session builder that generates 6 exercise types from content (session-builder.ts)
- [x] 02-05: Replace mock exercises in play page with real content
- [x] 02-06: Connect learn page theme counts to content bank

### Phase 3: Exercise Intelligence
**Goal**: Smart session builder that creates coherent, adaptive exercise sessions
**Depends on**: Phase 2
**Requirements**: CONT-03, CONT-05, CONT-06
**Success Criteria** (what must be TRUE):
  1. Session builder creates 5-10 exercise sessions from content pool
  2. Exercise type is selected based on content type and difficulty
  3. SM-2 scheduling determines which content appears next
  4. Sessions feel coherent (same theme, progressive difficulty)
**Plans**: TBD

Plans:
- [ ] 03-01: Session builder algorithm and content selection
- [ ] 03-02: SM-2 scheduling integration with exercise flow
- [ ] 03-03: Adaptive difficulty and exercise type matching

### Phase 4: Voice Integration
**Goal**: Children can hear English pronunciation and practice speaking
**Depends on**: Phase 3
**Requirements**: VOICE-01 through VOICE-05
**Success Criteria** (what must be TRUE):
  1. All vocabulary/phrases can be spoken aloud via TTS
  2. Children can record pronunciation attempts via STT
  3. Pronunciation is scored and feedback is given
  4. Visual recording indicator shows when microphone is active
  5. Voice services use factory pattern for future swap
**Plans**: TBD

Plans:
- [ ] 04-01: TTS integration and voice factory pattern
- [ ] 04-02: STT recording, transcription, and pronunciation scoring
- [ ] 04-03: Voice UI components (recording indicator, playback controls)

### Phase 5: Claude Content Pipeline
**Goal**: AI generates new themed content on demand, expanding the content pool
**Depends on**: Phase 2
**Requirements**: CLAUD-01 through CLAUD-05
**Success Criteria** (what must be TRUE):
  1. API route generates vocabulary via Claude with rate limiting
  2. Themed prompts produce age-appropriate, contextual content
  3. Generated content follows same schema as seeded content
  4. Content review pipeline filters inappropriate content
**Plans**: TBD

Plans:
- [ ] 05-01: Claude API route with rate limiting and error handling
- [ ] 05-02: Themed prompt templates for vocab and phrase generation
- [ ] 05-03: Content review pipeline and age-appropriate filtering

### Phase 6: Full Gamification
**Goal**: Complete game loop with seasons, achievements, and collection depth
**Depends on**: Phase 3
**Requirements**: GAMI-01 through GAMI-05
**Success Criteria** (what must be TRUE):
  1. Weekly quests appear alongside daily quests
  2. Achievements unlock based on specific conditions (streak milestones, cards collected, etc.)
  3. Seasons rotate with themed rewards and English Pass
  4. Albums group cards with completion bonuses
  5. Streak shields can be earned and consumed
**Plans**: TBD

Plans:
- [ ] 06-01: Weekly quests and achievement system
- [ ] 06-02: Seasons, English Pass, and seasonal rewards
- [ ] 06-03: Collection albums and streak shield mechanics

### Phase 7: Auth & Backend Sync
**Goal**: User accounts persist across devices via Directus backend
**Depends on**: Phase 1
**Requirements**: AUTH-01 through AUTH-04
**Success Criteria** (what must be TRUE):
  1. User can sign up and log in via Directus
  2. Session persists across browser refresh
  3. Local Zustand state syncs to server on login
  4. Conflict resolution handles offline-then-online scenarios
**Plans**: TBD

Plans:
- [ ] 07-01: Directus auth integration (sign up, login, session)
- [ ] 07-02: State sync engine (local ↔ server)
- [ ] 07-03: Conflict resolution and offline queue

### Phase 8: Polish & Performance
**Goal**: Production-ready app with smooth UX, offline support, and full TEA refinement
**Depends on**: All previous phases
**Requirements**: PERF-01 through PERF-04, TEA-01, TEA-02
**Success Criteria** (what must be TRUE):
  1. App works fully offline after initial load
  2. All animations run at 60fps with reduced motion support
  3. Loading skeletons appear for all async operations
  4. Error boundaries catch and display friendly error messages
  5. Sensory profiles switch smoothly at runtime
  6. Overload detection triggers auto calm-down mode
**Plans**: TBD

Plans:
- [ ] 08-01: Service worker caching strategies and offline support
- [ ] 08-02: Animation polish and loading skeletons
- [ ] 08-03: Error boundaries, TEA refinement, and overload detection

## Progress

**Execution Order:**
Phases execute in order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8
(Phases 5 and 7 can run in parallel with Phase 4 and 6 respectively)

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 1/1 | Complete | 2025-02-23 |
| 2. Content Seeding | 6/6 | Complete | 2025-02-23 |
| 3. Exercise Intelligence | 0/3 | Not started | - |
| 4. Voice Integration | 0/3 | Not started | - |
| 5. Claude Content Pipeline | 0/3 | Not started | - |
| 6. Full Gamification | 0/3 | Not started | - |
| 7. Auth & Backend Sync | 0/3 | Not started | - |
| 8. Polish & Performance | 0/3 | Not started | - |

---
*Roadmap created: 2025-02-23*
*Last updated: 2025-02-23 after Phase 1 completion*
