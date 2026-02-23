"use client";

import { cn } from "@/lib/utils/cn";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "xp";
  xpAmount?: number;
  duration?: number;
  onClose: () => void;
}

const typeStyles = {
  success: "border-l-4 border-l-[var(--color-success)] bg-[var(--color-success-light)]",
  error: "border-l-4 border-l-[var(--color-error)] bg-[var(--color-error-light)]",
  info: "border-l-4 border-l-[var(--color-primary)] bg-[var(--color-primary-light)]",
  xp: "border-l-4 border-l-[var(--color-warning)] bg-[var(--color-warning-light)]",
};

export function Toast({ message, type = "info", xpAmount, duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 200);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 max-w-sm",
        "bg-[var(--color-bg-card)] rounded-[var(--radius-md)] shadow-[var(--shadow-lg)]",
        "transition-all duration-200",
        typeStyles[type],
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
      )}
      role="alert"
    >
      <div className="flex items-center gap-3 p-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--color-text)]">
            {type === "xp" && xpAmount ? `+${xpAmount} XP` : message}
          </p>
          {type === "xp" && (
            <p className="text-xs text-[var(--color-text-secondary)]">{message}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
