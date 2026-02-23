"use client";

import { useGameStore } from "@/stores/game-store";
import { SENSORY_PROFILES } from "@/lib/utils/constants";

export function useAccessibility() {
  const {
    sensoryMode,
    reducedMotion,
    textSize,
    highContrast,
    celebrationLevel,
    reducedSound,
    timerVisible,
  } = useGameStore();

  const profile = SENSORY_PROFILES[sensoryMode];

  return {
    sensoryMode,
    reducedMotion: reducedMotion || !profile.animations,
    textSize,
    highContrast,
    celebrationLevel,
    reducedSound,
    timerVisible: timerVisible && profile.timerVisible,
    autoplayAudio: profile.autoplayAudio && !reducedSound,
    transitionSpeed: profile.transitionSpeed,
  };
}
