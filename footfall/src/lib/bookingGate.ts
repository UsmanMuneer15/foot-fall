import { getUser } from "@/lib/auth";

/** Returns true if the user may open BookingModal; otherwise redirects to /login silently. */
export function requireAuthForBooking(router: {
  push: (href: string) => void;
}): boolean {
  if (getUser()) return true;
  router.push("/login");
  return false;
}
