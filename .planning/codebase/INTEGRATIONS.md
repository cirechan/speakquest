# Integrations Analysis

## Directus CMS (Backend)

**Status**: Schema defined, client configured, NOT yet active
**Connection**: `@directus/sdk` v21.1.0

### Schema (src/lib/directus/schema.ts)

Collections defined:
- **Users**: directus_users, user_preferences
- **Content**: themes, content_units, dialogues, dialogue_lines, content_generations
- **Progress**: user_content_progress, exercise_sessions, exercise_attempts
- **Gamification**: xp_events, quests, user_quests, word_packs, user_word_packs, albums, seasons, achievements
- **Voice**: audio_cache

### Infrastructure

- Docker Compose in `directus/` directory
- PostgreSQL database
- Local development only (no production deployment yet)

## Claude API (AI Content Generation)

**Status**: API route exists, prompt templates defined, NOT yet integrated with UI

### Files
- `src/app/api/content/generate/route.ts` — Next.js API route
- `src/lib/content/generator.ts` — Generation logic
- `src/lib/content/prompts.ts` — Themed prompt templates

### Environment
- Requires `ANTHROPIC_API_KEY` in `.env.local`
- Uses Claude sonnet model for content generation

## Web Speech API (Voice)

**Status**: Abstraction layer built, NOT yet connected to exercises

### Files
- `src/lib/voice/service.ts` — Factory pattern interface
- `src/lib/voice/web-speech-tts.ts` — Text-to-speech implementation
- `src/lib/voice/web-speech-stt.ts` — Speech-to-text implementation
- `src/lib/voice/pronunciation.ts` — Pronunciation scoring logic

### Browser Compatibility
- TTS: Good support (Chrome, Edge, Safari, Firefox)
- STT: Chrome/Edge only (WebKit prefix needed)
- Future: Swap to Chatterbox TTS + Whisper STT via factory pattern

## PWA

**Status**: Configured, basic functionality

### Files
- `public/manifest.json` — App manifest (standalone, /dashboard start)
- `public/sw.js` — Service worker (basic cache)
- `src/components/ServiceWorkerRegistration.tsx` — Client registration

### Capabilities
- Installable as PWA on mobile
- Basic caching via service worker
- Needs enhancement for offline-first (Phase 8)

## localStorage (Zustand Persist)

**Status**: Active, primary data store

### Behavior
- All game state persisted to localStorage via Zustand `persist` middleware
- Hydration detection via `useGameStoreHydrated()` hook
- No server sync yet (Phase 7)
- Risk: Data loss on browser clear (mitigated by future server sync)

## External Dependencies

| Dependency | Purpose | Status |
|-----------|---------|--------|
| Directus + PostgreSQL | Backend CMS, user data | Configured, not active |
| Claude API (Anthropic) | Content generation | Route exists, not integrated |
| Web Speech API | Voice interaction | Abstraction built, not connected |
| TanStack React Query | Server state management | Configured, barely used |
