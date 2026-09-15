"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ActivationsMenu } from "@/components/ActivationsMenu";
import { Logo } from "@/components/Logo";
import { navLinks } from "@/lib/content";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] transition-colors duration-300 ${
        scrolled || open
          ? "bg-ff-green-deep/95 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3.5 sm:gap-5 sm:px-8 sm:py-4 lg:gap-6 lg:px-10 xl:gap-8 xl:px-12">
        <Logo className="shrink-0" />

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-5 lg:flex xl:gap-7"
          aria-label="Primary"
        >
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                data-active={active}
                className={`nav-link whitespace-nowrap text-[0.6rem] font-medium uppercase tracking-[0.12em] transition-colors xl:text-[0.68rem] xl:tracking-[0.18em] ${
                  active
                    ? "text-ff-gold"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden shrink-0 lg:block">
            <ActivationsMenu variant="desktop" />
          </div>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ff-gold/60 text-ff-gold sm:h-10 sm:w-10 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Menu</span>
            <span className="relative block h-3.5 w-4">
              <span
                className={`absolute left-0 block h-px w-full bg-ff-gold transition-all ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-px w-full bg-ff-gold transition-opacity ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-full bg-ff-gold transition-all ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`border-t border-ff-gold/15 bg-ff-green-deep lg:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <nav
          className="mx-auto flex max-h-[calc(100svh-5.5rem)] max-w-7xl flex-col gap-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6"
          aria-label="Mobile"
        >
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-2 py-3 text-sm uppercase tracking-[0.2em] ${
                  active ? "text-ff-gold" : "text-white hover:text-ff-gold"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <ActivationsMenu
            variant="mobile"
            onNavigate={() => setOpen(false)}
          />
        </nav>
      </div>
    </header>
  );
}
