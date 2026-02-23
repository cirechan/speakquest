"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { INITIAL_THEMES } from "@/lib/utils/constants";
import { useGameStore } from "@/stores/game-store";
import { cn } from "@/lib/utils/cn";

// === Sound effects via Web Audio API ===
function playSound(type: "correct" | "wrong" | "complete" | "streak") {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === "correct") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.08);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start(); osc.stop(ctx.currentTime + 0.35);
    } else if (type === "wrong") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(196, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(); osc.stop(ctx.currentTime + 0.3);
    } else if (type === "streak") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(659, ctx.currentTime);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.06);
      osc.frequency.setValueAtTime(988, ctx.currentTime + 0.12);
      osc.frequency.setValueAtTime(1047, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start(); osc.stop(ctx.currentTime + 0.4);
    } else if (type === "complete") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.12);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.24);
      osc.frequency.setValueAtTime(1047, ctx.currentTime + 0.36);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.start(); osc.stop(ctx.currentTime + 0.6);
    }
  } catch { /* Audio not available */ }
}

function speakEnglish(text: string) {
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith("en"));
    if (enVoice) utterance.voice = enVoice;
    window.speechSynthesis.speak(utterance);
  } catch { /* Not available */ }
}

// === Exercise types (re-exported from session-builder) ===
import { buildSession, type Exercise } from "@/lib/content/session-builder";

// Extract specific exercise types for UI components
type MCExercise = Exercise & { type: "vocabulary" | "listening" | "fill_blank"; questionEs: string; options: string[]; correctIndex: number };
type WordBuilderExercise = Exercise & { type: "word_builder"; questionEs: string; letters: string[]; answer: string };
type FillBlankExercise = Exercise & { type: "fill_blank"; sentence: string; questionEs: string; options: string[]; correctIndex: number };
type MatchingExercise = Exercise & { type: "matching"; pairs: Array<{ en: string; es: string }> };
type TranslatePhraseExercise = Exercise & { type: "translate_phrase"; questionEs: string; words: string[]; answer: string[]; distractors: string[] };

const CORRECT_DELAY = 1200;
const WRONG_DELAY = 2200;
const HINT_XP_PENALTY = 5;
const MAX_HINTS_PER_SESSION = 3;

// === Sub-components for exercise types ===

function WordBuilderUI({ exercise, onComplete }: { exercise: WordBuilderExercise; onComplete: (correct: boolean) => void }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [available, setAvailable] = useState<Array<{ letter: string; idx: number }>>([]);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    setSelected([]);
    setAvailable(exercise.letters.map((l, i) => ({ letter: l, idx: i })));
    setAnswered(false);
  }, [exercise]);

  const builtWord = selected.map(i => exercise.letters[i]).join("");
  const isComplete = builtWord.length === exercise.answer.length;

  function addLetter(idx: number) {
    if (answered) return;
    setSelected(prev => [...prev, idx]);
    setAvailable(prev => prev.filter(a => a.idx !== idx));
  }

  function removeLetter(position: number) {
    if (answered) return;
    const removedIdx = selected[position];
    setSelected(prev => prev.filter((_, i) => i !== position));
    setAvailable(prev => [...prev, { letter: exercise.letters[removedIdx], idx: removedIdx }].sort((a, b) => a.idx - b.idx));
  }

  function checkAnswer() {
    const correct = builtWord.toUpperCase() === exercise.answer.toUpperCase();
    setAnswered(true);
    onComplete(correct);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[var(--color-text)] text-center mb-2">
        {exercise.questionEs}
      </h2>
      <p className="text-sm text-center text-[var(--color-text-secondary)]">
        🇪🇸 {exercise.spanish}
      </p>

      {/* Built word area */}
      <div className="flex justify-center gap-2 min-h-[56px] p-3 bg-[var(--color-bg)] rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--color-border)]">
        {exercise.answer.split("").map((_, i) => (
          <button
            key={i}
            onClick={() => i < selected.length && removeLetter(i)}
            className={cn(
              "w-12 h-12 rounded-[var(--radius-md)] text-lg font-bold flex items-center justify-center transition-all",
              i < selected.length
                ? answered
                  ? builtWord[i]?.toUpperCase() === exercise.answer[i]?.toUpperCase()
                    ? "bg-[var(--color-success-light)] border-2 border-[var(--color-success)] text-[var(--color-success)]"
                    : "bg-[var(--color-error-light)] border-2 border-[var(--color-error)] text-[var(--color-error)]"
                  : "bg-[var(--color-primary-light)] border-2 border-[var(--color-primary)] text-[var(--color-primary)] active:scale-95"
                : "border-2 border-[var(--color-border)] text-transparent"
            )}
          >
            {i < selected.length ? exercise.letters[selected[i]] : "_"}
          </button>
        ))}
      </div>

      {/* Available letters */}
      {!answered && (
        <div className="flex flex-wrap justify-center gap-2">
          {available.map(({ letter, idx }) => (
            <button
              key={idx}
              onClick={() => addLetter(idx)}
              className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--color-bg-card)] border border-[var(--color-border)] text-lg font-bold text-[var(--color-text)] hover:bg-[var(--color-primary-light)] hover:border-[var(--color-primary)] active:scale-95 transition-all"
            >
              {letter}
            </button>
          ))}
        </div>
      )}

      {/* Check button */}
      {!answered && isComplete && (
        <Button size="lg" className="w-full text-lg font-bold animate-pulse-subtle" onClick={(e) => { e.stopPropagation(); checkAnswer(); }}>
          Comprobar
        </Button>
      )}
    </div>
  );
}

function MatchingUI({ exercise, onComplete }: { exercise: MatchingExercise; onComplete: (correct: boolean) => void }) {
  const [selectedEn, setSelectedEn] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [wrongPair, setWrongPair] = useState<{ en: number; es: number } | null>(null);
  const [shuffledEs, setShuffledEs] = useState<Array<{ text: string; originalIdx: number }>>([]);

  useEffect(() => {
    setSelectedEn(null);
    setMatched([]);
    setWrongPair(null);
    // Shuffle Spanish words
    const esArr = exercise.pairs.map((p, i) => ({ text: p.es, originalIdx: i }));
    for (let i = esArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [esArr[i], esArr[j]] = [esArr[j], esArr[i]];
    }
    setShuffledEs(esArr);
  }, [exercise]);

  function handleEnClick(idx: number) {
    if (matched.includes(idx)) return;
    setSelectedEn(idx);
    setWrongPair(null);
  }

  function handleEsClick(esOriginalIdx: number) {
    if (selectedEn === null || matched.includes(esOriginalIdx)) return;
    if (selectedEn === esOriginalIdx) {
      // Correct match
      const newMatched = [...matched, esOriginalIdx];
      setMatched(newMatched);
      setSelectedEn(null);
      playSound("correct");
      if (newMatched.length === exercise.pairs.length) {
        setTimeout(() => onComplete(true), 500);
      }
    } else {
      // Wrong match
      setWrongPair({ en: selectedEn, es: esOriginalIdx });
      playSound("wrong");
      setTimeout(() => {
        setWrongPair(null);
        setSelectedEn(null);
      }, 800);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[var(--color-text)] text-center">
        🎯 Empareja las palabras
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {/* English column */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-center text-[var(--color-text-muted)]">🇬🇧 English</p>
          {exercise.pairs.map((pair, i) => (
            <button
              key={`en-${i}`}
              onClick={(e) => { e.stopPropagation(); handleEnClick(i); }}
              disabled={matched.includes(i)}
              className={cn(
                "w-full py-3 px-3 rounded-[var(--radius-md)] text-sm font-medium transition-all",
                matched.includes(i)
                  ? "bg-[var(--color-success-light)] border-2 border-[var(--color-success)] text-[var(--color-success)] opacity-60"
                  : selectedEn === i
                    ? "bg-[var(--color-primary-light)] border-2 border-[var(--color-primary)] text-[var(--color-primary)] scale-[1.05]"
                    : wrongPair?.en === i
                      ? "bg-[var(--color-error-light)] border-2 border-[var(--color-error)] text-[var(--color-error)] animate-wiggle"
                      : "bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]"
              )}
            >
              {matched.includes(i) ? "✅ " : ""}{pair.en}
            </button>
          ))}
        </div>
        {/* Spanish column */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-center text-[var(--color-text-muted)]">🇪🇸 Español</p>
          {shuffledEs.map((item, i) => (
            <button
              key={`es-${i}`}
              onClick={(e) => { e.stopPropagation(); handleEsClick(item.originalIdx); }}
              disabled={matched.includes(item.originalIdx)}
              className={cn(
                "w-full py-3 px-3 rounded-[var(--radius-md)] text-sm font-medium transition-all",
                matched.includes(item.originalIdx)
                  ? "bg-[var(--color-success-light)] border-2 border-[var(--color-success)] text-[var(--color-success)] opacity-60"
                  : wrongPair?.es === item.originalIdx
                    ? "bg-[var(--color-error-light)] border-2 border-[var(--color-error)] text-[var(--color-error)] animate-wiggle"
                    : "bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]"
              )}
            >
              {matched.includes(item.originalIdx) ? "✅ " : ""}{item.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TranslatePhraseUI({ exercise, onComplete }: { exercise: TranslatePhraseExercise; onComplete: (correct: boolean) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    setSelected([]);
    setAnswered(false);
    // Shuffle all words (answer + distractors)
    const all = [...exercise.words, ...exercise.distractors];
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    setAvailableWords(all);
  }, [exercise]);

  function addWord(word: string, idx: number) {
    if (answered) return;
    setSelected(prev => [...prev, word]);
    setAvailableWords(prev => prev.filter((_, i) => i !== idx));
  }

  function removeWord(position: number) {
    if (answered) return;
    const word = selected[position];
    setSelected(prev => prev.filter((_, i) => i !== position));
    setAvailableWords(prev => [...prev, word]);
  }

  function checkAnswer() {
    const correct = selected.join(" ") === exercise.answer.join(" ");
    setAnswered(true);
    onComplete(correct);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[var(--color-text)] text-center">
        {exercise.questionEs}
      </h2>

      {/* Built phrase area */}
      <div className="min-h-[52px] p-3 bg-[var(--color-bg)] rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--color-border)] flex flex-wrap gap-2">
        {selected.length === 0 && (
          <span className="text-sm text-[var(--color-text-muted)]">Toca las palabras en orden...</span>
        )}
        {selected.map((word, i) => (
          <button
            key={`sel-${i}`}
            onClick={(e) => { e.stopPropagation(); removeWord(i); }}
            className={cn(
              "px-4 py-3 rounded-[var(--radius-md)] text-base font-medium transition-all min-h-[44px]",
              answered
                ? i < exercise.answer.length && word === exercise.answer[i]
                  ? "bg-[var(--color-success-light)] border border-[var(--color-success)] text-[var(--color-success)]"
                  : "bg-[var(--color-error-light)] border border-[var(--color-error)] text-[var(--color-error)]"
                : "bg-[var(--color-primary-light)] border border-[var(--color-primary)] text-[var(--color-primary)] active:scale-95"
            )}
          >
            {word}
          </button>
        ))}
      </div>

      {/* Available words */}
      {!answered && (
        <div className="flex flex-wrap justify-center gap-2">
          {availableWords.map((word, i) => (
            <button
              key={`avail-${i}`}
              onClick={(e) => { e.stopPropagation(); addWord(word, i); }}
              className="px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-bg-card)] border border-[var(--color-border)] text-base font-medium text-[var(--color-text)] hover:bg-[var(--color-primary-light)] hover:border-[var(--color-primary)] active:scale-95 transition-all min-h-[44px]"
            >
              {word}
            </button>
          ))}
        </div>
      )}

      {/* Check button */}
      {!answered && selected.length > 0 && (
        <Button size="lg" className="w-full text-lg font-bold" onClick={(e) => { e.stopPropagation(); checkAnswer(); }}>
          Comprobar
        </Button>
      )}

      {/* Correct answer on wrong */}
      {answered && selected.join(" ") !== exercise.answer.join(" ") && (
        <p className="text-center text-sm text-[var(--color-text-secondary)]">
          Respuesta correcta: <strong className="text-[var(--color-success)]">{exercise.answer.join(" ")}</strong>
        </p>
      )}
    </div>
  );
}

// === Main Play Component ===
function PlayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const themeSlug = searchParams.get("theme") || "gaming";
  const level = searchParams.get("level") || "beginner";
  const duration = parseInt(searchParams.get("duration") || "10");

  const theme = INITIAL_THEMES.find((t) => t.slug === themeSlug);

  // Generate exercises from real content bank
  const [exercises] = useState<Exercise[]>(() => buildSession(themeSlug, level, 7));

  // Game store actions
  const addXp = useGameStore((s) => s.addXp);
  const addWordLearned = useGameStore((s) => s.addWordLearned);
  const incrementSessions = useGameStore((s) => s.incrementSessions);
  const updateStreak = useGameStore((s) => s.updateStreak);
  const addPack = useGameStore((s) => s.addPack);
  const reducedSound = useGameStore((s) => s.reducedSound);
  const updateQuestProgress = useGameStore((s) => s.updateQuestProgress);
  const dailyQuests = useGameStore((s) => s.dailyQuests);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [usedHintThisExercise, setUsedHintThisExercise] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(MAX_HINTS_PER_SESSION);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [progressSaved, setProgressSaved] = useState(false);
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);

  const totalExercises = exercises.length;
  const currentExercise = exercises[currentIndex];
  const isMultipleChoice = currentExercise.type === "vocabulary" || currentExercise.type === "listening" || currentExercise.type === "fill_blank";
  const isListening = currentExercise.type === "listening";

  const maybPlaySound = useCallback((type: "correct" | "wrong" | "complete" | "streak") => {
    if (!reducedSound) playSound(type);
  }, [reducedSound]);

  useEffect(() => { return () => { if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current); }; }, []);

  // Auto-play audio for listening exercises
  useEffect(() => {
    if (isListening && !showResult) {
      const t = setTimeout(() => speakEnglish((currentExercise as MCExercise).english), 400);
      return () => clearTimeout(t);
    }
  }, [currentIndex, isListening, showResult, currentExercise]);

  // Timer
  useEffect(() => {
    if (sessionComplete) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { setSessionComplete(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionComplete]);

  // Save progress when session completes
  useEffect(() => {
    if (sessionComplete && !progressSaved) {
      setProgressSaved(true);
      maybPlaySound("complete");
      // Save to game store
      addXp(xpEarned);
      incrementSessions();
      updateStreak();
      // Add learned words
      exercises.forEach(ex => {
        if (ex.english && ex.english !== "matching") {
          addWordLearned(ex.english);
        }
      });
      // Give pack reward
      const percentage = totalExercises > 0 ? Math.round((score / totalExercises) * 100) : 0;
      addPack({
        id: `pack-${Date.now()}`,
        type: "basic",
        cardCount: 3,
        earnedAt: new Date().toISOString(),
        source: "session_complete",
      });
      if (percentage >= 80) {
        addPack({
          id: `pack-bonus-${Date.now()}`,
          type: "rare",
          cardCount: 3,
          earnedAt: new Date().toISOString(),
          source: "bonus_score",
        });
      }
      // Update quest progress
      dailyQuests.forEach((q) => {
        if (q.completed) return;
        if (q.description.includes("sesion")) {
          updateQuestProgress(q.id, q.current + 1);
        }
        if (q.description.includes("palabras")) {
          const newWords = exercises.filter(ex => ex.english && ex.english !== "matching").length;
          updateQuestProgress(q.id, q.current + newWords);
        }
      });
    }
  }, [sessionComplete, progressSaved, xpEarned, score, totalExercises, addXp, incrementSessions, updateStreak, addWordLearned, addPack, exercises, maybPlaySound, dailyQuests, updateQuestProgress]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSpeak = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSpeaking(true);
    speakEnglish(currentExercise.english);
    setTimeout(() => setIsSpeaking(false), 1500);
  }, [currentExercise.english]);

  const handleHint = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (hintsRemaining <= 0 || showResult || usedHintThisExercise) return;
    setShowHint(true);
    setUsedHintThisExercise(true);
    setHintsRemaining(prev => prev - 1);
  }, [hintsRemaining, showResult, usedHintThisExercise]);

  const goToNext = useCallback(() => {
    if (currentIndex + 1 >= totalExercises) {
      setSessionComplete(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setShowResult(false);
      setShowHint(false);
      setUsedHintThisExercise(false);
    }
  }, [currentIndex, totalExercises]);

  // Handler for multiple choice exercises (vocabulary, listening, fill_blank)
  const handleSelect = useCallback((optionIndex: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);
    const ex = currentExercise as MCExercise;
    const correct = optionIndex === ex.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      const newStreak = streak + 1;
      let xp = 15 + (newStreak >= 3 ? 10 : 0);
      if (usedHintThisExercise) xp = Math.max(5, xp - HINT_XP_PENALTY);
      setScore(prev => prev + 1);
      setXpEarned(prev => prev + xp);
      setStreak(newStreak);
      maybPlaySound(newStreak >= 3 ? "streak" : "correct");
    } else {
      setStreak(0);
      maybPlaySound("wrong");
    }
    setShowResult(true);
    autoAdvanceRef.current = setTimeout(() => goToNext(), correct ? CORRECT_DELAY : WRONG_DELAY);
  }, [selectedOption, currentExercise, streak, goToNext, usedHintThisExercise, maybPlaySound]);

  // Handler for interactive exercises (word_builder, matching, translate_phrase)
  const handleInteractiveComplete = useCallback((correct: boolean) => {
    setIsCorrect(correct);
    if (correct) {
      const newStreak = streak + 1;
      let xp = 15 + (newStreak >= 3 ? 10 : 0);
      if (usedHintThisExercise) xp = Math.max(5, xp - HINT_XP_PENALTY);
      setScore(prev => prev + 1);
      setXpEarned(prev => prev + xp);
      setStreak(newStreak);
      maybPlaySound(newStreak >= 3 ? "streak" : "correct");
    } else {
      setStreak(0);
      maybPlaySound("wrong");
    }
    setShowResult(true);
    autoAdvanceRef.current = setTimeout(() => goToNext(), correct ? CORRECT_DELAY : WRONG_DELAY);
  }, [streak, goToNext, usedHintThisExercise, maybPlaySound]);

  const handleSkipToNext = useCallback(() => {
    if (!showResult) return;
    if (autoAdvanceRef.current) { clearTimeout(autoAdvanceRef.current); autoAdvanceRef.current = null; }
    goToNext();
  }, [showResult, goToNext]);

  // Session complete screen
  if (sessionComplete) {
    const percentage = totalExercises > 0 ? Math.round((score / totalExercises) * 100) : 0;
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 40 ? 1 : 0;
    const gotBonusPack = percentage >= 80;

    return (
      <div className="text-center space-y-5 animate-slide-up">
        <div className="text-6xl mb-4 animate-pulse-subtle">
          {stars === 3 ? "🏆" : stars === 2 ? "🌟" : stars === 1 ? "👍" : "💪"}
        </div>
        <h1 className="text-3xl font-bold text-[var(--color-text)]">
          {stars === 3 ? "¡¡INCREÍBLE!!" : stars === 2 ? "¡Genial!" : stars === 1 ? "¡Buen trabajo!" : "¡Bien hecho!"}
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)]">
          {stars === 3
            ? `¡Eres un máquina en ${theme?.nameEs || "inglés"}! 🏆`
            : stars >= 2
              ? `¡${theme?.nameEs || "Inglés"} dominado! Sigue así 💪`
              : `¡Cada día aprendes más ${theme?.nameEs || "inglés"}! 🌱`}
        </p>

        <div className="flex justify-center gap-2">
          {[0, 1, 2].map(i => (
            <span key={i} className={cn("text-4xl transition-all", i < stars ? "scale-100 animate-pulse-subtle" : "scale-75 opacity-30 grayscale")}>
              ⭐
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Card padding="md" className="text-center">
            <span className="text-2xl block">✅</span>
            <p className="text-lg font-bold text-[var(--color-text)]">{score}/{totalExercises}</p>
            <p className="text-xs text-[var(--color-text-muted)]">Correctas</p>
          </Card>
          <Card padding="md" className="text-center">
            <span className="text-2xl block">✨</span>
            <p className="text-lg font-bold text-[var(--color-primary)]">+{xpEarned}</p>
            <p className="text-xs text-[var(--color-text-muted)]">XP ganada</p>
          </Card>
          <Card padding="md" className="text-center">
            <span className="text-2xl block">🔥</span>
            <p className="text-lg font-bold text-[var(--color-text)]">{percentage}%</p>
            <p className="text-xs text-[var(--color-text-muted)]">Acierto</p>
          </Card>
        </div>

        {/* Pack reward notification */}
        <Card padding="md" className="bg-[var(--color-primary-light)] border border-[var(--color-primary)]">
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl animate-pulse-subtle">🎴</span>
            <div className="text-left">
              <p className="font-bold text-[var(--color-text)]">
                {gotBonusPack ? "¡2 sobres ganados!" : "¡1 sobre ganado!"}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {gotBonusPack ? "Sobre basico + sobre raro por tu puntuacion" : "Sobre basico por completar la sesion"}
              </p>
            </div>
          </div>
          <Button
            size="md"
            className="w-full mt-3 gap-2 font-bold"
            onClick={() => router.push("/packs")}
          >
            🎴 Abrir sobres
          </Button>
        </Card>

        <Card padding="md">
          <h3 className="font-bold text-[var(--color-text)] mb-2">📚 Palabras practicadas</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {exercises.filter(ex => ex.english !== "matching").map((ex, i) => (
              <Badge key={i} variant="primary" size="sm">{ex.english}</Badge>
            ))}
          </div>
        </Card>

        <div className="space-y-3">
          <Button size="lg" className="w-full gap-3 text-lg py-4 font-bold animate-pulse-subtle" onClick={() => {
            // Generate fresh exercises for replay so it's never the same!
            window.location.href = `/learn/play?theme=${themeSlug}&level=${level}&duration=${duration}&t=${Date.now()}`;
          }}>
            <span className="text-2xl">🔄</span> ¡Otra ronda!
          </Button>
          <Button size="lg" variant="secondary" className="w-full gap-3 text-lg py-4" onClick={() => router.push("/learn")}>
            <span className="text-2xl">📚</span> Elegir otro tema
          </Button>
          <Button size="lg" variant="secondary" className="w-full gap-3 text-lg py-4" onClick={() => router.push("/dashboard")}>
            <span className="text-2xl">🏠</span> Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  // Get exercise-specific content
  const renderExercise = () => {
    if (currentExercise.type === "word_builder") {
      return <WordBuilderUI exercise={currentExercise as WordBuilderExercise} onComplete={handleInteractiveComplete} />;
    }
    if (currentExercise.type === "matching") {
      return <MatchingUI exercise={currentExercise as MatchingExercise} onComplete={handleInteractiveComplete} />;
    }
    if (currentExercise.type === "translate_phrase") {
      return <TranslatePhraseUI exercise={currentExercise as TranslatePhraseExercise} onComplete={handleInteractiveComplete} />;
    }

    // Multiple choice (vocabulary, listening, fill_blank)
    const mcExercise = currentExercise as MCExercise;
    return (
      <>
        <div className="flex justify-center mb-4">
          <Badge variant="primary" size="md">
            {currentExercise.type === "vocabulary" ? "📝 Vocabulario" :
             currentExercise.type === "listening" ? "🎧 Escucha" : "✏️ Completa"}
          </Badge>
        </div>

        <h2 className="text-xl font-bold text-[var(--color-text)] mb-2 text-center">
          {mcExercise.questionEs}
        </h2>

        {/* Fill blank sentence preview */}
        {currentExercise.type === "fill_blank" && (
          <p className="text-lg text-center text-[var(--color-text-secondary)] mb-4 italic">
            &quot;{(currentExercise as FillBlankExercise).sentence}&quot;
          </p>
        )}

        {/* Listen button for listening exercises */}
        {isListening && (
          <button onClick={handleSpeak} className={cn(
            "w-full py-5 mb-4 rounded-[var(--radius-lg)] border-2 border-dashed transition-all duration-200 flex items-center justify-center gap-3",
            isSpeaking
              ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] scale-[1.02]"
              : "border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]"
          )}>
            <span className={cn("text-4xl", isSpeaking && "animate-pulse-subtle")}>{isSpeaking ? "🔊" : "🔈"}</span>
            <span className="text-lg font-medium text-[var(--color-text)]">{isSpeaking ? "Escuchando..." : "Pulsa para escuchar"}</span>
          </button>
        )}

        {/* Hint */}
        {showHint && currentExercise.hint && (
          <div className="mb-4 p-3 bg-[var(--color-warning-light)] rounded-[var(--radius-md)] animate-slide-up">
            <p className="text-sm text-[var(--color-text)]">💡 <strong>Pista:</strong> {currentExercise.hint}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">(XP reducida)</p>
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-1 gap-3">
          {mcExercise.options.map((option, i) => {
            let style = "bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-primary-light)] hover:scale-[1.02]";
            if (showResult) {
              if (i === mcExercise.correctIndex) style = "bg-[var(--color-success-light)] border-2 border-[var(--color-success)] text-[var(--color-success)] scale-[1.03]";
              else if (i === selectedOption && !isCorrect) style = "bg-[var(--color-error-light)] border-2 border-[var(--color-error)] text-[var(--color-error)] animate-wiggle";
              else style = "bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-muted)] opacity-40";
            }
            return (
              <button key={i} onClick={(e) => { e.stopPropagation(); handleSelect(i); }} disabled={showResult}
                className={cn("w-full py-4 px-6 rounded-[var(--radius-lg)] text-lg font-medium transition-all duration-200 min-h-[52px]", style)}>
                {showResult && i === mcExercise.correctIndex && "✅ "}
                {showResult && i === selectedOption && !isCorrect && i !== mcExercise.correctIndex && "❌ "}
                {option}
              </button>
            );
          })}
        </div>

        {/* Hint + Listen buttons */}
        {!showResult && (
          <div className="flex gap-2 mt-4 justify-center">
            {!isListening && (
              <button onClick={handleSpeak} className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-sm transition-all min-h-[44px]",
                "bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)]",
                "hover:bg-[var(--color-primary-light)]",
                isSpeaking && "bg-[var(--color-primary-light)] border-[var(--color-primary)]"
              )}>
                <span className="text-lg">{isSpeaking ? "🔊" : "🔈"}</span> Escuchar
              </button>
            )}
            {hintsRemaining > 0 && currentExercise.hint && !usedHintThisExercise && (
              <button onClick={handleHint} className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-sm bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-warning-light)] transition-all min-h-[44px]">
                <span className="text-lg">💡</span> Pista ({hintsRemaining})
              </button>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-5 animate-slide-up" onClick={handleSkipToNext}>
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <ProgressBar value={currentIndex + 1} max={totalExercises} color={theme?.color || "var(--color-primary)"} size="md" />
        </div>
        <div className={cn(
          "flex items-center gap-1.5 text-base font-semibold whitespace-nowrap px-3 py-1.5 rounded-[var(--radius-full)] transition-colors",
          timeLeft <= 60
            ? "text-[var(--color-error)] bg-[var(--color-error-light)] animate-pulse-subtle"
            : "text-[var(--color-text-secondary)]"
        )}>
          <span>⏱️</span>
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[15px] text-[var(--color-text-secondary)] font-medium">
          {currentExercise.emoji} Ejercicio {currentIndex + 1} de {totalExercises}
        </span>
        {streak >= 2 && (
          <Badge variant="primary" size="sm" className="animate-pulse-subtle">🔥 Racha: {streak}</Badge>
        )}
      </div>

      <Card padding="lg">{renderExercise()}</Card>

      {/* Feedback overlay */}
      {showResult && (
        <Card padding="md" className={cn(
          "text-center animate-slide-up border-2",
          isCorrect ? "bg-[var(--color-success-light)] border-[var(--color-success)]" : "bg-[var(--color-error-light)] border-[var(--color-error)]"
        )}>
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl">{isCorrect
              ? (streak >= 5 ? "🔥" : streak >= 3 ? "⚡" : ["🎉", "🌟", "💪", "🚀", "✨"][currentIndex % 5])
              : ["😅", "🤔", "💡", "🧠"][currentIndex % 4]
            }</span>
            <div className="text-left">
              <p className="font-bold text-lg text-[var(--color-text)]">{isCorrect
                ? (streak >= 5 ? "¡¡IMPARABLE!!" : streak >= 3 ? "¡Racha de fuego!" : ["¡Correcto!", "¡Genial!", "¡Eso es!", "¡Bien hecho!", "¡Crack!"][currentIndex % 5])
                : ["¡Casi lo tienes!", "¡La próxima seguro!", "¡No te rindas!", "¡Tú puedes!"][currentIndex % 4]
              }</p>
              {isCorrect ? (
                <p className="text-[15px] text-[var(--color-success)] font-medium">
                  ✨ +{Math.max(5, 15 + (streak >= 3 ? 10 : 0) - (usedHintThisExercise ? HINT_XP_PENALTY : 0))} XP
                  {streak >= 3 && " 🔥 ¡Bonus racha!"}
                </p>
              ) : (
                <p className="text-[15px] text-[var(--color-text-secondary)]">
                  La respuesta era: <strong>{currentExercise.english}</strong> ({currentExercise.spanish})
                </p>
              )}
            </div>
          </div>
          <p className="text-[13px] text-[var(--color-text-muted)] mt-2 font-medium">Toca para continuar →</p>
        </Card>
      )}

      {/* XP counter */}
      <div className="flex items-center justify-center gap-3 text-[15px] font-medium text-[var(--color-text-secondary)] bg-[var(--color-bg-card)] px-4 py-2.5 rounded-[var(--radius-full)] border border-[var(--color-border)]">
        <span>✨ <strong className="text-[var(--color-primary)]">{xpEarned}</strong> XP</span>
        <span className="text-[var(--color-border)]">|</span>
        <span>✅ {score}/{currentIndex + (showResult ? 1 : 0)}</span>
        {hintsRemaining < MAX_HINTS_PER_SESSION && (<><span className="text-[var(--color-border)]">|</span><span>💡 {hintsRemaining}</span></>)}
      </div>
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-12 space-y-4">
        <span className="text-5xl block animate-pulse-subtle">🎮</span>
        <p className="text-lg text-[var(--color-text-secondary)]">Preparando ejercicios...</p>
      </div>
    }>
      <PlayContent />
    </Suspense>
  );
}
