"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  BookingQuote,
  calculateBookingQuote,
  eventTypes,
  formatAed,
  getProductById,
  products,
  ServiceFeeRates,
  ServiceScope,
  serviceFees,
  UAE_VAT_RATE,
} from "@/lib/products";
import { fetchServiceFeeRates } from "@/lib/api";

type BookingModalProps = {
  open: boolean;
  onClose: () => void;
  initialProductId?: string | null;
};

function todayISODate() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDaysISO(iso: string, days: number) {
  const date = new Date(`${iso}T12:00:00`);
  date.setDate(date.getDate() + days);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const labelClass =
  "block text-xs uppercase tracking-[0.16em] text-ff-gold";

const fieldClass =
  "mt-2 w-full border border-ff-gold/30 bg-ff-green/40 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition focus:border-ff-gold [color-scheme:dark]";

const selectClass = `${fieldClass} [&>option]:bg-ff-green-deep [&>option]:text-white`;

export function BookingModal({
  open,
  onClose,
  initialProductId = null,
}: BookingModalProps) {
  const minDate = useMemo(() => todayISODate(), []);
  const [scope, setScope] = useState<ServiceScope>("local");
  const [eventType, setEventType] = useState("");
  const [productId, setProductId] = useState(initialProductId ?? "");
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState(1);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState("");
  const [fees, setFees] = useState<ServiceFeeRates>(serviceFees.local);

  useEffect(() => {
    if (!open) return;
    setProductId(initialProductId ?? "");
    setPaid(false);
    setError("");
  }, [open, initialProductId]);

  useEffect(() => {
    let active = true;
    fetchServiceFeeRates(scope).then((rates) => {
      if (active) setFees(rates);
    });
    return () => {
      active = false;
    };
  }, [scope, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const product = productId ? getProductById(productId) : undefined;
  const quote: BookingQuote | null = productId
    ? calculateBookingQuote({ productId, days, scope, fees })
    : null;
  const endDate = startDate ? addDaysISO(startDate, Math.max(0, days - 1)) : "";

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!eventType) {
      setError("Please select an event type.");
      return;
    }
    if (!productId) {
      setError("Please choose a product.");
      return;
    }
    if (!startDate) {
      setError("Please choose a start date on the calendar.");
      return;
    }
    if (days < 1) {
      setError("Rental must be at least 1 day.");
      return;
    }
    if (!cardName.trim() || cardNumber.replace(/\s/g, "").length < 12) {
      setError("Enter valid card details to continue checkout.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry) || cardCvc.length < 3) {
      setError("Check card expiry (MM/YY) and CVC.");
      return;
    }
    setError("");
    setPaid(true);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/70 px-3 py-6 backdrop-blur-[2px] sm:px-6 sm:py-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl overflow-hidden rounded-sm border border-ff-gold/25 bg-ff-green-deep shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
        {/* Integrated dark header — aligned with site contact / page heroes */}
        <div className="relative border-b border-ff-gold/20 px-5 pb-6 pt-6 sm:px-8 sm:pb-7 sm:pt-7">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-ff-gold/40 text-ff-gold transition hover:border-ff-gold hover:bg-ff-gold hover:text-ff-green-deep sm:right-6 sm:top-5"
            aria-label="Close booking"
          >
            <span className="text-lg leading-none" aria-hidden>
              ×
            </span>
          </button>

          <div className="inline-flex items-center gap-2.5 pr-12">
            <span className="h-px w-6 bg-ff-gold/70" aria-hidden />
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-ff-gold">
              Footfall Bookings
            </p>
          </div>

          <h2
            id="booking-modal-title"
            className="ff-heading mt-3 text-[clamp(1.35rem,3vw,2rem)]"
          >
            Book an Activation
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
            Select your event type, product, dates and duration. Pricing updates
            like a rental — plus transport, labour, setup and crew for UAE local
            or international deliveries.
          </p>
        </div>

        {paid ? (
          <div className="px-5 py-14 text-center sm:px-8">
            <h3 className="ff-heading ff-heading-md">Thank you</h3>
            <p className="mx-auto mt-4 max-w-md text-sm text-white">
              Your {scope === "local" ? "UAE local" : "international"} booking
              for {product?.name} ({days} day{days > 1 ? "s" : ""}) totaling{" "}
              {quote ? formatAed(quote.total) : ""} incl. VAT has been received.
              The FOOTFALL team will confirm availability shortly.
            </p>
            <button type="button" className="btn-gold mt-8" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="grid gap-0 lg:grid-cols-[1.4fr_1fr]"
          >
            <div className="space-y-5 px-5 py-6 sm:px-8 sm:py-8">
              <div>
                <span className={labelClass}>Service Region</span>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {(
                    [
                      { id: "local", label: "UAE Local" },
                      { id: "international", label: "International" },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setScope(opt.id)}
                      className={`border px-3 py-3 text-[0.65rem] font-bold uppercase tracking-[0.14em] transition ${
                        scope === opt.id
                          ? "border-ff-gold bg-ff-gold text-ff-green-deep"
                          : "border-ff-gold/30 bg-ff-green/40 text-white hover:border-ff-gold"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {scope === "international" && (
                  <p className="mt-2 text-xs text-white/55">
                    International includes cargo and customs handling.
                  </p>
                )}
              </div>

              <div className="grid items-start gap-5 sm:grid-cols-2">
                <label className={labelClass} htmlFor="event-type">
                  Type of Event
                  <select
                    id="event-type"
                    className={selectClass}
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    required
                  >
                    <option value="">Select event type</option>
                    {eventTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={labelClass} htmlFor="product">
                  Product
                  <select
                    id="product"
                    className={selectClass}
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    required
                  >
                    <option value="">Choose a product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="min-w-0">
                  <label className={labelClass} htmlFor="start-date">
                    Calendar — Start Date
                  </label>
                  <input
                    id="start-date"
                    type="date"
                    min={minDate}
                    className={fieldClass}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                  <p className="mt-1.5 min-h-[1.1rem] text-[0.7rem] text-white/50">
                    {endDate
                      ? `Ends ${endDate} (${days} day${days > 1 ? "s" : ""})`
                      : "\u00a0"}
                  </p>
                </div>

                <div className="min-w-0">
                  <label className={labelClass} htmlFor="days">
                    How Many Days
                  </label>
                  <div className="mt-2 flex h-[46px] items-stretch gap-2">
                    <button
                      type="button"
                      className="flex w-11 shrink-0 items-center justify-center border border-ff-gold/30 bg-ff-green/40 text-lg text-ff-gold transition hover:border-ff-gold"
                      onClick={() => setDays((d) => Math.max(1, d - 1))}
                      aria-label="Decrease days"
                    >
                      −
                    </button>
                    <input
                      id="days"
                      type="number"
                      min={1}
                      max={90}
                      className="h-full w-full border border-ff-gold/30 bg-ff-green/40 px-4 text-center text-sm normal-case tracking-normal text-white outline-none transition focus:border-ff-gold [color-scheme:dark]"
                      value={days}
                      onChange={(e) =>
                        setDays(
                          Math.max(1, Math.min(90, Number(e.target.value) || 1)),
                        )
                      }
                    />
                    <button
                      type="button"
                      className="flex w-11 shrink-0 items-center justify-center border border-ff-gold/30 bg-ff-green/40 text-lg text-ff-gold transition hover:border-ff-gold"
                      onClick={() => setDays((d) => Math.min(90, d + 1))}
                      aria-label="Increase days"
                    >
                      +
                    </button>
                  </div>
                  <p className="mt-1.5 min-h-[1.1rem] text-[0.7rem] text-white/50">
                    {product
                      ? `${formatAed(product.dailyRateAed)} / day rental`
                      : "\u00a0"}
                  </p>
                </div>
              </div>
            </div>

            <aside className="border-t border-ff-gold/20 bg-ff-green px-5 py-6 sm:px-8 sm:py-8 lg:border-l lg:border-t-0">
              <p className="text-xs uppercase tracking-[0.2em] text-ff-gold">
                Charges Panel
              </p>
              <h3 className="mt-2 text-base font-medium uppercase tracking-[0.08em] text-ff-gold">
                {scope === "local" ? "UAE Local" : "International"} Estimate
              </h3>

              {!quote ? (
                <p className="mt-6 text-sm text-white/55">
                  Select a product to see rental and service charges.
                </p>
              ) : (
                <ul className="mt-6 space-y-3 text-sm">
                  <ChargeRow
                    label={`Rental (${days} day${days > 1 ? "s" : ""})`}
                    value={formatAed(quote.rental)}
                    emphasize
                  />
                  <ChargeRow label="Transport" value={formatAed(quote.transport)} />
                  <ChargeRow label="Labour" value={formatAed(quote.labor)} />
                  <ChargeRow label="Setup" value={formatAed(quote.setup)} />
                  <ChargeRow
                    label="Crew (per days)"
                    value={formatAed(quote.crew)}
                    divider
                  />
                  {scope === "international" && (
                    <>
                      <ChargeRow label="Cargo" value={formatAed(quote.cargo)} />
                      <ChargeRow
                        label="Customs handling"
                        value={formatAed(quote.customs)}
                        divider
                      />
                    </>
                  )}
                  <ChargeRow label="Subtotal" value={formatAed(quote.subtotal)} />
                  <ChargeRow
                    label={`VAT (${Math.round(UAE_VAT_RATE * 100)}%)`}
                    value={formatAed(quote.tax)}
                  />
                  <li className="mt-3 flex justify-between gap-4 border border-ff-gold/35 bg-ff-gold/10 px-3 py-3.5">
                    <span className="font-semibold uppercase tracking-[0.12em] text-ff-gold">
                      Total due
                    </span>
                    <span className="text-lg font-bold text-ff-gold">
                      {formatAed(quote.total)}
                    </span>
                  </li>
                </ul>
              )}
            </aside>

            <div className="space-y-5 border-t border-ff-gold/20 px-5 py-6 sm:px-8 sm:py-8 lg:col-span-2">
              <div className="border border-ff-gold/25 bg-ff-green/30 p-4 sm:p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-ff-gold">
                  Checkout — Pay by Card
                </p>
                <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <label className={labelClass}>
                    Name on Card
                    <input
                      className={fieldClass}
                      placeholder="Full name"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      autoComplete="cc-name"
                    />
                  </label>
                  <label className={labelClass}>
                    Card Number
                    <input
                      className={fieldClass}
                      placeholder="•••• •••• •••• ••••"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(
                          e.target.value
                            .replace(/[^\d]/g, "")
                            .slice(0, 16)
                            .replace(/(.{4})/g, "$1 ")
                            .trim(),
                        )
                      }
                      inputMode="numeric"
                      autoComplete="cc-number"
                    />
                  </label>
                  <label className={labelClass}>
                    Expiry
                    <input
                      className={fieldClass}
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/[^\d]/g, "").slice(0, 4);
                        if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                        setCardExpiry(v);
                      }}
                      autoComplete="cc-exp"
                    />
                  </label>
                  <label className={labelClass}>
                    CVC
                    <input
                      className={fieldClass}
                      placeholder="CVC"
                      value={cardCvc}
                      onChange={(e) =>
                        setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      inputMode="numeric"
                      autoComplete="cc-csc"
                    />
                  </label>
                </div>
                <p className="mt-3 text-[0.7rem] text-white/40">
                  Demo checkout — card details are not sent to a payment
                  processor yet.
                </p>
              </div>

              {error ? (
                <p className="text-sm text-red-300" role="alert">
                  {error}
                </p>
              ) : null}

              <button type="submit" className="btn-gold">
                Pay {quote ? formatAed(quote.total) : ""} →
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ChargeRow({
  label,
  value,
  emphasize = false,
  divider = false,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
  divider?: boolean;
}) {
  return (
    <li
      className={`flex justify-between gap-4 ${
        divider ? "border-b border-ff-gold/15 pb-3" : ""
      } ${emphasize ? "border-b border-ff-gold/15 pb-3" : ""}`}
    >
      <span className="text-white/70">{label}</span>
      <span className={emphasize ? "font-medium text-ff-gold-light" : "text-white"}>
        {value}
      </span>
    </li>
  );
}
