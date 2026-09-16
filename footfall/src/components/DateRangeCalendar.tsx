"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type BlockedDateRange = {
  startDate: string;
  endDate: string;
};

type DateRangeCalendarProps = {
  minDate: string;
  startDate: string;
  endDate: string;
  maxDays?: number;
  blockedRanges?: BlockedDateRange[];
  disabled?: boolean;
  onChange: (start: string, end: string) => void;
  inputClassName?: string;
  /** Called when the calendar popover opens — use to refresh availability. */
  onOpen?: () => void;
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function parseISO(iso: string) {
  return new Date(`${iso}T12:00:00`);
}

function toISO(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function daysBetweenInclusive(startISO: string, endISO: string) {
  const start = parseISO(startISO);
  const end = parseISO(endISO);
  return Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
}

function formatDisplay(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function startOfMonth(year: number, month: number) {
  return new Date(year, month, 1, 12);
}

function calendarCells(year: number, month: number) {
  const first = startOfMonth(year, month);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ iso: string; day: number; inMonth: boolean }> = [];

  for (let i = 0; i < startOffset; i++) {
    const date = addDays(first, i - startOffset);
    cells.push({ iso: toISO(date), day: date.getDate(), inMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day, 12);
    cells.push({ iso: toISO(date), day, inMonth: true });
  }

  while (cells.length % 7 !== 0) {
    const last = parseISO(cells[cells.length - 1].iso);
    const date = addDays(last, 1);
    cells.push({ iso: toISO(date), day: date.getDate(), inMonth: false });
  }

  return cells;
}

export function daysInRange(startISO: string, endISO: string) {
  return daysBetweenInclusive(startISO, endISO);
}

/** Expand inclusive ranges into every blocked YYYY-MM-DD day. */
export function expandBlockedDates(
  blockedRanges: BlockedDateRange[] = [],
): Set<string> {
  const days = new Set<string>();
  for (const range of blockedRanges) {
    if (!range.startDate || !range.endDate) continue;
    let cur = parseISO(range.startDate);
    const end = parseISO(range.endDate);
    if (Number.isNaN(cur.getTime()) || Number.isNaN(end.getTime())) continue;
    while (cur.getTime() <= end.getTime()) {
      days.add(toISO(cur));
      cur = addDays(cur, 1);
    }
  }
  return days;
}

export function isDateBlocked(
  iso: string,
  blockedRanges: BlockedDateRange[] = [],
) {
  return expandBlockedDates(blockedRanges).has(iso);
}

export function rangeOverlapsBlocked(
  startISO: string,
  endISO: string,
  blockedRanges: BlockedDateRange[] = [],
) {
  if (!startISO || !endISO) return false;
  const blocked = expandBlockedDates(blockedRanges);
  let cur = parseISO(startISO);
  const end = parseISO(endISO);
  while (cur.getTime() <= end.getTime()) {
    if (blocked.has(toISO(cur))) return true;
    cur = addDays(cur, 1);
  }
  return false;
}

function CalendarGrid({
  minDate,
  startDate,
  endDate,
  maxDays,
  blockedRanges,
  onChange,
  onComplete,
}: {
  minDate: string;
  startDate: string;
  endDate: string;
  maxDays: number;
  blockedRanges: BlockedDateRange[];
  onChange: (start: string, end: string) => void;
  onComplete?: () => void;
}) {
  const min = parseISO(minDate);
  const initialView = startDate ? parseISO(startDate) : min;
  const [viewYear, setViewYear] = useState(initialView.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialView.getMonth());

  const cells = useMemo(
    () => calendarCells(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const blockedDays = useMemo(
    () => expandBlockedDates(blockedRanges),
    [blockedRanges],
  );

  function goMonth(delta: number) {
    const next = new Date(viewYear, viewMonth + delta, 1, 12);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  function handleDayClick(iso: string, inMonth: boolean) {
    if (!inMonth) return;
    const clicked = parseISO(iso);
    if (clicked < min) return;
    if (blockedDays.has(iso)) return;

    if (!startDate || (startDate && endDate)) {
      onChange(iso, "");
      return;
    }

    const start = parseISO(startDate);
    if (clicked < start) {
      onChange(iso, "");
      return;
    }

    const span = daysBetweenInclusive(startDate, iso);
    if (span > maxDays) return;
    if (rangeOverlapsBlocked(startDate, iso, blockedRanges)) return;

    onChange(startDate, iso);
    onComplete?.();
  }

  function dayState(iso: string, inMonth: boolean) {
    if (!inMonth) return "outside";
    const date = parseISO(iso);
    if (date < min) return "disabled";
    if (blockedDays.has(iso)) return "blocked";

    const isStart = iso === startDate;
    const isEnd = iso === endDate;
    const inRange =
      startDate && endDate && iso >= startDate && iso <= endDate;

    if (isStart && isEnd) return "single";
    if (isStart) return "start";
    if (isEnd) return "end";
    if (inRange) return "range";
    return "default";
  }

  return (
    <div className="border border-ff-gold/30 bg-ff-green-deep p-3 shadow-[0_16px_40px_rgba(0,0,0,0.45)] sm:p-3.5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => goMonth(-1)}
          className="flex h-8 w-8 items-center justify-center border border-ff-gold/30 text-ff-gold transition hover:border-ff-gold hover:bg-ff-gold/10"
          aria-label="Previous month"
        >
          ‹
        </button>
        <p className="text-sm font-medium text-white">
          {MONTHS[viewMonth]} {viewYear}
        </p>
        <button
          type="button"
          onClick={() => goMonth(1)}
          className="flex h-8 w-8 items-center justify-center border border-ff-gold/30 text-ff-gold transition hover:border-ff-gold hover:bg-ff-gold/10"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center">
        {WEEKDAYS.map((day) => (
          <span
            key={day}
            className="py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-ff-gold/80"
          >
            {day}
          </span>
        ))}

        {cells.map(({ iso, day, inMonth }) => {
          const state = dayState(iso, inMonth);
          const disabled =
            state === "disabled" ||
            state === "outside" ||
            state === "blocked";

          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => handleDayClick(iso, inMonth)}
              title={
                state === "blocked"
                  ? "Already booked for this product"
                  : undefined
              }
              className={[
                "relative h-9 text-sm transition",
                state === "outside" && "pointer-events-none text-white/15",
                state === "disabled" && "cursor-not-allowed text-white/25",
                state === "blocked" &&
                  "cursor-not-allowed bg-red-500/20 text-red-200/70 line-through",
                state === "default" &&
                  "text-white hover:bg-ff-gold/15 hover:text-ff-gold-light",
                state === "range" && "bg-ff-gold/20 text-white",
                (state === "start" || state === "end" || state === "single") &&
                  "bg-ff-gold font-semibold text-ff-green-deep",
                state === "start" && endDate && "rounded-l-sm",
                state === "end" && startDate && "rounded-r-sm",
                state === "single" && "rounded-sm",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-label={inMonth ? iso : undefined}
              aria-pressed={
                state === "start" || state === "end" || state === "single"
              }
            >
              {day}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-[0.68rem] leading-relaxed text-white/55">
        {blockedDays.size > 0
          ? "Red struck-through dates are already booked for this product (including your own bookings) and cannot be selected. "
          : ""}
        {startDate && !endDate
          ? "Now select your end date."
          : `Select start date, then end date (max ${maxDays} days).`}
      </p>
    </div>
  );
}

export function DateRangeCalendar({
  minDate,
  startDate,
  endDate,
  maxDays = 90,
  blockedRanges = [],
  disabled = false,
  onChange,
  inputClassName = "",
  onOpen,
}: DateRangeCalendarProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const displayValue = useMemo(() => {
    if (startDate && endDate) {
      return `${formatDisplay(startDate)} → ${formatDisplay(endDate)}`;
    }
    if (startDate) {
      return `${formatDisplay(startDate)} → …`;
    }
    return "";
  }, [startDate, endDate]);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id="booking-date-range"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          if (disabled) return;
          setOpen((v) => {
            const next = !v;
            if (next) onOpen?.();
            return next;
          });
        }}
        disabled={disabled}
        className={`mt-2 flex w-full items-center justify-between gap-3 border border-ff-gold/35 bg-black/20 px-3.5 py-[0.7rem] text-left text-[0.875rem] normal-case tracking-normal outline-none transition hover:border-ff-gold/55 focus:border-ff-gold disabled:cursor-not-allowed disabled:opacity-55 ${
          displayValue ? "text-white" : "text-white/40"
        } ${inputClassName}`}
      >
        <span className="truncate">
          {disabled
            ? "Select a product first"
            : displayValue || "Select start & end date"}
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-ff-gold"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden
        >
          <rect x="3" y="5" width="18" height="16" rx="1" />
          <path d="M8 3v4M16 3v4M3 10h18" />
        </svg>
      </button>

      {open ? (
        <div
          className="absolute left-0 right-0 top-full z-[130] mt-1.5"
          role="dialog"
          aria-label="Select rental dates"
        >
          <CalendarGrid
            minDate={minDate}
            startDate={startDate}
            endDate={endDate}
            maxDays={maxDays}
            blockedRanges={blockedRanges}
            onChange={onChange}
            onComplete={() => setOpen(false)}
          />
        </div>
      ) : null}
    </div>
  );
}
