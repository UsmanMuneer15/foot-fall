const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;
const OTP_RE = /^\d{6}$/;

export function validateName(value: string): string | null {
  const name = value.trim();
  if (!name) return "Please enter your name.";
  if (name.length < 2) return "Name must be at least 2 characters.";
  if (name.length > 120) return "Name must be 120 characters or fewer.";
  return null;
}

export function validateEmail(value: string): string | null {
  const email = value.trim();
  if (!email) return "Please enter your email.";
  if (!email.includes("@")) {
    return "Email must include an @ symbol (e.g. name@example.com).";
  }
  if (!EMAIL_RE.test(email)) {
    return "Enter a valid email address (e.g. name@example.com).";
  }
  return null;
}

export function validatePhone(value: string, required = false): string | null {
  const phone = value.trim();
  if (!phone) return required ? "Please enter your phone number." : null;
  if (!PHONE_RE.test(phone) || !/\d{7,}/.test(phone)) {
    return "Enter a valid phone number (at least 7 digits).";
  }
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) return "Please enter a password.";
  if (value.length < 6) return "Password must be at least 6 characters.";
  if (value.length > 128) return "Password must be 128 characters or fewer.";
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    return "Password must include at least one letter and one number.";
  }
  return null;
}

export function validateLoginPassword(value: string): string | null {
  if (!value) return "Please enter your password.";
  if (value.length < 6) return "Password must be at least 6 characters.";
  return null;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): string | null {
  if (!confirmPassword) return "Please confirm your password.";
  if (password !== confirmPassword) return "Passwords do not match.";
  return null;
}

export function validateOtp(value: string): string | null {
  const otp = value.trim();
  if (!otp) return "Please enter the reset code.";
  if (!OTP_RE.test(otp)) return "Enter the 6-digit reset code.";
  return null;
}

export function validateRequiredText(
  value: string,
  label: string,
  minLength = 2,
): string | null {
  const trimmed = value.trim();
  if (!trimmed) return `Please enter your ${label.toLowerCase()}.`;
  if (trimmed.length < minLength) {
    return `${label} must be at least ${minLength} characters.`;
  }
  return null;
}

/** Optional text: empty is OK; if filled, enforce a minimum length. */
export function validateOptionalText(
  value: string,
  label: string,
  minLength = 2,
): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length < minLength) {
    return `${label} must be at least ${minLength} characters.`;
  }
  return null;
}

export function validateAttendance(
  value: string,
  required = false,
): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return required ? "Please enter expected attendance." : null;
  }
  if (!/^\d+$/.test(trimmed)) {
    return "Expected attendance must be a whole number.";
  }
  const n = Number(trimmed);
  if (n < 1) return "Expected attendance must be at least 1.";
  if (n > 1_000_000) return "Expected attendance looks too high.";
  return null;
}

export function validateEventDate(
  value: string,
  minDate: string,
  required = false,
): string | null {
  if (!value) {
    return required ? "Please select an event date." : null;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return "Enter a valid event date.";
  }
  if (value < minDate) return "Event date cannot be in the past.";
  return null;
}

export const UAE_EMIRATES = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
] as const;

export type UaeEmirate = (typeof UAE_EMIRATES)[number];

export function validateEmirate(value: string): string | null {
  if (!value.trim()) return "Please select an emirate.";
  if (!(UAE_EMIRATES as readonly string[]).includes(value)) {
    return "Please select a valid UAE emirate.";
  }
  return null;
}

export function firstError(errors: Record<string, string | null | undefined>) {
  for (const value of Object.values(errors)) {
    if (value) return value;
  }
  return null;
}

export function countErrors(errors: Record<string, string | null | undefined>) {
  return Object.values(errors).filter(Boolean).length;
}

/**
 * Optional toast summary for client-side validation.
 * Prefer under-field messages as primary UX — returns null when multiple
 * fields fail so we never show a vague multi-field toast.
 */
export function summarizeFieldErrors(
  errors: Record<string, string | null | undefined>,
) {
  const messages = Object.values(errors).filter(
    (value): value is string => Boolean(value),
  );
  if (messages.length === 0) return null;
  if (messages.length === 1) return messages[0];
  return null;
}

/** Keep only defined error strings for form state. */
export function toFieldErrors<T extends Record<string, string | null>>(
  errors: T,
): { [K in keyof T]?: string } {
  const next: { [K in keyof T]?: string } = {};
  for (const key of Object.keys(errors) as (keyof T)[]) {
    const value = errors[key];
    if (value) next[key] = value;
  }
  return next;
}
