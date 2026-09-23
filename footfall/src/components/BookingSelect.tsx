"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";

export type BookingSelectOption = {
  value: string;
  label: string;
};

type BookingSelectProps = {
  id: string;
  value: string;
  options: readonly BookingSelectOption[];
  placeholder: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  "aria-invalid"?: boolean;
};

const triggerBase =
  "mt-2 flex w-full items-center justify-between gap-3 border bg-black/20 px-3.5 py-[0.7rem] text-left text-[0.875rem] normal-case tracking-normal outline-none transition";

const triggerOk =
  "border-ff-gold/35 hover:border-ff-gold/55 focus:border-ff-gold";

const triggerError = "border-red-400/70 focus:border-red-300";

const LIST_MAX_PX = 208; // ~max-h-52
const LIST_GAP_PX = 6;

export function BookingSelect({
  id,
  value,
  options,
  placeholder,
  onChange,
  hasError,
  "aria-invalid": ariaInvalid,
}: BookingSelectProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const [menuStyle, setMenuStyle] = useState<CSSProperties | null>(null);

  const selected = options.find((o) => o.value === value);
  const display = selected?.label ?? "";

  const items: BookingSelectOption[] = [
    { value: "", label: placeholder },
    ...options,
  ];

  function placeMenu() {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - LIST_GAP_PX - 8;
    const maxHeight = Math.max(120, Math.min(LIST_MAX_PX, spaceBelow));

    setMenuStyle({
      position: "fixed",
      top: rect.bottom + LIST_GAP_PX,
      left: rect.left,
      width: rect.width,
      maxHeight,
      zIndex: 200,
    });
  }

  useLayoutEffect(() => {
    if (!open) {
      setMenuStyle(null);
      return;
    }
    placeMenu();

    function onReposition() {
      placeMenu();
    }

    window.addEventListener("resize", onReposition);
    // Capture scroll from modal overlay / nested scrollers
    window.addEventListener("scroll", onReposition, true);
    return () => {
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const selectedIndex = items.findIndex((o) => o.value === value);
    setHighlight(selectedIndex >= 0 ? selectedIndex : 0);
    requestAnimationFrame(() => listRef.current?.focus());

    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        rootRef.current?.contains(target) ||
        listRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    function onDocKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onDocKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onDocKey);
    };
    // items is derived from options + placeholder each render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, value, placeholder, options]);

  useEffect(() => {
    if (!open || highlight < 0) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${highlight}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [open, highlight]);

  function choose(next: string) {
    onChange(next);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onTriggerKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  }

  function onListKeyDown(e: KeyboardEvent<HTMLUListElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((i) => Math.min(i + 1, items.length - 1));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((i) => Math.max(i - 1, 0));
      return;
    }

    if (e.key === "Home") {
      e.preventDefault();
      setHighlight(0);
      return;
    }

    if (e.key === "End") {
      e.preventDefault();
      setHighlight(items.length - 1);
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (highlight >= 0 && highlight < items.length) {
        choose(items[highlight].value);
      }
    }
  }

  const menu =
    open && menuStyle
      ? createPortal(
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={id}
            onKeyDown={onListKeyDown}
            style={menuStyle}
            className="overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border border-ff-gold/40 bg-ff-green-deep py-1 shadow-[0_16px_40px_rgba(0,0,0,0.55)] outline-none"
          >
            {items.map((item, index) => {
              const isSelected = item.value === value;
              const isActive = index === highlight;
              return (
                <li
                  key={item.value || "__placeholder__"}
                  role="option"
                  data-index={index}
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlight(index)}
                  onClick={() => choose(item.value)}
                  className={`cursor-pointer px-3.5 py-2.5 text-[0.875rem] normal-case tracking-normal transition ${
                    isActive
                      ? "bg-ff-gold/20 text-white"
                      : isSelected
                        ? "bg-ff-gold/10 text-ff-gold-light"
                        : "text-white/90 hover:bg-ff-gold/15 hover:text-white"
                  } ${item.value === "" ? "text-white/45" : ""}`}
                >
                  {item.label}
                </li>
              );
            })}
          </ul>,
          document.body,
        )
      : null;

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-invalid={ariaInvalid ?? Boolean(hasError)}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
        className={`${triggerBase} ${hasError ? triggerError : triggerOk} ${
          display ? "text-white" : "text-white/40"
        }`}
      >
        <span className="min-w-0 truncate">{display || placeholder}</span>
        <svg
          className={`h-3 w-3 shrink-0 text-ff-gold transition ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 12 8"
          fill="none"
          aria-hidden
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {menu}
    </div>
  );
}
