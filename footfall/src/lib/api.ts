import type { ServiceFeeRates, ServiceScope } from "@/lib/products";
import { serviceFees } from "@/lib/products";
import { authHeaders, type AuthUser } from "@/lib/auth";

/** FootFall API root — must include /api/footfall */
const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://egc-appointment-apis-d4715c28cb17.herokuapp.com/api/footfall"
).replace(/\/$/, "");

type ApiFees = {
  scope: ServiceScope;
  transportPerDay: number;
  laborPerDay: number;
  setupFlat: number;
  crewPerDay: number;
  cargoFlat: number;
  customsHandlingFlat: number;
};

export type ContactPayload = {
  name: string;
  company: string;
  email: string;
  telephone?: string;
  eventVenue?: string;
  eventDate?: string;
  location?: string;
  attendance?: number;
  goal?: string;
  message: string;
};

export type AuthResult = {
  token: string;
  user: AuthUser;
};

export type SignupInput = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
};

async function parseError(res: Response, fallback: string) {
  const err = await res.json().catch(() => null);
  return (err?.error as string) || fallback;
}

export async function submitContact(
  payload: ContactPayload,
): Promise<void> {
  const res = await fetch(`${API_BASE}/contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(
      (err?.error as string) || "Failed to submit contact form.",
    );
  }
}

export async function fetchServiceFeeRates(
  scope: ServiceScope,
): Promise<ServiceFeeRates> {
  try {
    const res = await fetch(`${API_BASE}/service-fees/${scope}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("API error");
    const json = (await res.json()) as { data: ApiFees };
    return {
      transportPerDay: json.data.transportPerDay,
      laborPerDay: json.data.laborPerDay,
      setupFlat: json.data.setupFlat,
      crewPerDay: json.data.crewPerDay,
      cargoFlat: json.data.cargoFlat,
      customsHandlingFlat: json.data.customsHandlingFlat,
    };
  } catch {
    const fallback = serviceFees[scope];
    return {
      transportPerDay: fallback.transportPerDay,
      laborPerDay: fallback.laborPerDay,
      setupFlat: fallback.setupFlat,
      crewPerDay: fallback.crewPerDay,
      cargoFlat: fallback.cargoFlat,
      customsHandlingFlat: fallback.customsHandlingFlat,
    };
  }
}

export async function signup(input: SignupInput): Promise<AuthResult> {
  const res = await fetch(`${API_BASE}/user-auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(await parseError(res, "Signup failed."));
  }
  const json = (await res.json()) as { data: AuthResult };
  return json.data;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResult> {
  const res = await fetch(`${API_BASE}/user-auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error(await parseError(res, "Login failed."));
  }
  const json = (await res.json()) as { data: AuthResult };
  return json.data;
}

export async function loginWithGoogle(idToken: string): Promise<AuthResult> {
  const res = await fetch(`${API_BASE}/user-auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) {
    throw new Error(await parseError(res, "Google sign-in failed."));
  }
  const json = (await res.json()) as { data: AuthResult };
  return json.data;
}

export async function requestPasswordReset(email: string): Promise<{
  message: string;
  otp?: string;
}> {
  const res = await fetch(`${API_BASE}/user-auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    throw new Error(await parseError(res, "Failed to send reset code."));
  }
  const json = (await res.json()) as {
    data?: { otp?: string; message?: string };
    message?: string;
  };
  return {
    message:
      json.message ||
      json.data?.message ||
      "If an account exists for that email, a reset code has been sent.",
    otp: json.data?.otp,
  };
}

export async function verifyResetOtp(
  email: string,
  otp: string,
): Promise<void> {
  const res = await fetch(`${API_BASE}/user-auth/verify-reset-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  if (!res.ok) {
    throw new Error(await parseError(res, "Invalid or expired reset code."));
  }
}

export async function resetPassword(input: {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}): Promise<string> {
  const res = await fetch(`${API_BASE}/user-auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(await parseError(res, "Failed to reset password."));
  }
  const json = (await res.json()) as {
    data?: { message?: string; reset?: boolean };
    message?: string;
  };
  return json.message || json.data?.message || "Password updated.";
}

export type BookingSubmitInput = {
  scope: ServiceScope;
  eventType: string;
  productId: string;
  productName: string;
  startDate: string;
  endDate: string;
  days: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  addressLine: string;
  area: string;
  emirate: string;
  poBox?: string;
  latitude?: number | null;
  longitude?: number | null;
  notes?: string;
  rental: number;
  transport: number;
  labor: number;
  setup: number;
  crew: number;
  cargo: number;
  customs: number;
  subtotal: number;
  tax: number;
  total: number;
};

export type BookingSubmitResult = {
  id: number;
  bookingCode: string;
  status: string;
};

export async function submitBooking(
  input: BookingSubmitInput,
): Promise<BookingSubmitResult> {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(await parseError(res, "Failed to submit booking."));
  }
  const json = (await res.json()) as { data: BookingSubmitResult };
  return json.data;
}

export type BookingBlockedRange = {
  startDate: string;
  endDate: string;
  status: string;
  bookingCode: string;
};

export async function fetchProductAvailability(
  productId: string,
  from?: string,
): Promise<BookingBlockedRange[]> {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  const qs = params.toString();
  const res = await fetch(
    `${API_BASE}/bookings/availability/${encodeURIComponent(productId)}${qs ? `?${qs}` : ""}`,
    { cache: "no-store" },
  );
  if (!res.ok) {
    throw new Error(await parseError(res, "Failed to load availability."));
  }
  const json = (await res.json()) as {
    data: { blockedRanges: BookingBlockedRange[] };
  };
  return json.data.blockedRanges || [];
}
