"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useGameStore } from "@/stores/game-store";

const navItems = [
  { href: "/dashboard", emoji: "🏠", label: "Inicio" },
  { href: "/learn", emoji: "📚", label: "Aprender" },
  { href: "/packs", emoji: "🎴", label: "Sobres" },
  { href: "/collection", emoji: "🃏", label: "Album" },
  { href: "/profile", emoji: "👤", label: "Perfil" },
];

export function BottomNav() {
  const pathname = usePathname();
  const unopenedPacks = useGameStore((s) => s.unopenedPacks);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-bg-nav)] border-t-2 border-[var(--color-border)] shadow-[0_-2px_10px_rgb(0_0_0/0.06)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-[68px] px-2 max-w-lg mx-auto">
        {navItems.map(({ href, emoji, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          const showBadge = href === "/packs" && unopenedPacks.length > 0;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-2xl min-w-[60px] min-h-[52px] justify-center relative",
                "transition-all duration-200",
                isActive
                  ? "text-[var(--color-primary)] bg-[var(--color-primary-light)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)]"
              )}
            >
              <span className={cn(
                "text-[22px] leading-none transition-transform duration-200",
                isActive && "scale-110"
              )}>
                {emoji}
              </span>
              <span className={cn(
                "text-[11px] font-semibold leading-none",
                isActive && "font-bold"
              )}>
                {label}
              </span>
              {showBadge && (
                <span className="absolute -top-0.5 right-0.5 w-5 h-5 bg-[var(--color-error)] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse-subtle">
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
