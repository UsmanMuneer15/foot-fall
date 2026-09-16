"use client";

import {
  FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { fetchServiceFeeRates, submitBooking, fetchProductAvailability } from "@/lib/api";
import {
  DateRangeCalendar,
  daysInRange,
  isDateBlocked,
  rangeOverlapsBlocked,
  type BlockedDateRange,
} from "@/components/DateRangeCalendar";
import { getUser } from "@/lib/auth";
import { toast } from "@/lib/toast";
import {
  summarizeFieldErrors,
  toFieldErrors,
  UAE_EMIRATES,
  validateEmail,
  validateEmirate,
  validateName,
  validatePhone,
  validateRequiredText,
} from "@/lib/validation";

type BookingModalProps = {
  open: boolean;
  onClose: () => void;
  initialProductId?: string | null;
};

type FieldKey =
  | "eventType"
  | "productId"
  | "dates"
  | "customerName"
  | "customerEmail"
  | "customerPhone"
  | "addressLine"
  | "area"
  | "emirate"
  | "poBox"
  | "notes"
  | "cardName"
  | "cardNumber"
  | "cardExpiry"
  | "cardCvc";

type FieldErrors = Partial<Record<FieldKey, string>>;

function todayISODate() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const labelClass =
  "block text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ff-gold";

const fieldClass =
  "mt-2 w-full border border-ff-gold/35 bg-black/20 px-3.5 py-[0.7rem] text-[0.875rem] normal-case tracking-normal text-white outline-none transition placeholder:text-white/35 hover:border-ff-gold/55 focus:border-ff-gold [color-scheme:dark]";

const fieldErrorClass =
  "mt-2 w-full border border-red-400/70 bg-black/20 px-3.5 py-[0.7rem] text-[0.875rem] normal-case tracking-normal text-white outline-none transition focus:border-red-300 [color-scheme:dark]";

const computedFieldClass =
  "mt-2 w-full cursor-default border border-ff-gold/25 bg-ff-gold/[0.07] px-3.5 py-[0.7rem] text-[0.875rem] font-medium normal-case tracking-normal text-ff-gold-light outline-none";

const selectClass = `${fieldClass} appearance-none bg-[length:0.85rem] bg-[right_0.9rem_center] bg-no-repeat pr-10 [&>option]:bg-ff-green-deep [&>option]:text-white`;
const selectErrorClass = `${fieldErrorClass} appearance-none bg-[length:0.85rem] bg-[right_0.9rem_center] bg-no-repeat pr-10 [&>option]:bg-ff-green-deep [&>option]:text-white`;

const selectChevron =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23c5a059' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")";

function inputClass(hasError?: string) {
  return hasError ? fieldErrorClass : fieldClass;
}

function selectInputClass(hasError?: string) {
  return hasError ? selectErrorClass : selectClass;
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-ff-gold">
        {children}
      </p>
      <span className="h-px flex-1 bg-gradient-to-r from-ff-gold/35 to-transparent" />
    </div>
  );
}

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
  const [endDate, setEndDate] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [area, setArea] = useState("");
  const [emirate, setEmirate] = useState("");
  const [poBox, setPoBox] = useState("");
  const [notes, setNotes] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [paid, setPaid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingCode, setBookingCode] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [fees, setFees] = useState<ServiceFeeRates>(serviceFees.local);
  const [blockedRanges, setBlockedRanges] = useState<BlockedDateRange[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityNonce, setAvailabilityNonce] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    overlayRef.current?.scrollTo({ top: 0 });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const user = getUser();
    if (!user) {
      toast.error("Please sign in to create an activation.");
      onClose();
      return;
    }

    setScope("local");
    setEventType("");
    setProductId(initialProductId ?? "");
    setStartDate("");
    setEndDate("");
    setCustomerName(user.name || "");
    setCustomerEmail(user.email || "");
    setCustomerPhone((user.phone || "").trim());
    setAddressLine("");
    setArea("");
    setEmirate("");
    setPoBox("");
    setNotes("");
    setLatitude(null);
    setLongitude(null);
    setCardName("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
    setPaid(false);
    setSubmitting(false);
    setBookingCode("");
    setBlockedRanges([]);
    setAvailabilityLoading(false);
    setAvailabilityNonce((n) => n + 1);
    setErrors({});
  }, [open, initialProductId, onClose]);

  useEffect(() => {
    if (!open || !productId) {
      setBlockedRanges([]);
      setAvailabilityLoading(false);
      return;
    }

    let active = true;
    setAvailabilityLoading(true);
    fetchProductAvailability(productId, minDate)
      .then((ranges) => {
        if (!active) return;
        const next = ranges.map((range) => ({
          startDate: range.startDate,
          endDate: range.endDate,
        }));
        setBlockedRanges(next);
      })
      .catch(() => {
        if (!active) return;
        setBlockedRanges([]);
        toast.error(
          "Could not load booked dates for this product. Please try again.",
        );
      })
      .finally(() => {
        if (active) setAvailabilityLoading(false);
      });

    return () => {
      active = false;
    };
  }, [open, productId, minDate, availabilityNonce]);

  useEffect(() => {
    // Don't clear/toast after a successful submit, or while a submit is in flight.
    if (paid || submitting) return;
    if (!startDate || blockedRanges.length === 0) return;
    const startBlocked = isDateBlocked(startDate, blockedRanges);
    const endBlocked =
      Boolean(endDate) &&
      rangeOverlapsBlocked(startDate, endDate, blockedRanges);
    if (startBlocked || endBlocked) {
      setStartDate("");
      setEndDate("");
      toast.info(
        "Your selected dates are no longer available for this product. Please choose different dates.",
      );
    }
  }, [blockedRanges, startDate, endDate, paid, submitting]);

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
  const days = startDate && endDate ? daysInRange(startDate, endDate) : 0;
  const quote: BookingQuote | null =
    productId && days > 0
      ? calculateBookingQuote({ productId, days, scope, fees })
      : null;

  function clearFieldError(field: FieldKey) {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function useCurrentLocation() {
    if (!navigator.geolocation) {
      toast.error("Location is not supported in this browser.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLatitude(lat);
        setLongitude(lng);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`,
            {
              headers: { Accept: "application/json" },
            },
          );
          if (!res.ok) throw new Error("Reverse geocode failed");
          const data = (await res.json()) as {
            display_name?: string;
            address?: Record<string, string>;
          };
          const addr = data.address || {};
          const line =
            [addr.house_number, addr.road, addr.building]
              .filter(Boolean)
              .join(" ") ||
            data.display_name?.split(",")[0] ||
            "";
          const community =
            addr.suburb ||
            addr.neighbourhood ||
            addr.quarter ||
            addr.residential ||
            addr.city_district ||
            "";
          const cityOrState = addr.state || addr.city || addr.town || "";
          const matchedEmirate = UAE_EMIRATES.find((item) =>
            cityOrState.toLowerCase().includes(item.toLowerCase()),
          );

          if (line) {
            setAddressLine(line);
            clearFieldError("addressLine");
          }
          if (community) {
            setArea(community);
            clearFieldError("area");
          }
          if (matchedEmirate) {
            setEmirate(matchedEmirate);
            clearFieldError("emirate");
          }
          if (addr.postcode) setPoBox(addr.postcode);

          toast.success("Current location applied to your address.");
        } catch {
          toast.info(
            "Location captured. Please complete the address fields manually.",
          );
        } finally {
          setLocating(false);
        }
      },
      (geoError) => {
        setLocating(false);
        if (geoError.code === geoError.PERMISSION_DENIED) {
          toast.error(
            "Location permission denied. Enter your address manually.",
          );
          return;
        }
        toast.error("Unable to get your current location.");
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  }

  function validateBooking(): boolean {
    const next = toFieldErrors({
      eventType: eventType ? null : "Please select an event type.",
      productId: productId ? null : "Please choose a product.",
      dates:
        !startDate || !endDate
          ? "Please select a start and end date."
          : days < 1
            ? "Rental must be at least 1 day."
            : rangeOverlapsBlocked(startDate, endDate, blockedRanges)
              ? "Selected dates are already booked for this product."
              : null,
      customerName: validateName(customerName),
      customerEmail: validateEmail(customerEmail),
      customerPhone: validatePhone(customerPhone),
      addressLine: validateRequiredText(addressLine, "Address"),
      area: validateRequiredText(area, "Area / Community"),
      emirate: validateEmirate(emirate),
      poBox: null,
      notes: null,
      cardName: cardName.trim()
        ? null
        : "Please enter the name on the card.",
      cardNumber:
        cardNumber.replace(/\s/g, "").length < 12
          ? "Enter a valid card number."
          : null,
      cardExpiry: /^\d{2}\/\d{2}$/.test(cardExpiry)
        ? null
        : "Enter card expiry as MM/YY.",
      cardCvc: cardCvc.length < 3 ? "Enter a valid CVC." : null,
    });

    setErrors(next);
    const summary = summarizeFieldErrors(next);
    if (summary) {
      toast.error(summary);
      return false;
    }
    return true;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateBooking() || !quote || !product || submitting) return;

    setSubmitting(true);
    try {
      const result = await submitBooking({
        scope,
        eventType,
        productId,
        productName: product.name,
        startDate,
        endDate,
        days,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim() || undefined,
        addressLine: addressLine.trim(),
        area: area.trim(),
        emirate,
        poBox: poBox.trim() || undefined,
        latitude,
        longitude,
        notes: notes.trim() || undefined,
        rental: quote.rental,
        transport: quote.transport,
        labor: quote.labor,
        setup: quote.setup,
        crew: quote.crew,
        cargo: quote.cargo,
        customs: quote.customs,
        subtotal: quote.subtotal,
        tax: quote.tax,
        total: quote.total,
      });
      setBookingCode(result.bookingCode);
      setPaid(true);
      toast.success("Booking request submitted. FOOTFALL will confirm shortly.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to submit booking.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-black/75 px-3 py-4 backdrop-blur-[3px] sm:px-6 sm:py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative my-auto w-full max-w-5xl overflow-hidden rounded-sm border border-ff-gold/30 bg-ff-green-deep shadow-[0_40px_100px_rgba(0,0,0,0.65)]">
        {/* Subtle top gold edge */}
        <div
          className="h-px w-full bg-gradient-to-r from-transparent via-ff-gold/70 to-transparent"
          aria-hidden
        />

        <div className="relative border-b border-ff-gold/15 bg-[linear-gradient(180deg,rgba(197,160,89,0.06)_0%,transparent_100%)] px-5 pb-5 pt-5 sm:px-8 sm:pb-6 sm:pt-6">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-ff-gold/40 text-ff-gold transition hover:border-ff-gold hover:bg-ff-gold hover:text-ff-green-deep sm:right-6 sm:top-5"
            aria-label="Close booking"
          >
            <span className="text-xl leading-none" aria-hidden>
              ×
            </span>
          </button>

          <div className="inline-flex items-center gap-2.5 pr-12">
            <span className="h-px w-7 bg-ff-gold/80" aria-hidden />
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-ff-gold">
              Footfall Bookings
            </p>
          </div>

          <h2
            id="booking-modal-title"
            className="ff-heading mt-2.5 text-[clamp(1.35rem,3vw,1.9rem)]"
          >
            Book an Activation
          </h2>
          <p className="mt-2.5 max-w-2xl text-[0.84rem] leading-relaxed text-white/65">
            Select your region, event, product and dates. Days and booking price
            update automatically — then add your UAE delivery details.
          </p>
        </div>

        {paid ? (
          <div className="px-5 py-14 text-center sm:px-8">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-ff-gold/50 bg-ff-gold/10 text-2xl text-ff-gold">
              ✓
            </div>
            <h3 className="ff-heading ff-heading-md">Thank you</h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/80">
              Your {scope === "local" ? "UAE local" : "international"} booking
              request {bookingCode ? `(${bookingCode}) ` : ""}for{" "}
              {product?.name} ({days} day{days > 1 ? "s" : ""}) totaling{" "}
              {quote ? formatAed(quote.total) : ""} incl. VAT has been received
              for {customerName.trim() || "your team"}. The FOOTFALL team will
              confirm availability shortly.
            </p>
            <button type="button" className="btn-gold mt-8" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <div className="grid lg:grid-cols-[minmax(0,1.45fr)_minmax(17rem,0.9fr)]">
              <div className="space-y-7 px-5 py-5 sm:px-8 sm:py-6">
                {/* Booking essentials */}
                <section>
                  <SectionTitle>Activation Details</SectionTitle>

                  <div className="space-y-4">
                    <div>
                      <span className={labelClass}>Service Region</span>
                      <div className="mt-2 grid grid-cols-2 overflow-hidden border border-ff-gold/35">
                        {(
                          [
                            { id: "local", label: "UAE Local" },
                            { id: "international", label: "International" },
                          ] as const
                        ).map((opt, index) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setScope(opt.id)}
                            className={`px-3 py-2.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] transition ${
                              index === 1 ? "border-l border-ff-gold/35" : ""
                            } ${
                              scope === opt.id
                                ? "bg-ff-gold text-ff-green-deep"
                                : "bg-black/15 text-white/85 hover:bg-ff-gold/10 hover:text-white"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      {scope === "international" ? (
                        <p className="mt-2 text-[0.72rem] text-white/50">
                          International includes cargo and customs handling.
                        </p>
                      ) : null}
                    </div>

                    <div className="grid items-start gap-4 sm:grid-cols-2">
                      <label className={labelClass} htmlFor="event-type">
                        Type of Event
                        <select
                          id="event-type"
                          className={selectInputClass(errors.eventType)}
                          style={{ backgroundImage: selectChevron }}
                          value={eventType}
                          onChange={(e) => {
                            setEventType(e.target.value);
                            clearFieldError("eventType");
                          }}
                          aria-invalid={Boolean(errors.eventType)}
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
                          className={selectInputClass(errors.productId)}
                          style={{ backgroundImage: selectChevron }}
                          value={productId}
                          onChange={(e) => {
                            setProductId(e.target.value);
                            setStartDate("");
                            setEndDate("");
                            clearFieldError("productId");
                            clearFieldError("dates");
                          }}
                          aria-invalid={Boolean(errors.productId)}
                        >
                          <option value="">Choose a product</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </label>

                      <div className="min-w-0 sm:col-span-2">
                        <label
                          className={labelClass}
                          htmlFor="booking-date-range"
                        >
                          Start Date &amp; End Date
                        </label>
                        <DateRangeCalendar
                          minDate={minDate}
                          startDate={startDate}
                          endDate={endDate}
                          maxDays={90}
                          blockedRanges={blockedRanges}
                          disabled={!productId}
                          inputClassName={
                            errors.dates
                              ? "!mt-2 !border-red-400/70 focus:!border-red-300"
                              : "!mt-2"
                          }
                          onOpen={() => setAvailabilityNonce((n) => n + 1)}
                          onChange={(start, end) => {
                            setStartDate(start);
                            setEndDate(end);
                            clearFieldError("dates");
                          }}
                        />
                        {productId ? (
                          <p className="mt-1.5 text-[0.68rem] text-white/45">
                            {availabilityLoading
                              ? "Checking booked dates for this product…"
                              : blockedRanges.length > 0
                                ? `${blockedRanges.length} booked period${blockedRanges.length > 1 ? "s" : ""} are unavailable — including any dates you already booked.`
                                : "All upcoming dates are currently available for this product."}
                          </p>
                        ) : (
                          <p className="mt-1.5 text-[0.68rem] text-white/45">
                            Select a product to see available dates.
                          </p>
                        )}
                      </div>

                      <label className={labelClass} htmlFor="number-of-days">
                        Number of Days
                        <input
                          id="number-of-days"
                          className={computedFieldClass}
                          value={
                            days > 0
                              ? `${days} day${days > 1 ? "s" : ""}`
                              : "—"
                          }
                          readOnly
                          tabIndex={-1}
                        />
                      </label>

                      <label className={labelClass} htmlFor="booking-price">
                        Booking Price
                        <input
                          id="booking-price"
                          className={computedFieldClass}
                          value={
                            quote
                              ? `${formatAed(quote.total)} incl. VAT`
                              : "—"
                          }
                          readOnly
                          tabIndex={-1}
                        />
                      </label>
                    </div>
                  </div>
                </section>

                {/* Customer */}
                <section>
                  <SectionTitle>Customer Details</SectionTitle>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className={labelClass} htmlFor="customer-name">
                      Name
                      <input
                        id="customer-name"
                        className={inputClass(errors.customerName)}
                        value={customerName}
                        onChange={(e) => {
                          setCustomerName(e.target.value);
                          clearFieldError("customerName");
                        }}
                        autoComplete="name"
                        aria-invalid={Boolean(errors.customerName)}
                      />
                    </label>

                    <label className={labelClass} htmlFor="customer-email">
                      Email
                      <input
                        id="customer-email"
                        type="email"
                        className={inputClass(errors.customerEmail)}
                        value={customerEmail}
                        onChange={(e) => {
                          setCustomerEmail(e.target.value);
                          clearFieldError("customerEmail");
                        }}
                        autoComplete="email"
                        aria-invalid={Boolean(errors.customerEmail)}
                      />
                    </label>

                    <label
                      className={`${labelClass} sm:col-span-2`}
                      htmlFor="customer-phone"
                    >
                      Phone Number{" "}
                      <span className="font-normal normal-case tracking-normal text-white/40">
                        (optional)
                      </span>
                      <input
                        id="customer-phone"
                        type="tel"
                        className={inputClass(errors.customerPhone)}
                        value={customerPhone}
                        onChange={(e) => {
                          setCustomerPhone(
                            e.target.value.replace(/[^\d+\s()-]/g, ""),
                          );
                          clearFieldError("customerPhone");
                        }}
                        autoComplete="tel"
                        aria-invalid={Boolean(errors.customerPhone)}
                      />
                    </label>
                  </div>
                </section>

                {/* Address */}
                <section>
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 w-full items-center gap-3 sm:flex-1">
                      <p className="shrink-0 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-ff-gold">
                        Location / Address
                      </p>
                      <span
                        className="h-px flex-1 bg-gradient-to-r from-ff-gold/35 to-transparent"
                        aria-hidden
                      />
                    </div>
                    <button
                      type="button"
                      onClick={useCurrentLocation}
                      disabled={locating}
                      className="inline-flex w-full items-center justify-center gap-2 border border-ff-gold/55 bg-transparent px-3.5 py-2.5 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-ff-gold transition hover:border-ff-gold hover:bg-ff-gold/10 disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto sm:shrink-0 sm:justify-start sm:py-2"
                    >
                      <svg
                        className="h-3.5 w-3.5 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        aria-hidden
                      >
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                        <circle cx="12" cy="12" r="8" />
                      </svg>
                      {locating ? "Locating…" : "Use Current Location"}
                    </button>
                  </div>

                  {latitude != null && longitude != null ? (
                    <p className="mb-3 text-[0.68rem] tracking-wide text-white/45">
                      Coordinates: {latitude.toFixed(5)},{" "}
                      {longitude.toFixed(5)}
                    </p>
                  ) : null}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label
                      className={`${labelClass} sm:col-span-2`}
                      htmlFor="address-line"
                    >
                      Address
                      <input
                        id="address-line"
                        className={inputClass(errors.addressLine)}
                        value={addressLine}
                        onChange={(e) => {
                          setAddressLine(e.target.value);
                          clearFieldError("addressLine");
                        }}
                        autoComplete="street-address"
                        placeholder="Building, street, landmark"
                        aria-invalid={Boolean(errors.addressLine)}
                      />
                    </label>

                    <label className={labelClass} htmlFor="area-community">
                      Area / Community
                      <input
                        id="area-community"
                        className={inputClass(errors.area)}
                        value={area}
                        onChange={(e) => {
                          setArea(e.target.value);
                          clearFieldError("area");
                        }}
                        placeholder="e.g. Dubai Marina"
                        aria-invalid={Boolean(errors.area)}
                      />
                    </label>

                    <label className={labelClass} htmlFor="emirate">
                      Emirate
                      <select
                        id="emirate"
                        className={selectInputClass(errors.emirate)}
                        style={{ backgroundImage: selectChevron }}
                        value={emirate}
                        onChange={(e) => {
                          setEmirate(e.target.value);
                          clearFieldError("emirate");
                        }}
                        aria-invalid={Boolean(errors.emirate)}
                      >
                        <option value="">Select emirate</option>
                        {UAE_EMIRATES.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label
                      className={`${labelClass} sm:col-span-2`}
                      htmlFor="po-box"
                    >
                      P.O. Box / PIN Code{" "}
                      <span className="font-normal normal-case tracking-normal text-white/40">
                        (optional)
                      </span>
                      <input
                        id="po-box"
                        className={inputClass(errors.poBox)}
                        value={poBox}
                        onChange={(e) => setPoBox(e.target.value)}
                        autoComplete="postal-code"
                      />
                    </label>

                    <label
                      className={`${labelClass} sm:col-span-2`}
                      htmlFor="special-notes"
                    >
                      Special Requirements / Notes{" "}
                      <span className="font-normal normal-case tracking-normal text-white/40">
                        (optional)
                      </span>
                      <textarea
                        id="special-notes"
                        className={`${inputClass(errors.notes)} min-h-[6rem] resize-y leading-relaxed`}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Access notes, timing preferences, branding needs…"
                      />
                    </label>
                  </div>
                </section>
              </div>

              {/* Charges — sticky on desktop */}
              <aside className="border-t border-ff-gold/15 bg-[linear-gradient(180deg,#002117_0%,#00150f_100%)] px-5 py-5 sm:px-6 sm:py-6 lg:border-l lg:border-t-0">
                <div className="lg:sticky lg:top-6">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-ff-gold/80">
                    Charges Panel
                  </p>
                  <h3 className="mt-1.5 text-[0.92rem] font-semibold uppercase tracking-[0.1em] text-ff-gold">
                    {scope === "local" ? "UAE Local" : "International"} Estimate
                  </h3>
                  <p className="mt-1.5 text-[0.72rem] leading-relaxed text-white/45">
                    Live quote based on product, duration and service region.
                  </p>

                  {!quote ? (
                    <div className="mt-6 border border-dashed border-ff-gold/25 bg-black/15 px-4 py-8 text-center">
                      <p className="text-[0.8rem] leading-relaxed text-white/50">
                        Select a product and dates to see rental and service
                        charges.
                      </p>
                    </div>
                  ) : (
                    <ul className="mt-5 space-y-0 text-sm">
                      <ChargeRow
                        label={`Rental (${days} day${days > 1 ? "s" : ""})`}
                        value={formatAed(quote.rental)}
                        emphasize
                      />
                      <ChargeRow
                        label="Transport"
                        value={formatAed(quote.transport)}
                      />
                      <ChargeRow
                        label="Labour"
                        value={formatAed(quote.labor)}
                      />
                      <ChargeRow
                        label="Setup"
                        value={formatAed(quote.setup)}
                      />
                      <ChargeRow
                        label="Crew (per days)"
                        value={formatAed(quote.crew)}
                        divider
                      />
                      {scope === "international" ? (
                        <>
                          <ChargeRow
                            label="Cargo"
                            value={formatAed(quote.cargo)}
                          />
                          <ChargeRow
                            label="Customs handling"
                            value={formatAed(quote.customs)}
                            divider
                          />
                        </>
                      ) : null}
                      <ChargeRow
                        label="Subtotal"
                        value={formatAed(quote.subtotal)}
                      />
                      <ChargeRow
                        label={`VAT (${Math.round(UAE_VAT_RATE * 100)}%)`}
                        value={formatAed(quote.tax)}
                      />
                      <li className="mt-4 flex items-center justify-between gap-4 border border-ff-gold/45 bg-ff-gold/10 px-3.5 py-3.5">
                        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ff-gold">
                          Total due
                        </span>
                        <span className="text-lg font-bold tracking-wide text-ff-gold">
                          {formatAed(quote.total)}
                        </span>
                      </li>
                    </ul>
                  )}
                </div>
              </aside>
            </div>

            {/* Checkout footer */}
            <div className="border-t border-ff-gold/20 bg-black/25 px-5 py-5 sm:px-8 sm:py-6">
              <div className="mb-4 flex items-center gap-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-ff-gold">
                  Checkout — Pay by Card
                </p>
                <span className="h-px flex-1 bg-gradient-to-r from-ff-gold/35 to-transparent" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <label className={labelClass}>
                  Name on Card
                  <input
                    className={inputClass(errors.cardName)}
                    placeholder="Full name"
                    value={cardName}
                    onChange={(e) => {
                      setCardName(e.target.value);
                      clearFieldError("cardName");
                    }}
                    autoComplete="cc-name"
                    aria-invalid={Boolean(errors.cardName)}
                  />
                </label>
                <label className={labelClass}>
                  Card Number
                  <input
                    className={inputClass(errors.cardNumber)}
                    placeholder="•••• •••• •••• ••••"
                    value={cardNumber}
                    onChange={(e) => {
                      setCardNumber(
                        e.target.value
                          .replace(/[^\d]/g, "")
                          .slice(0, 16)
                          .replace(/(.{4})/g, "$1 ")
                          .trim(),
                      );
                      clearFieldError("cardNumber");
                    }}
                    inputMode="numeric"
                    autoComplete="cc-number"
                    aria-invalid={Boolean(errors.cardNumber)}
                  />
                </label>
                <label className={labelClass}>
                  Expiry
                  <input
                    className={inputClass(errors.cardExpiry)}
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => {
                      let v = e.target.value.replace(/[^\d]/g, "").slice(0, 4);
                      if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                      setCardExpiry(v);
                      clearFieldError("cardExpiry");
                    }}
                    autoComplete="cc-exp"
                    aria-invalid={Boolean(errors.cardExpiry)}
                  />
                </label>
                <label className={labelClass}>
                  CVC
                  <input
                    className={inputClass(errors.cardCvc)}
                    placeholder="CVC"
                    value={cardCvc}
                    onChange={(e) => {
                      setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4));
                      clearFieldError("cardCvc");
                    }}
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    aria-invalid={Boolean(errors.cardCvc)}
                  />
                </label>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[0.68rem] leading-relaxed text-white/40">
                  Demo checkout — card details are not sent to a payment
                  processor yet.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold !min-w-[14rem] !justify-center !px-8 !py-3.5 !text-[0.72rem] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Submitting…"
                    : `Pay ${quote ? formatAed(quote.total) : ""} →`}
                </button>
              </div>
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
      className={`flex items-baseline justify-between gap-4 py-2.5 ${
        divider || emphasize ? "border-b border-ff-gold/15" : ""
      }`}
    >
      <span className="text-[0.82rem] text-white/60">{label}</span>
      <span
        className={`shrink-0 text-[0.88rem] tabular-nums ${
          emphasize ? "font-semibold text-ff-gold-light" : "text-white/90"
        }`}
      >
        {value}
      </span>
    </li>
  );
}
