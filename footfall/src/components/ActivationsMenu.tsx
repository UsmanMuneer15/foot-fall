"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  productCategories,
  productsByCategory,
  type Product,
} from "@/lib/products";
import { BookingModal } from "@/components/BookingModal";
import { getUser } from "@/lib/auth";
import { toast } from "@/lib/toast";

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
  "text-ff-gold bg-ff-gold/15 ring-1 ring-ff-gold/30",
  "text-[#8fd4b8] bg-white/5 ring-1 ring-white/10",
  "text-[#d4b36e] bg-ff-gold/12 ring-1 ring-ff-gold/25",
  "text-[#b8e0d0] bg-[#0a3a28] ring-1 ring-ff-gold/15",
  "text-[#f0c08a] bg-ff-gold/10 ring-1 ring-ff-gold/20",
  "text-ff-gold-light bg-white/[0.06] ring-1 ring-ff-gold/20",
];

const mobileIconColors = [
  "text-ff-gold bg-ff-gold/15 ring-1 ring-ff-gold/25",
  "text-[#8fd4b8] bg-[#0a3a28]/55 ring-1 ring-ff-gold/15",
  "text-[#d4b36e] bg-ff-gold/12 ring-1 ring-ff-gold/20",
  "text-[#b8e0d0] bg-[#0f4a34]/50 ring-1 ring-white/10",
  "text-[#f0c08a] bg-ff-gold/10 ring-1 ring-ff-gold/15",
  "text-ff-gold-light bg-white/5 ring-1 ring-ff-gold/20",
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
      className="group flex w-full items-start gap-2.5 rounded-xl border border-transparent p-2.5 text-left transition hover:border-ff-gold/35 hover:bg-white/[0.05]"
    >
      <span
        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}
      >
        <ProductIcon name={product.icon} className="h-5 w-5" />
      </span>
      <span className="min-w-0 pt-0.5">
        <span className="block text-[0.8rem] font-semibold leading-snug text-white transition group-hover:text-ff-gold">
          {product.name}
        </span>
        <span className="mt-0.5 block text-[0.7rem] leading-snug text-white/55">
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
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (variant !== "desktop" || !menuOpen) return;

    function updatePos() {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMenuPos({
        top: rect.bottom + 10,
        right: Math.max(12, window.innerWidth - rect.right),
      });
    }

    updatePos();
    window.addEventListener("resize", updatePos);
    window.addEventListener("scroll", updatePos, true);

    function onPointer(e: MouseEvent) {
      const target = e.target as Node;
      if (
        rootRef.current?.contains(target) ||
        (target instanceof Element && target.closest(`[data-activations-menu="${menuId}"]`))
      ) {
        return;
      }
      setMenuOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", updatePos);
      window.removeEventListener("scroll", updatePos, true);
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [variant, menuOpen, menuId]);

  function requireAuthForBooking() {
    const user = getUser();
    if (user) return true;
    setMenuOpen(false);
    onNavigate?.();
    toast.error("Please sign in to create an activation.");
    router.push("/login");
    return false;
  }

  function openBooking(productId?: string) {
    if (!requireAuthForBooking()) return;
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
        ref={triggerRef}
        type="button"
        className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-ff-gold/80 bg-transparent py-1.5 pl-3.5 pr-1.5 text-[0.55rem] font-semibold uppercase tracking-[0.1em] text-white transition hover:border-ff-gold hover:bg-ff-gold/10 xl:gap-2.5 xl:py-2 xl:pl-4 xl:pr-2 xl:text-[0.58rem] xl:tracking-[0.12em]"
        aria-expanded={menuOpen}
        aria-controls={menuId}
        onClick={() => setMenuOpen((v) => !v)}
      >
        Create an Activation
        <span
          aria-hidden
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ff-gold/50 text-[0.7rem] text-ff-gold transition group-hover:border-ff-gold group-hover:bg-ff-gold group-hover:text-ff-green-deep xl:h-7 xl:w-7 xl:text-[0.75rem] ${
            menuOpen ? "rotate-90" : ""
          }`}
        >
          →
        </span>
      </button>

      {mounted && menuOpen
        ? createPortal(
            <div
              id={menuId}
              data-activations-menu={menuId}
              className="fixed z-[120] w-[min(96vw,1040px)]"
              style={{ top: menuPos.top, right: menuPos.right }}
              role="menu"
            >
              <div
                className="absolute -top-2 right-10 h-3.5 w-3.5 rotate-45 border-l-2 border-t-2 border-ff-gold bg-ff-green"
                aria-hidden
              />

              <div className="overflow-hidden rounded-xl border-2 border-ff-gold bg-ff-green shadow-[0_28px_70px_rgba(0,0,0,0.55)]">
                <div className="border-b border-ff-gold/40 bg-ff-green-deep px-5 py-3.5 sm:px-6">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-ff-gold">
                    Footfall Activations
                  </p>
                  <p className="mt-1 text-[0.75rem] text-white/75">
                    Choose an experience to start your booking
                  </p>
                </div>

                <div className="grid max-h-[min(78vh,640px)] gap-x-8 gap-y-6 overflow-y-auto overscroll-contain p-5 sm:grid-cols-2 sm:p-6 lg:gap-x-10">
                  {productCategories.map((cat) => {
                    const items = productsByCategory(cat.id);
                    return (
                      <section key={cat.id} className="min-w-0">
                        <div className="border-b border-ff-gold/30 pb-2.5">
                          <h3 className="text-[0.85rem] font-bold uppercase tracking-[0.1em] text-ff-gold">
                            {cat.title}
                          </h3>
                        </div>
                        <div className="mt-2.5 grid gap-1 sm:grid-cols-2">
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
    </div>
  );
}
