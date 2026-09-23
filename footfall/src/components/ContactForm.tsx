"use client";

import { FormEvent, useMemo, useState } from "react";
import { FieldErrorMessage } from "@/components/AuthForm";
import { submitContact } from "@/lib/api";
import {
  toFieldErrors,
  validateAttendance,
  validateEmail,
  validateEventDate,
  validateName,
  validateOptionalText,
  validatePhone,
  validateRequiredText,
} from "@/lib/validation";

type FieldName =
  | "name"
  | "company"
  | "email"
  | "telephone"
  | "eventVenue"
  | "eventDate"
  | "location"
  | "attendance"
  | "goal"
  | "message";

type FormValues = Record<FieldName, string>;

const emptyValues: FormValues = {
  name: "",
  company: "",
  email: "",
  telephone: "",
  eventVenue: "",
  eventDate: "",
  location: "",
  attendance: "",
  goal: "",
  message: "",
};

function todayISODate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fieldClass(hasError?: string) {
  return `mt-2 w-full bg-ff-green/40 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition [color-scheme:dark] ${
    hasError
      ? "border border-red-400/70 focus:border-red-300"
      : "border border-ff-gold/30 focus:border-ff-gold"
  }`;
}

export function ContactForm() {
  const minDate = useMemo(() => todayISODate(), []);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>(
    {},
  );

  function setField(field: FieldName, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function setFieldError(field: FieldName, message: string | null) {
    setErrors((prev) => {
      const next = { ...prev };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  }

  function markTouched(field: FieldName) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function messageFor(
    field: FieldName,
    nextValues: FormValues = values,
  ): string | null {
    switch (field) {
      case "name":
        return validateName(nextValues.name);
      case "company":
        return validateRequiredText(nextValues.company, "Company");
      case "email":
        return validateEmail(nextValues.email);
      case "telephone":
        return validatePhone(nextValues.telephone);
      case "eventVenue":
        return validateOptionalText(nextValues.eventVenue, "Event / Venue");
      case "eventDate":
        return validateEventDate(nextValues.eventDate, minDate);
      case "location":
        return validateOptionalText(nextValues.location, "Location");
      case "attendance":
        return validateAttendance(nextValues.attendance);
      case "goal":
        return validateOptionalText(
          nextValues.goal,
          "What you are trying to achieve",
          5,
        );
      case "message":
        return validateRequiredText(nextValues.message, "Message", 5);
      default:
        return null;
    }
  }

  function validateField(field: FieldName, override?: string) {
    const nextValues =
      override === undefined
        ? values
        : { ...values, [field]: override };
    setFieldError(field, messageFor(field, nextValues));
  }

  function validateAll(): boolean {
    const next = toFieldErrors({
      name: messageFor("name"),
      company: messageFor("company"),
      email: messageFor("email"),
      telephone: messageFor("telephone"),
      eventVenue: messageFor("eventVenue"),
      eventDate: messageFor("eventDate"),
      location: messageFor("location"),
      attendance: messageFor("attendance"),
      goal: messageFor("goal"),
      message: messageFor("message"),
    });
    setErrors(next);
    setTouched({
      name: true,
      company: true,
      email: true,
      telephone: true,
      eventVenue: true,
      eventDate: true,
      location: true,
      attendance: true,
      goal: true,
      message: true,
    });
    return Object.keys(next).length === 0;
  }

  function onChange(field: FieldName, value: string) {
    setField(field, value);
    if (touched[field] || errors[field]) {
      validateField(field, value);
    }
  }

  function onBlur(field: FieldName) {
    markTouched(field);
    validateField(field);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateAll()) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      await submitContact({
        name: values.name.trim(),
        company: values.company.trim(),
        email: values.email.trim(),
        telephone: values.telephone.trim() || undefined,
        eventVenue: values.eventVenue.trim() || undefined,
        eventDate: values.eventDate || undefined,
        location: values.location.trim() || undefined,
        attendance: values.attendance
          ? Number(values.attendance)
          : undefined,
        goal: values.goal.trim() || undefined,
        message: values.message.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Failed to submit. Please try again.",
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
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-xs uppercase tracking-[0.16em] text-ff-gold">
          Name
          <input
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => onChange("name", e.target.value)}
            onBlur={() => onBlur("name")}
            maxLength={120}
            aria-invalid={Boolean(errors.name)}
            className={fieldClass(errors.name)}
          />
          <FieldErrorMessage error={errors.name} />
        </label>

        <label className="block text-xs uppercase tracking-[0.16em] text-ff-gold">
          Company
          <input
            name="company"
            type="text"
            autoComplete="organization"
            value={values.company}
            onChange={(e) => onChange("company", e.target.value)}
            onBlur={() => onBlur("company")}
            maxLength={160}
            aria-invalid={Boolean(errors.company)}
            className={fieldClass(errors.company)}
          />
          <FieldErrorMessage error={errors.company} />
        </label>

        <label className="block text-xs uppercase tracking-[0.16em] text-ff-gold">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => onChange("email", e.target.value)}
            onBlur={() => onBlur("email")}
            aria-invalid={Boolean(errors.email)}
            className={fieldClass(errors.email)}
          />
          <FieldErrorMessage error={errors.email} />
        </label>

        <label className="block text-xs uppercase tracking-[0.16em] text-ff-gold">
          Telephone
          <input
            name="telephone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.telephone}
            onChange={(e) =>
              onChange("telephone", e.target.value.replace(/[^\d+\s()-]/g, ""))
            }
            onBlur={() => onBlur("telephone")}
            maxLength={40}
            aria-invalid={Boolean(errors.telephone)}
            className={fieldClass(errors.telephone)}
          />
          <FieldErrorMessage error={errors.telephone} />
        </label>

        <label className="block text-xs uppercase tracking-[0.16em] text-ff-gold">
          Event / Venue
          <input
            name="eventVenue"
            type="text"
            value={values.eventVenue}
            onChange={(e) => onChange("eventVenue", e.target.value)}
            onBlur={() => onBlur("eventVenue")}
            maxLength={200}
            aria-invalid={Boolean(errors.eventVenue)}
            className={fieldClass(errors.eventVenue)}
          />
          <FieldErrorMessage error={errors.eventVenue} />
        </label>

        <label className="block text-xs uppercase tracking-[0.16em] text-ff-gold">
          Event Date
          <input
            name="eventDate"
            type="date"
            min={minDate}
            value={values.eventDate}
            onChange={(e) => onChange("eventDate", e.target.value)}
            onBlur={() => onBlur("eventDate")}
            aria-invalid={Boolean(errors.eventDate)}
            className={fieldClass(errors.eventDate)}
          />
          <FieldErrorMessage error={errors.eventDate} />
        </label>

        <label className="block text-xs uppercase tracking-[0.16em] text-ff-gold">
          Location
          <input
            name="location"
            type="text"
            value={values.location}
            onChange={(e) => onChange("location", e.target.value)}
            onBlur={() => onBlur("location")}
            maxLength={200}
            aria-invalid={Boolean(errors.location)}
            className={fieldClass(errors.location)}
          />
          <FieldErrorMessage error={errors.location} />
        </label>

        <label className="block text-xs uppercase tracking-[0.16em] text-ff-gold">
          Expected Attendance
          <input
            name="attendance"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={values.attendance}
            onChange={(e) =>
              onChange("attendance", e.target.value.replace(/\D/g, ""))
            }
            onBlur={() => onBlur("attendance")}
            aria-invalid={Boolean(errors.attendance)}
            className={fieldClass(errors.attendance)}
          />
          <FieldErrorMessage error={errors.attendance} />
        </label>
      </div>

      <label className="block text-xs uppercase tracking-[0.16em] text-ff-gold">
        What Are You Trying to Achieve?
        <textarea
          name="goal"
          rows={3}
          value={values.goal}
          onChange={(e) => onChange("goal", e.target.value)}
          onBlur={() => onBlur("goal")}
          aria-invalid={Boolean(errors.goal)}
          className={fieldClass(errors.goal)}
        />
        <FieldErrorMessage error={errors.goal} />
      </label>

      <label className="block text-xs uppercase tracking-[0.16em] text-ff-gold">
        Message
        <textarea
          name="message"
          rows={5}
          value={values.message}
          onChange={(e) => onChange("message", e.target.value)}
          onBlur={() => onBlur("message")}
          aria-invalid={Boolean(errors.message)}
          className={fieldClass(errors.message)}
        />
        <FieldErrorMessage error={errors.message} />
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
