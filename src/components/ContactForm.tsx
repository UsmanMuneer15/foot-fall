"use client";

import { FormEvent, useState } from "react";

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

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="border border-ff-gold/40 bg-ff-green p-8 text-center">
        <h2 className="font-display text-3xl text-ff-gold">
          Thank you
        </h2>
        <p className="mt-4 text-sm text-ff-off-white/85">
          Your activation brief has been received. The FOOTFALL team will be in
          touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => (
          <label
            key={field.name}
            className="block text-xs uppercase tracking-[0.16em] text-ff-gold"
          >
            {field.label}
            <input
              name={field.name}
              type={field.type}
              required={field.required}
              className="mt-2 w-full border border-ff-gold/30 bg-ff-green/40 px-4 py-3 text-sm normal-case tracking-normal text-ff-off-white outline-none transition focus:border-ff-gold"
            />
          </label>
        ))}
      </div>

      <label className="block text-xs uppercase tracking-[0.16em] text-ff-gold">
        What Are You Trying to Achieve?
        <textarea
          name="goal"
          rows={3}
          className="mt-2 w-full border border-ff-gold/30 bg-ff-green/40 px-4 py-3 text-sm normal-case tracking-normal text-ff-off-white outline-none transition focus:border-ff-gold"
        />
      </label>

      <label className="block text-xs uppercase tracking-[0.16em] text-ff-gold">
        Message
        <textarea
          name="message"
          rows={5}
          required
          className="mt-2 w-full border border-ff-gold/30 bg-ff-green/40 px-4 py-3 text-sm normal-case tracking-normal text-ff-off-white outline-none transition focus:border-ff-gold"
        />
      </label>

      <button type="submit" className="btn-gold">
        Create My Activation
      </button>
    </form>
  );
}
