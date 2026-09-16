"use client";

import { FormEvent, useMemo, useState } from "react";
import { submitContact } from "@/lib/api";

const fields = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "company", label: "Company", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "telephone", label: "Telephone", type: "tel", required: false },
  { name: "eventVenue", label: "Event / Venue", type: "text", required: false },
  { name: "eventDate", label: "Event Date", type: "date", required: false },
  { name: "location", label: "Location", type: "text", required: false },
  {
    name: "attendance",
    label: "Expected Attendance",
    type: "text",
    required: false,
  },
] as const;

type FieldName = (typeof fields)[number]["name"];

function todayISODate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isPhoneValid(value: string) {
  if (!value.trim()) return true;
  return /^\+?[\d\s()-]{7,20}$/.test(value.trim()) && /\d{7,}/.test(value);
}

function isAttendanceValid(value: string) {
  if (!value.trim()) return true;
  return /^\d+$/.test(value.trim());
}

function isDateNotPast(value: string, minDate: string) {
  if (!value) return true;
  return value >= minDate;
}

export function ContactForm() {
  const minDate = useMemo(() => todayISODate(), []);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [telephone, setTelephone] = useState("");
  const [attendance, setAttendance] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});

  function sanitizePhone(value: string) {
    return value.replace(/[^\d+\s()-]/g, "");
  }

  function sanitizeAttendance(value: string) {
    return value.replace(/\D/g, "");
  }

  function validate() {
    const next: Partial<Record<FieldName, string>> = {};

    if (!isPhoneValid(telephone)) {
      next.telephone = "Enter a valid phone number using digits only.";
    }

    if (!isAttendanceValid(attendance)) {
      next.attendance = "Expected attendance must be a number.";
    }

    if (!isDateNotPast(eventDate, minDate)) {
      next.eventDate = "Event date cannot be in the past.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    setSubmitting(true);
    setSubmitError("");

    try {
      await submitContact({
        name: String(data.get("name") || "").trim(),
        company: String(data.get("company") || "").trim(),
        email: String(data.get("email") || "").trim(),
        telephone: telephone.trim() || undefined,
        eventVenue: String(data.get("eventVenue") || "").trim() || undefined,
        eventDate: eventDate || undefined,
        location: String(data.get("location") || "").trim() || undefined,
        attendance: attendance ? Number(attendance) : undefined,
        goal: String(data.get("goal") || "").trim() || undefined,
        message: String(data.get("message") || "").trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to submit. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="border border-ff-gold/40 bg-ff-green p-8 text-center">
        <h2 className="ff-heading ff-heading-md">Thank you</h2>
        <p className="mt-4 text-sm text-white">
          Your activation brief has been received. The FOOTFALL team will be in
          touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => {
          const sharedClassName =
            "mt-2 w-full border border-ff-gold/30 bg-ff-green/40 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition focus:border-ff-gold [color-scheme:dark]";

          if (field.name === "telephone") {
            return (
              <label
                key={field.name}
                className="block text-xs uppercase tracking-[0.16em] text-ff-gold"
              >
                {field.label}
                <input
                  name={field.name}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={telephone}
                  onChange={(e) => {
                    setTelephone(sanitizePhone(e.target.value));
                    if (errors.telephone) {
                      setErrors((prev) => ({ ...prev, telephone: undefined }));
                    }
                  }}
                  onBlur={() => {
                    if (!isPhoneValid(telephone)) {
                      setErrors((prev) => ({
                        ...prev,
                        telephone:
                          "Enter a valid phone number using digits only.",
                      }));
                    }
                  }}
                  aria-invalid={Boolean(errors.telephone)}
                  className={sharedClassName}
                />
                {errors.telephone ? (
                  <span className="mt-1.5 block text-[0.7rem] normal-case tracking-normal text-red-300">
                    {errors.telephone}
                  </span>
                ) : null}
              </label>
            );
          }

          if (field.name === "eventDate") {
            return (
              <label
                key={field.name}
                className="block text-xs uppercase tracking-[0.16em] text-ff-gold"
              >
                {field.label}
                <input
                  name={field.name}
                  type="date"
                  min={minDate}
                  value={eventDate}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEventDate(value);
                    if (value && !isDateNotPast(value, minDate)) {
                      setErrors((prev) => ({
                        ...prev,
                        eventDate: "Event date cannot be in the past.",
                      }));
                    } else if (errors.eventDate) {
                      setErrors((prev) => ({ ...prev, eventDate: undefined }));
                    }
                  }}
                  aria-invalid={Boolean(errors.eventDate)}
                  className={`${sharedClassName} [color-scheme:dark]`}
                />
                {errors.eventDate ? (
                  <span className="mt-1.5 block text-[0.7rem] normal-case tracking-normal text-red-300">
                    {errors.eventDate}
                  </span>
                ) : null}
              </label>
            );
          }

          if (field.name === "attendance") {
            return (
              <label
                key={field.name}
                className="block text-xs uppercase tracking-[0.16em] text-ff-gold"
              >
                {field.label}
                <input
                  name={field.name}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={attendance}
                  onChange={(e) => {
                    setAttendance(sanitizeAttendance(e.target.value));
                    if (errors.attendance) {
                      setErrors((prev) => ({ ...prev, attendance: undefined }));
                    }
                  }}
                  aria-invalid={Boolean(errors.attendance)}
                  className={sharedClassName}
                />
                {errors.attendance ? (
                  <span className="mt-1.5 block text-[0.7rem] normal-case tracking-normal text-red-300">
                    {errors.attendance}
                  </span>
                ) : null}
              </label>
            );
          }

          return (
            <label
              key={field.name}
              className="block text-xs uppercase tracking-[0.16em] text-ff-gold"
            >
              {field.label}
              <input
                name={field.name}
                type={field.type}
                required={field.required}
                className={sharedClassName}
              />
            </label>
          );
        })}
      </div>

      <label className="block text-xs uppercase tracking-[0.16em] text-ff-gold">
        What Are You Trying to Achieve?
        <textarea
          name="goal"
          rows={3}
          className="mt-2 w-full border border-ff-gold/30 bg-ff-green/40 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition focus:border-ff-gold"
        />
      </label>

      <label className="block text-xs uppercase tracking-[0.16em] text-ff-gold">
        Message
        <textarea
          name="message"
          rows={5}
          required
          className="mt-2 w-full border border-ff-gold/30 bg-ff-green/40 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition focus:border-ff-gold"
        />
      </label>

      {submitError ? (
        <p className="text-sm text-red-300" role="alert">
          {submitError}
        </p>
      ) : null}

      <button type="submit" className="btn-gold" disabled={submitting}>
        {submitting ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
