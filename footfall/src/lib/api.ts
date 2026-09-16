import type { ServiceFeeRates, ServiceScope } from "@/lib/products";
import { serviceFees } from "@/lib/products";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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

export async function submitContact(
  payload: ContactPayload,
): Promise<void> {
  const res = await fetch(`${API_URL}/api/contacts`, {
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
    const res = await fetch(`${API_URL}/api/service-fees/${scope}`, {
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
