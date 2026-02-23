// TypeScript schema matching Directus collections.
// This file defines the shape of all collections so the SDK provides type safety.

export interface DirectusSchema {
  // === User Collections ===
  directus_users: DirectusUser[];
  user_preferences: UserPreferencesRow[];

  // === Content Collections ===
  themes: ThemeRow[];
  content_units: ContentUnitRow[];
  dialogues: DialogueRow[];
  dialogue_lines: DialogueLineRow[];
  content_generations: ContentGenerationRow[];

  // === Progress ===
  user_content_progress: UserContentProgressRow[];
  exercise_sessions: ExerciseSessionRow[];
  exercise_attempts: ExerciseAttemptRow[];

  // === Gamification ===
  xp_events: XPEventRow[];
  quests: QuestRow[];
  user_quests: UserQuestRow[];
  word_packs: WordPackRow[];
  user_word_packs: UserWordPackRow[];
  albums: AlbumRow[];
  seasons: SeasonRow[];
  season_levels: SeasonLevelRow[];
  user_seasons: UserSeasonRow[];
  avatar_items: AvatarItemRow[];
  achievements: AchievementRow[];
  user_achievements: UserAchievementRow[];

  // === Voice ===
  audio_cache: AudioCacheRow[];
}

// === User ===
export interface DirectusUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  // Custom fields
  display_name: string;
  native_language: string;
  current_level: string;
  xp_total: number;
  xp_current_level: number;
  rank: string;
  avatar_config: Record<string, unknown> | null;
  streak_current: number;
  streak_best: number;
  streak_shields: number;
  last_activity_date: string | null;
  onboarding_complete: boolean;
}

export interface UserPreferencesRow {
  id: string;
  user_id: string;
  favorite_themes: string[];
  difficulty_mode: string;
  session_duration: number;
  daily_goal_xp: number;
  preferred_voice: string;
  speech_rate: number;
  sensory_mode: string;
  reduced_motion: boolean;
  reduced_sound: boolean;
  text_size: string;
  high_contrast: boolean;
  predictable_layout: boolean;
  timer_visible: boolean;
  celebration_level: string;
}

// === Content ===
export interface ThemeRow {
  id: string;
  slug: string;
  name_en: string;
  name_es: string;
  description_en: string;
  description_es: string;
  icon: string;
  color: string;
  sort_order: number;
  status: string;
}

export interface ContentUnitRow {
  id: string;
  theme_id: string;
  content_type: string;
  difficulty_level: string;
  difficulty_score: number;
  english_text: string;
  spanish_translation: string;
  phonetic_hint: string;
  context_sentence: string;
  context_translation: string;
  audio_url: string | null;
  image_url: string | null;
  tags: string[];
  grammar_points: string[];
  source: string;
  ai_generation_id: string | null;
  quality_score: number | null;
  status: string;
  date_created: string;
  date_updated: string;
}

export interface DialogueRow {
  id: string;
  theme_id: string;
  title_en: string;
  title_es: string;
  scenario_description: string;
  difficulty_level: string;
  status: string;
  source: string;
}

export interface DialogueLineRow {
  id: string;
  dialogue_id: string;
  speaker: string;
  english_text: string;
  spanish_translation: string;
  line_order: number;
  audio_url: string | null;
  emotion: string;
}

export interface ContentGenerationRow {
  id: string;
  user_id: string | null;
  prompt_used: string;
  model_version: string;
  request_params: Record<string, unknown>;
  response_raw: string;
  items_generated: number;
  status: string;
  error_message: string | null;
  date_created: string;
  processing_time_ms: number | null;
}

// === Progress ===
export interface UserContentProgressRow {
  id: string;
  user_id: string;
  content_unit_id: string;
  repetitions: number;
  ease_factor: number;
  interval_days: number;
  next_review_date: string | null;
  last_review_date: string | null;
  times_seen: number;
  times_correct: number;
  times_incorrect: number;
  average_response_ms: number | null;
  last_quality_score: number | null;
  mastery_level: string;
  best_pronunciation: number | null;
  last_pronunciation: number | null;
}

export interface ExerciseSessionRow {
  id: string;
  user_id: string;
  theme_id: string | null;
  session_type: string;
  started_at: string;
  completed_at: string | null;
  duration_seconds: number | null;
  total_exercises: number;
  correct_count: number;
  xp_earned: number;
  streak_maintained: boolean;
  difficulty_level: string;
  adaptive_adjustments: number;
  exercise_types_used: string[];
}

export interface ExerciseAttemptRow {
  id: string;
  session_id: string;
  content_unit_id: string;
  exercise_type: string;
  user_response: string;
  correct_response: string;
  is_correct: boolean;
  quality_score: number;
  score_detail: Record<string, unknown>;
  time_taken_ms: number;
  attempt_order: number;
  hints_used: number;
}

// === Gamification ===
export interface XPEventRow {
  id: string;
  user_id: string;
  amount: number;
  event_type: string;
  source_id: string;
  source_type: string;
  multiplier: number;
  date_created: string;
}

export interface QuestRow {
  id: string;
  quest_type: string;
  title_en: string;
  title_es: string;
  description_en: string;
  description_es: string;
  target_type: string;
  target_count: number;
  theme_restriction: string | null;
  exercise_type_restriction: string | null;
  xp_reward: number;
  available_from: string;
  available_until: string;
  recurrence: string;
  sort_order: number;
  status: string;
}

export interface UserQuestRow {
  id: string;
  user_id: string;
  quest_id: string;
  current_progress: number;
  status: string;
  started_at: string;
  completed_at: string | null;
  rewards_claimed: boolean;
}

export interface WordPackRow {
  id: string;
  content_unit_id: string;
  rarity: string;
  album_id: string;
  card_art_url: string | null;
  flavor_text_en: string;
  flavor_text_es: string;
  sort_order: number;
}

export interface UserWordPackRow {
  id: string;
  user_id: string;
  word_pack_id: string;
  obtained_at: string;
  obtained_via: string;
  is_new: boolean;
}

export interface AlbumRow {
  id: string;
  theme_id: string;
  name_en: string;
  name_es: string;
  description_en: string;
  description_es: string;
  total_cards: number;
  cover_art_url: string | null;
  completion_reward_xp: number;
  status: string;
}

export interface SeasonRow {
  id: string;
  name_en: string;
  name_es: string;
  theme_description: string;
  start_date: string;
  end_date: string;
  total_levels: number;
  status: string;
}

export interface SeasonLevelRow {
  id: string;
  season_id: string;
  level_number: number;
  xp_required: number;
  reward_type: string;
  reward_data: Record<string, unknown>;
}

export interface UserSeasonRow {
  id: string;
  user_id: string;
  season_id: string;
  current_level: number;
  xp_in_season: number;
  rewards_claimed: number[];
}

export interface AvatarItemRow {
  id: string;
  category: string;
  name_en: string;
  name_es: string;
  image_url: string;
  unlock_method: string;
  unlock_requirement: Record<string, unknown>;
  sort_order: number;
}

export interface AchievementRow {
  id: string;
  slug: string;
  name_en: string;
  name_es: string;
  description_en: string;
  description_es: string;
  icon_url: string | null;
  category: string;
  requirement_type: string;
  requirement_value: number;
  xp_reward: number;
}

export interface UserAchievementRow {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  notified: boolean;
}

// === Voice ===
export interface AudioCacheRow {
  id: string;
  text_content: string;
  text_hash: string;
  voice_id: string;
  language: string;
  audio_url: string;
  file_size_bytes: number;
  duration_ms: number;
  provider: string;
  date_created: string;
  last_accessed: string;
  access_count: number;
}
