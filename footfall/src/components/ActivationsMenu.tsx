"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  productCategories,
  productsByCategory,
  type Product,
} from "@/lib/products";
import { BookingModal } from "@/components/BookingModal";

type IconProps = { className?: string };

function ProductIcon({ name, className }: { name: string; className?: string }) {
  const props: IconProps = { className };
  switch (name) {
    case "claw":
      return (
        <svg viewBox="0 0 40 40" fill="none" aria-hidden {...props}>
          <path d="M20 8v8M14 16c0 4 2.5 7 6 8.5 3.5-1.5 6-4.5 6-8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M14 16l-3 4M26 16l3 4M17 28h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="20" cy="33" r="2.2" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      );
    case "led-bag":
      return (
        <svg viewBox="0 0 40 40" fill="none" aria-hidden {...props}>
          <rect x="12" y="10" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="1.4" />
          <path d="M16 10V8h8v2M15 16h10M15 20h8M15 24h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "mascot":
      return (
        <svg viewBox="0 0 40 40" fill="none" aria-hidden {...props}>
          <circle cx="20" cy="15" r="6" stroke="currentColor" strokeWidth="1.4" />
          <path d="M12 32c1.5-6 4.5-9 8-9s6.5 3 8 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M14 12l-3-3M26 12l3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "plush":
      return (
        <svg viewBox="0 0 40 40" fill="none" aria-hidden {...props}>
          <ellipse cx="20" cy="22" rx="8" ry="9" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="15" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="25" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="17.5" cy="21" r="1" fill="currentColor" />
          <circle cx="22.5" cy="21" r="1" fill="currentColor" />
        </svg>
      );
    case "touch":
      return (
        <svg viewBox="0 0 40 40" fill="none" aria-hidden {...props}>
          <rect x="10" y="8" width="20" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M16 30h8M20 26v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "led-wall":
      return (
        <svg viewBox="0 0 40 40" fill="none" aria-hidden {...props}>
          <rect x="7" y="10" width="26" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M12 15h4M18 15h4M24 15h4M12 20h4M18 20h4M24 20h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M14 30h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "content":
      return (
        <svg viewBox="0 0 40 40" fill="none" aria-hidden {...props}>
          <rect x="9" y="9" width="22" height="22" rx="2" stroke="currentColor" strokeWidth="1.4" />
          <path d="M16 15l8 5-8 5V15Z" fill="currentColor" />
        </svg>
      );
    case "lights":
      return (
        <svg viewBox="0 0 40 40" fill="none" aria-hidden {...props}>
          <path d="M20 8v4M12 12l2.5 2.5M28 12l-2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M14 18c0-3.3 2.7-6 6-6s6 2.7 6 6c0 2.2-1.2 4-3 5v4h-6v-4c-1.8-1-3-2.8-3-5Z" stroke="currentColor" strokeWidth="1.4" />
          <path d="M17 31h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "camera":
      return (
        <svg viewBox="0 0 40 40" fill="none" aria-hidden {...props}>
          <circle cx="20" cy="18" r="7" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="20" cy="18" r="3" stroke="currentColor" strokeWidth="1.3" />
          <path d="M20 25v5M14 32h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "wristband":
      return (
        <svg viewBox="0 0 40 40" fill="none" aria-hidden {...props}>
          <ellipse cx="20" cy="20" rx="10" ry="7" stroke="currentColor" strokeWidth="1.4" />
          <path d="M12 18h16M12 22h16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case "tablet":
      return (
        <svg viewBox="0 0 40 40" fill="none" aria-hidden {...props}>
          <rect x="12" y="7" width="16" height="26" rx="2" stroke="currentColor" strokeWidth="1.4" />
          <path d="M18 29h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "cue":
      return (
        <svg viewBox="0 0 40 40" fill="none" aria-hidden {...props}>
          <path d="M10 12h12M10 20h16M10 28h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M26 10l6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "qr":
      return (
        <svg viewBox="0 0 40 40" fill="none" aria-hidden {...props}>
          <rect x="9" y="9" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.3" />
          <rect x="22" y="9" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.3" />
          <rect x="9" y="22" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.3" />
          <path d="M22 22h4v4h-4zM28 22h3M22 28h3M28 28h3v3h-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "barricade":
      return (
        <svg viewBox="0 0 40 40" fill="none" aria-hidden {...props}>
          <path d="M8 14h24M8 26h24M11 14v12M29 14v12M15 14l10 12M25 14 15 26" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
        </svg>
      );
    case "cocktail":
      return (
        <svg viewBox="0 0 40 40" fill="none" aria-hidden {...props}>
          <path d="M14 10h12l-2 8H16l-2-8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M20 18v8M15 30h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "chair":
      return (
        <svg viewBox="0 0 40 40" fill="none" aria-hidden {...props}>
          <path d="M13 12h14v10H13V12Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M11 22h18v3H11v-3ZM14 25v7M26 25v7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "table":
      return (
        <svg viewBox="0 0 40 40" fill="none" aria-hidden {...props}>
          <rect x="8" y="14" width="24" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
          <path d="M12 19v10M28 19v10M10 29h4M26 29h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "consult":
      return (
        <svg viewBox="0 0 40 40" fill="none" aria-hidden {...props}>
          <circle cx="20" cy="14" r="5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M11 30c1.8-5.5 5-8.5 9-8.5s7.2 3 9 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 40 40" fill="none" aria-hidden {...props}>
          <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
  }
}

const iconColors = [
  "text-[#0a7a5a] bg-[#0a7a5a]/10",
  "text-[#2b6cb0] bg-[#2b6cb0]/10",
  "text-[#9a7a3a] bg-[#c5a059]/15",
  "text-[#0f4a34] bg-[#0f4a34]/10",
  "text-[#b45309] bg-[#b45309]/10",
  "text-[#1d4ed8] bg-[#1d4ed8]/10",
];

const mobileIconColors = [
  "text-ff-gold bg-ff-gold/15",
  "text-[#8fd4b8] bg-[#8fd4b8]/12",
  "text-[#d4b36e] bg-[#d4b36e]/12",
  "text-[#9ec5ff] bg-[#9ec5ff]/12",
  "text-[#f0c08a] bg-[#f0c08a]/12",
  "text-[#b8e0d0] bg-[#b8e0d0]/12",
];

function ProductItem({
  product,
  index,
  onSelect,
}: {
  product: Product;
  index: number;
  onSelect: (id: string) => void;
}) {
  const color = iconColors[index % iconColors.length];
  return (
    <button
      type="button"
      onClick={() => onSelect(product.id)}
      className="group flex w-full items-start gap-3 rounded-lg p-2.5 text-left transition hover:bg-ff-cream"
    >
      <span
        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}
      >
        <ProductIcon name={product.icon} className="h-6 w-6" />
      </span>
      <span className="min-w-0 pt-0.5">
        <span className="ff-ink block text-[0.8rem] font-semibold leading-snug transition group-hover:!text-ff-green">
          {product.name}
        </span>
        <span className="ff-soft-copy mt-0.5 block text-[0.7rem] leading-snug">
          {product.description}
        </span>
      </span>
    </button>
  );
}

type ActivationsMenuProps = {
  /** Compact trigger for header desktop */
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
};

export function ActivationsMenu({
  variant = "desktop",
  onNavigate,
}: ActivationsMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (variant !== "desktop" || !menuOpen) return;
    function onPointer(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [variant, menuOpen]);

  function openBooking(productId?: string) {
    setSelectedProductId(productId ?? null);
    setMenuOpen(false);
    onNavigate?.();
    // Open booking on next tick so the sheet can unmount cleanly first
    window.setTimeout(() => setBookingOpen(true), 0);
  }

  function openMobileSheet() {
    onNavigate?.();
    setMenuOpen(true);
  }

  function closeMobileSheet() {
    setMenuOpen(false);
  }

  useEffect(() => {
    if (variant !== "mobile" || !menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [variant, menuOpen]);

  if (variant === "mobile") {
    return (
      <>
        <div className="mt-3 border-t border-ff-gold/20 pt-4">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 rounded-full border border-ff-gold/55 bg-transparent px-4 py-3.5 text-left text-ff-gold transition hover:border-ff-gold hover:bg-ff-gold/10"
            aria-expanded={menuOpen}
            onClick={openMobileSheet}
          >
            <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em]">
              Create an Activation
            </span>
            <span
              aria-hidden
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ff-gold/40 text-sm"
            >
              →
            </span>
          </button>
        </div>

        {mounted && menuOpen
          ? createPortal(
              <div
                className="fixed inset-0 z-[70] lg:hidden"
                role="dialog"
                aria-modal="true"
              >
                <button
                  type="button"
                  className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"
                  aria-label="Close activations menu"
                  onClick={closeMobileSheet}
                />
                <div className="absolute inset-x-0 bottom-0 flex max-h-[88svh] flex-col overflow-hidden rounded-t-3xl border border-ff-gold/25 bg-ff-green-deep shadow-[0_-20px_60px_rgba(0,0,0,0.45)]">
                  <div className="flex items-center justify-between gap-3 border-b border-ff-gold/20 px-5 py-4">
                    <div>
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-ff-gold">
                        Footfall
                      </p>
                      <h2 className="mt-1 text-lg font-semibold uppercase tracking-[0.08em] text-ff-gold">
                        Create an Activation
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={closeMobileSheet}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-ff-gold/40 text-ff-gold transition hover:border-ff-gold hover:bg-ff-gold hover:text-ff-green-deep"
                      aria-label="Close"
                    >
                      ×
                    </button>
                  </div>


                  <div className="flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-4">
                    {productCategories.map((cat) => {
                      const items = productsByCategory(cat.id);
                      return (
                        <section key={cat.id}>
                          <div className="mb-2.5 px-1">
                            <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-ff-gold">
                              {cat.title}
                            </p>
                            <p className="mt-1 text-[0.7rem] leading-snug text-white/55">
                              {cat.subtitle}
                            </p>
                          </div>
                          <div className="space-y-1">
                            {items.map((product, index) => {
                              const color =
                                mobileIconColors[
                                  index % mobileIconColors.length
                                ];
                              return (
                                <button
                                  key={product.id}
                                  type="button"
                                  onClick={() => openBooking(product.id)}
                                  className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-2 py-2.5 text-left transition active:scale-[0.99] hover:border-ff-gold/20 hover:bg-white/[0.04]"
                                >
                                  <span
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}
                                  >
                                    <ProductIcon
                                      name={product.icon}
                                      className="h-5 w-5"
                                    />
                                  </span>
                                  <span className="min-w-0 flex-1">
                                    <span className="block text-[0.82rem] font-semibold leading-snug text-white transition group-hover:text-ff-gold">
                                      {product.name}
                                    </span>
                                    <span className="mt-0.5 block text-[0.68rem] leading-snug text-white/50">
                                      {product.description}
                                    </span>
                                  </span>
                                  <span
                                    aria-hidden
                                    className="shrink-0 text-ff-gold/70 transition group-hover:text-ff-gold"
                                  >
                                    →
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </section>
                      );
                    })}
                  </div>

                  <div className="border-t border-ff-gold/20 bg-ff-green/80 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                    <button
                      type="button"
                      className="btn-gold w-full !py-3.5"
                      onClick={() => openBooking()}
                    >
                      Book an Activation →
                    </button>
                  </div>
                </div>
              </div>,
              document.body,
            )
          : null}

        {mounted
          ? createPortal(
              <BookingModal
                open={bookingOpen}
                onClose={() => setBookingOpen(false)}
                initialProductId={selectedProductId}
              />,
              document.body,
            )
          : null}
      </>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="btn-outline-gold !gap-1.5 !px-3.5 !py-2.5 !text-[0.55rem] !tracking-[0.1em] whitespace-nowrap xl:!px-4 xl:!text-[0.6rem] xl:!tracking-[0.14em]"
        aria-expanded={menuOpen}
        aria-controls={menuId}
        onClick={() => setMenuOpen((v) => !v)}
      >
        Create an Activation
        <span
          aria-hidden
          className={`inline-block text-[0.7em] transition-transform duration-200 ${
            menuOpen ? "rotate-180" : ""
          }`}
        >
          ↓
        </span>
      </button>

      {menuOpen && (
        <div
          id={menuId}
          className="absolute right-0 top-[calc(100%+0.85rem)] z-[60] w-[min(94vw,940px)] origin-top-right"
          role="menu"
        >
          <div
            className="absolute -top-2 right-12 h-4 w-4 rotate-45 border-l border-t border-ff-gold/20 bg-white"
            aria-hidden
          />

          <div className="ff-light-panel overflow-hidden rounded-2xl border border-ff-gold/20 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
            <div className="grid gap-x-8 gap-y-7 p-5 sm:grid-cols-2 sm:p-7 lg:gap-x-10 lg:p-8">
              {productCategories.map((cat) => {
                const items = productsByCategory(cat.id);
                return (
                  <section key={cat.id} className="min-w-0">
                    <h3 className="!text-[0.92rem] !font-bold !normal-case !tracking-[0.02em] !text-ff-gold">
                      {cat.title}
                    </h3>
                    <p className="ff-soft-copy mt-1 max-w-[28ch] text-[0.7rem] leading-snug">
                      {cat.subtitle}
                    </p>
                    <div className="mt-3.5 grid gap-0.5 sm:grid-cols-2">
                      {items.map((product, index) => (
                        <ProductItem
                          key={product.id}
                          product={product}
                          index={index}
                          onSelect={openBooking}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialProductId={selectedProductId}
      />
    </div>
  );
}
