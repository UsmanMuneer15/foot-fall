"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ActivationsMenu } from "@/components/ActivationsMenu";
import { Logo } from "@/components/Logo";
import { clearSession, getUser, type AuthUser } from "@/lib/auth";
import { navLinks } from "@/lib/content";
import { toast } from "@/lib/toast";

const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];

const headerBtnClass =
  "inline-flex items-center justify-center whitespace-nowrap rounded-full border border-ff-gold/80 bg-transparent px-3.5 py-2 text-[0.55rem] font-semibold uppercase tracking-[0.1em] text-white transition hover:border-ff-gold hover:bg-ff-gold/10 xl:px-4 xl:py-2.5 xl:text-[0.58rem] xl:tracking-[0.12em]";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] || name;
}

function UserAccountMenu({
  user,
  onLogout,
}: {
  user: AuthUser;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    function onPointer(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="group inline-flex max-w-[9.5rem] items-center gap-2 whitespace-nowrap rounded-full border border-ff-gold/80 bg-transparent py-1.5 pl-1.5 pr-2.5 text-white transition hover:border-ff-gold hover:bg-ff-gold/10 xl:max-w-[11rem] xl:pr-3"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ff-gold/50 bg-ff-gold/15 text-[0.58rem] font-bold tracking-[0.08em] text-ff-gold">
          {getInitials(user.name)}
        </span>
        <span className="min-w-0 truncate text-[0.58rem] font-semibold uppercase tracking-[0.12em] xl:text-[0.6rem]">
          {getFirstName(user.name)}
        </span>
        <span
          aria-hidden
          className={`text-[0.55rem] text-ff-gold transition ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {open ? (
        <div
          id={menuId}
          className="absolute right-0 top-[calc(100%+0.6rem)] z-[130] w-56 overflow-hidden rounded-xl border border-ff-gold/35 bg-ff-green-deep shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
          role="menu"
        >
          <div className="border-b border-ff-gold/20 px-4 py-3">
            <p className="truncate text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-ff-gold">
              {user.name}
            </p>
            <p className="mt-1 truncate text-[0.68rem] text-white/55 normal-case tracking-normal">
              {user.email}
            </p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="flex w-full items-center px-4 py-3 text-left text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-ff-gold/10 hover:text-ff-gold"
          >
            Log out
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  useEffect(() => {
    setUser(getUser());
  }, [pathname]);

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

  if (isAuthRoute) return null;

  function logout() {
    clearSession();
    setUser(null);
    setOpen(false);
    toast.success("Signed out successfully.");
    router.push("/");
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] transition-colors duration-300 ${
        scrolled || open
          ? "bg-ff-green-deep/95 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-3.5 sm:gap-4 sm:px-6 sm:py-4 xl:gap-6 xl:px-10 2xl:gap-8 2xl:px-12">
        <Logo className="shrink-0" />

        {/* Full nav only on xl+ so mid widths (e.g. 1100px) use the compact menu */}
        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-4 xl:flex 2xl:gap-7"
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
                className={`nav-link whitespace-nowrap text-[0.6rem] font-medium uppercase tracking-[0.1em] transition-colors 2xl:text-[0.68rem] 2xl:tracking-[0.16em] ${
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

        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-2.5">
          <div className="hidden items-center gap-2.5 xl:flex">
            {user ? (
              <UserAccountMenu user={user} onLogout={logout} />
            ) : (
              <Link href="/login" className={headerBtnClass}>
                Sign in
              </Link>
            )}

            <ActivationsMenu variant="desktop" />
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ff-gold/60 text-ff-gold transition hover:border-ff-gold hover:bg-ff-gold/10 xl:hidden"
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
        className={`border-t border-ff-gold/15 bg-ff-green-deep xl:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <nav
          className="mx-auto flex max-h-[calc(100svh-5.5rem)] max-w-7xl flex-col gap-0.5 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6"
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

          <div className="mt-3 space-y-2 border-t border-ff-gold/15 pt-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 rounded-full border border-ff-gold/40 px-3 py-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ff-gold/50 bg-ff-gold/15 text-[0.62rem] font-bold text-ff-gold">
                    {getInitials(user.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-white">
                      {user.name}
                    </p>
                    <p className="truncate text-[0.65rem] text-white/50 normal-case tracking-normal">
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center justify-center rounded-full border border-ff-gold/80 bg-transparent px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white transition hover:border-ff-gold hover:bg-ff-gold/10"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center rounded-full border border-ff-gold/80 bg-transparent px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white transition hover:border-ff-gold hover:bg-ff-gold/10"
              >
                Sign in
              </Link>
            )}
          </div>

          <ActivationsMenu
            variant="mobile"
            onNavigate={() => setOpen(false)}
          />
        </nav>
      </div>
    </header>
  );
}
