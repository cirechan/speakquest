"use client";

import { BottomNav } from "./BottomNav";
import { XPBar } from "./XPBar";
import { NotificationLayer } from "./NotificationLayer";
import { useGameStore } from "@/stores/game-store";
import type { RankId } from "@/lib/utils/constants";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const xpTotal = useGameStore((s) => s.xpTotal);
  const rank = useGameStore((s) => s.rank) as RankId;
  const currentStreak = useGameStore((s) => s.currentStreak);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* XP Bar - sticky top */}
      <div className="sticky top-0 z-30 pt-[env(safe-area-inset-top)]">
        <XPBar
          xpTotal={xpTotal}
          rank={rank}
          streakCurrent={currentStreak}
        />
      </div>

      {/* Main content */}
      <main className="px-4 py-4 pb-24 max-w-lg mx-auto">
        {children}
      </main>

      <BottomNav />
      <NotificationLayer />
    </div>
  );
}
