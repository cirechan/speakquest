"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { useGameStore, useGameStoreHydrated } from "@/stores/game-store";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const onboardingComplete = useGameStore((s) => s.onboardingComplete);
  const hydrated = useGameStoreHydrated();

  useEffect(() => {
    if (hydrated && !onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [hydrated, onboardingComplete, router]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="text-center">
          <span className="text-5xl animate-bounce-subtle block mb-3">🎮</span>
          <p className="text-[var(--color-text-secondary)]">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!onboardingComplete) {
    return null;
  }

  return <AppShell>{children}</AppShell>;
}
