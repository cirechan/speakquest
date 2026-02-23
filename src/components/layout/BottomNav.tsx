"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useGameStore } from "@/stores/game-store";

const navItems = [
  { href: "/dashboard", emoji: "🏠", label: "Inicio" },
  { href: "/learn", emoji: "📚", label: "Aprender" },
  { href: "/packs", emoji: "🎴", label: "Sobres" },
  { href: "/collection", emoji: "🃏", label: "Coleccion" },
  { href: "/profile", emoji: "👤", label: "Perfil" },
];

export function BottomNav() {
  const pathname = usePathname();
  const unopenedPacks = useGameStore((s) => s.unopenedPacks);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-bg-nav)] border-t border-[var(--color-border)] shadow-[var(--shadow-lg)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map(({ href, emoji, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          const showBadge = href === "/packs" && unopenedPacks.length > 0;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 py-1 px-2 rounded-[var(--radius-md)] min-w-[56px] min-h-[44px] justify-center relative",
                "transition-all duration-200 active:scale-95",
                isActive
                  ? "text-[var(--color-primary)] scale-110"
                  : "text-[var(--color-text-muted)] hover:scale-105"
              )}
            >
              <span className={cn("text-xl transition-transform", isActive && "animate-bounce-subtle")}>
                {emoji}
              </span>
              <span className="text-[10px] font-medium">{label}</span>
              {showBadge && (
                <span className="absolute -top-1 right-0 w-5 h-5 bg-[var(--color-error)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unopenedPacks.length}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
