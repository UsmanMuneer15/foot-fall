"use client";

import { FormEvent, useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthDivider,
  AuthLink,
  AuthShell,
  AuthTextField,
  GoogleSignInButton,
  PasswordField,
} from "@/components/AuthForm";
import { login } from "@/lib/api";
import type { AuthResult } from "@/lib/api";
import { setSession } from "@/lib/auth";
import { toast } from "@/lib/toast";
import {
  summarizeFieldErrors,
  toFieldErrors,
  validateEmail,
  validateLoginPassword,
} from "@/lib/validation";

type FieldErrors = {
  email?: string;
  password?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<keyof FieldErrors, boolean>>({
    email: false,
    password: false,
  });
  const submittingRef = useRef(false);

  const completeAuth = useCallback(
    (data: AuthResult, source: "password" | "google") => {
      setSession(data.token, data.user);
      toast.success(
        source === "google"
          ? `Signed in with Google. Welcome, ${data.user.name}!`
          : `Welcome back, ${data.user.name}!`,
      );
      router.replace("/");
    },
    [router],
  );

  const onGoogleSuccess = useCallback(
    (data: AuthResult) => completeAuth(data, "google"),
    [completeAuth],
  );

  const onGoogleError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  function setFieldError(field: keyof FieldErrors, message: string | null) {
    setErrors((prev) => {
      const next = { ...prev };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  }

  function validateField(field: keyof FieldErrors, value?: string) {
    if (field === "email") {
      const message = validateEmail(value ?? email);
      setFieldError("email", message);
      return message;
    }
    const message = validateLoginPassword(value ?? password);
    setFieldError("password", message);
    return message;
  }

  function validateAll(): boolean {
    const next = toFieldErrors({
      email: validateEmail(email),
      password: validateLoginPassword(password),
    });
    setErrors(next);
    setTouched({ email: true, password: true });
    const summary = summarizeFieldErrors(next);
    if (summary) {
      toast.error(summary);
      return false;
    }
    return true;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submittingRef.current) return;
    if (!validateAll()) return;

    submittingRef.current = true;
    setLoading(true);
    try {
      const data = await login(email.trim(), password);
      completeAuth(data, "password");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Invalid email or password.";
      // Highlight both fields, but show the message only in the toast.
      setErrors({
        email: message,
        password: message,
      });
      toast.error(message);
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  }

  return (
    <AuthShell
      eyebrow="Member Access"
      title="Sign in"
      description="Sign in to your FootFall account to continue."
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <AuthTextField
          label="Email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(value) => {
            setEmail(value);
            if (touched.email || errors.email) validateField("email", value);
          }}
          onBlur={() => {
            setTouched((prev) => ({ ...prev, email: true }));
            validateField("email");
          }}
          error={errors.email}
        />

        <PasswordField
          label="Password"
          value={password}
          onChange={(value) => {
            setPassword(value);
            if (touched.password || errors.password) {
              validateField("password", value);
            }
          }}
          onBlur={() => {
            setTouched((prev) => ({ ...prev, password: true }));
            validateField("password");
          }}
          autoComplete="current-password"
          error={errors.password}
        />

        <div className="flex justify-end">
          <AuthLink href="/forgot-password">Forgot password?</AuthLink>
        </div>

        <button
          type="submit"
          className="btn-gold w-full min-h-[3.1rem]"
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="mt-5 space-y-5">
        <AuthDivider />
        <GoogleSignInButton
          label="Sign in with Google"
          onSuccess={onGoogleSuccess}
          onError={onGoogleError}
        />
        <p className="text-center text-sm text-white/65">
          Don&apos;t have an account?{" "}
          <AuthLink href="/signup">Sign up</AuthLink>
        </p>
      </div>
    </AuthShell>
  );
}
