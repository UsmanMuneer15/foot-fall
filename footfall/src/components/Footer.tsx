"use client";

import { usePathname } from "next/navigation";
import { companyContact } from "@/lib/content";

const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];

export function Footer() {
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isAuthRoute) return null;

  return (
    <footer className="border-t border-ff-gold/20 bg-ff-green-deep">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-white/90">
          Trusted by brands <span className="text-ff-gold/70">|</span> Chosen by
          events <span className="text-ff-gold/70">|</span> Built for people
        </p>
        <div className="flex flex-col items-start gap-2 lg:items-end">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ff-gold">
            Experiences today. Stronger connections tomorrow.
          </p>
          <span className="h-px w-40 bg-ff-gold/60" />
        </div>
      </div>
      <div className="border-t border-ff-gold/10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-3 px-4 py-5 text-center sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-white/80">
            <a
              href={companyContact.emailHref}
              className="transition hover:text-ff-gold"
            >
              {companyContact.email}
            </a>
            <span className="hidden text-ff-gold/50 sm:inline" aria-hidden>
              |
            </span>
            <a
              href={companyContact.phoneHref}
              className="transition hover:text-ff-gold"
            >
              {companyContact.phone}
            </a>
            <span className="hidden text-ff-gold/50 sm:inline" aria-hidden>
              |
            </span>
            <span>{companyContact.poBox}</span>
            <span className="hidden text-ff-gold/50 sm:inline" aria-hidden>
              |
            </span>
            <a
              href={companyContact.websiteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-ff-gold"
            >
              {companyContact.website}
            </a>
          </div>
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.14em] text-white/80">
            © {new Date().getFullYear()} FOOTFALL GLOBAL LLC
          </p>
        </div>
      </div>
    </footer>
  );
}
