"use client";

import {
  ReactNode,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { fetchGoogleAuthConfig, loginWithGoogle } from "@/lib/api";
import type { AuthResult } from "@/lib/api";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: AuthShellProps) {
  return (
    <main className="flex min-h-[calc(100svh-1px)] items-center justify-center px-4 py-16 sm:py-20">
      <div className="w-full max-w-md border border-ff-gold/30 bg-ff-green/90 p-7 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-9">
        <div className="mb-8 flex justify-center">
          <Logo href="/" className="scale-90 sm:scale-100" />
        </div>

        <div className="mb-7 text-center">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-ff-gold">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-xl font-medium uppercase tracking-[0.08em] text-ff-gold">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            {description}
          </p>
        </div>

        {children}
      </div>
    </main>
  );
}

export function AuthLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font-medium text-ff-gold transition hover:text-ff-gold-light"
    >
      {children}
    </Link>
  );
}

function EyeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={className}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
      />
      <circle cx="12" cy="12" r="2.75" />
    </svg>
  );
}

function EyeOffIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={className}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.5 3.5 20.5 20.5"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.9 5.6A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16.4 16.4 0 0 1-3.1 3.6M6.1 6.5A16 16 0 0 0 2.5 12S6 18.5 12 18.5c1.5 0 2.9-.3 4.1-.8"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.1 10.2a2.75 2.75 0 0 0 3.7 3.7"
      />
    </svg>
  );
}

export function PasswordField({
  label,
  value,
  onChange,
  onBlur,
  autoComplete,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  autoComplete: string;
  error?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <label className="block text-xs uppercase tracking-[0.16em] text-ff-gold">
      {label}
      <span className="relative mt-2 block">
        <input
          className={`w-full bg-ff-green/40 px-4 py-3 pr-12 text-sm text-white outline-none transition ${
            error
              ? "border border-red-400/70 focus:border-red-300"
              : "border border-ff-gold/30 focus:border-ff-gold"
          }`}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ff-gold/80 transition hover:text-ff-gold"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? (
            <EyeOffIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </span>
    </label>
  );
}

export function AuthTextField({
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  autoComplete,
  maxLength,
  optional,
  error,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: string;
  autoComplete?: string;
  maxLength?: number;
  optional?: boolean;
  error?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <label className="block text-xs uppercase tracking-[0.16em] text-ff-gold">
      {label}
      {optional ? (
        <span className="normal-case tracking-normal text-white/45">
          {" "}
          (optional)
        </span>
      ) : null}
      <input
        className={`mt-2 w-full bg-ff-green/40 px-4 py-3 text-sm text-white outline-none transition ${
          error
            ? "border border-red-400/70 focus:border-red-300"
            : "border border-ff-gold/30 focus:border-ff-gold"
        }`}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        maxLength={maxLength}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
      />
    </label>
  );
}

export function AuthDivider() {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="h-px flex-1 bg-ff-gold/20" />
      <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/45">
        or
      </span>
      <div className="h-px flex-1 bg-ff-gold/20" />
    </div>
  );
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            ux_mode?: "popup" | "redirect";
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: Record<string, unknown>,
          ) => void;
          cancel: () => void;
        };
      };
    };
  }
}

type GoogleSignInButtonProps = {
  label?: string;
  onSuccess: (result: AuthResult) => void;
  onError: (message: string) => void;
};

export function GoogleSignInButton({
  label = "Continue with Google",
  onSuccess,
  onError,
}: GoogleSignInButtonProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">(
    "loading",
  );
  const [busy, setBusy] = useState(false);
  const successRef = useRef(onSuccess);
  const errorRef = useRef(onError);

  useEffect(() => {
    successRef.current = onSuccess;
    errorRef.current = onError;
  }, [onSuccess, onError]);

  useEffect(() => {
    let cancelled = false;
    let scriptEl: HTMLScriptElement | null = null;

    async function setup() {
      if (initializedRef.current) return;

      const config = await fetchGoogleAuthConfig();
      if (cancelled) return;

      if (!config.enabled || !config.clientId) {
        setStatus("missing");
        return;
      }

      const startGoogle = () => {
        if (
          cancelled ||
          initializedRef.current ||
          !hostRef.current ||
          !window.google?.accounts?.id
        ) {
          return;
        }

        initializedRef.current = true;
        hostRef.current.innerHTML = "";
        window.google.accounts.id.initialize({
          client_id: config.clientId!,
          callback: async (response) => {
            if (!response.credential) {
              errorRef.current("Google did not return a credential.");
              return;
            }
            setBusy(true);
            try {
              const result = await loginWithGoogle(response.credential);
              successRef.current(result);
            } catch (err) {
              errorRef.current(
                err instanceof Error ? err.message : "Google sign-in failed.",
              );
            } finally {
              setBusy(false);
            }
          },
          ux_mode: "popup",
        });

        window.google.accounts.id.renderButton(hostRef.current, {
          theme: "outline",
          size: "large",
          shape: "rectangular",
          text: "continue_with",
          width: Math.min(hostRef.current.offsetWidth || 360, 400),
          logo_alignment: "left",
        });
        setStatus("ready");
      };

      if (window.google?.accounts?.id) {
        startGoogle();
        return;
      }

      scriptEl = document.createElement("script");
      scriptEl.src = "https://accounts.google.com/gsi/client";
      scriptEl.async = true;
      scriptEl.defer = true;
      scriptEl.onload = () => {
        if (!cancelled) startGoogle();
      };
      scriptEl.onerror = () => {
        if (!cancelled) {
          setStatus("missing");
          errorRef.current("Failed to load Google sign-in.");
        }
      };
      document.body.appendChild(scriptEl);
    }

    void setup();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-2">
      <div className="relative min-h-[44px] w-full">
        {status === "loading" ? (
          <div className="flex h-11 items-center justify-center border border-ff-gold/25 text-xs uppercase tracking-[0.14em] text-white/50">
            Loading Google…
          </div>
        ) : null}

        {status === "missing" ? (
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 border border-ff-gold/30 bg-transparent px-4 py-3 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ff-gold/70"
            onClick={() =>
              errorRef.current(
                "Add GOOGLE_CLIENT_ID to your environment variables to enable Google sign-in.",
              )
            }
          >
            <GoogleGlyph />
            {label}
          </button>
        ) : null}

        <div
          ref={hostRef}
          className={`flex w-full justify-center ${status === "ready" ? "block" : "hidden"} ${busy ? "pointer-events-none opacity-60" : ""}`}
        />
      </div>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.3-1.9 3l3.1 2.4c1.8-1.7 2.9-4.1 2.9-7 0-.7-.1-1.3-.2-1.9H12z"
      />
      <path
        fill="#34A853"
        d="M6.6 14.3l-.7.5-2.4 1.9C5.1 19.4 8.3 21.5 12 21.5c2.7 0 5-.9 6.7-2.4l-3.1-2.4c-.9.6-2 1-3.6 1-2.8 0-5.1-1.9-5.9-4.4z"
      />
      <path
        fill="#4A90E2"
        d="M3.5 7.3C2.7 8.8 2.3 10.4 2.3 12s.4 3.2 1.2 4.7l3.1-2.4c-.3-.9-.5-1.6-.5-2.3s.2-1.5.5-2.3L3.5 7.3z"
      />
      <path
        fill="#FBBC05"
        d="M12 4.8c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 1.8 14.7.8 12 .8 8.3.8 5.1 2.9 3.5 6.3l3.1 2.4C7 6.2 9.2 4.8 12 4.8z"
      />
    </svg>
  );
}
