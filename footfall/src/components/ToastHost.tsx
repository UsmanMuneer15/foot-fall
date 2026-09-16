"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  dismissToast,
  getServerToasts,
  getToasts,
  subscribeToasts,
  type ToastItem,
  type ToastType,
} from "@/lib/toast";

const typeStyles: Record<
  ToastType,
  { border: string; accent: string; label: string }
> = {
  success: {
    border: "border-ff-gold/45",
    accent: "bg-ff-gold text-ff-green-deep",
    label: "Success",
  },
  error: {
    border: "border-red-400/45",
    accent: "bg-red-400 text-ff-green-deep",
    label: "Error",
  },
  info: {
    border: "border-ff-gold/35",
    accent: "bg-ff-gold/80 text-ff-green-deep",
    label: "Info",
  },
};

function ToastCard({ item }: { item: ToastItem }) {
  const style = typeStyles[item.type];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`ff-toast pointer-events-auto flex w-[min(100vw-2rem,24rem)] items-start gap-3 border ${style.border} bg-ff-green-deep px-4 py-3.5 shadow-[0_18px_50px_rgba(0,0,0,0.45)]`}
    >
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.58rem] font-bold uppercase tracking-[0.08em] ${style.accent}`}
        aria-hidden
      >
        {item.type === "success" ? "✓" : item.type === "error" ? "!" : "i"}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-ff-gold">
          {style.label}
        </p>
        <p className="mt-1 text-sm leading-snug text-white/90">{item.message}</p>
      </div>
      <button
        type="button"
        className="flex h-7 w-7 shrink-0 items-center justify-center border border-ff-gold/30 text-ff-gold transition hover:border-ff-gold hover:bg-ff-gold hover:text-ff-green-deep"
        aria-label="Dismiss notification"
        onClick={() => dismissToast(item.id)}
      >
        ×
      </button>
    </div>
  );
}

export function ToastHost() {
  const [mounted, setMounted] = useState(false);
  const items = useSyncExternalStore(
    subscribeToasts,
    getToasts,
    getServerToasts,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="pointer-events-none fixed top-4 right-4 z-[300] flex flex-col gap-2.5 sm:top-6 sm:right-6">
      {items.map((item) => (
        <ToastCard key={item.id} item={item} />
      ))}
    </div>,
    document.body,
  );
}
