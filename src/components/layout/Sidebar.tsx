"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/dashboard", emoji: "🏠", label: "Inicio" },
  { href: "/learn", emoji: "📚", label: "Aprender" },
  { href: "/packs", emoji: "🎴", label: "Sobres" },
  { href: "/collection", emoji: "🃏", label: "Coleccion" },
  { href: "/quests", emoji: "⚔️", label: "Misiones" },
  { href: "/profile", emoji: "👤", label: "Perfil" },
];

export function Sidebar() {
  const pathname = usePathname();

  // Sidebar hidden — mobile-first app uses BottomNav only
  return (
    <aside className="hidden flex-col w-64 bg-[var(--color-bg-sidebar)] text-white h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight">
          🗣️ Speak<span className="text-[var(--color-secondary)]">Quest</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ href, emoji, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)]",
                "text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-white/15 text-white scale-[1.02]"
                  : "text-white/60 hover:bg-white/10 hover:text-white hover:translate-x-1"
              )}
            >
              <span className="text-xl">{emoji}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 text-xs text-white/40">
        🚀 SpeakQuest v0.1
      </div>
    </aside>
  );
}
