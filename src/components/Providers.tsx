"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useGameStore } from "@/stores/game-store";

function AccessibilityAttributes({ children }: { children: React.ReactNode }) {
  const { sensoryMode, reducedMotion, textSize, highContrast } = useGameStore();

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-sensory", sensoryMode);
    html.setAttribute("data-reduced-motion", String(reducedMotion));
    html.setAttribute("data-text-size", textSize);
    html.setAttribute("data-high-contrast", String(highContrast));
  }, [sensoryMode, reducedMotion, textSize, highContrast]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AccessibilityAttributes>{children}</AccessibilityAttributes>
    </QueryClientProvider>
  );
}
