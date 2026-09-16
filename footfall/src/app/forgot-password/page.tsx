"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthLink,
  AuthShell,
  AuthTextField,
  PasswordField,
} from "@/components/AuthForm";
import {
  requestPasswordReset,
  resetPassword,
  verifyResetOtp,
} from "@/lib/api";
import { toast } from "@/lib/toast";
import {
  summarizeFieldErrors,
  toFieldErrors,
  validateConfirmPassword,
  validateEmail,
  validateOtp,
  validatePassword,
} from "@/lib/validation";

type Step = "email" | "otp" | "password";
type FieldKey = "email" | "otp" | "password" | "confirmPassword";
type FieldErrors = Partial<Record<FieldKey, string>>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    email: false,
    otp: false,
    password: false,
    confirmPassword: false,
  });

  function setFieldError(field: FieldKey, message: string | null) {
    setErrors((prev) => {
      const next = { ...prev };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  }

  function markTouched(field: FieldKey) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  async function onRequestCode(e: FormEvent) {
    e.preventDefault();
    const next = toFieldErrors({ email: validateEmail(email) });
    setErrors(next);
    markTouched("email");
    const summary = summarizeFieldErrors(next);
    if (summary) {
      toast.error(summary);
      return;
    }

    setLoading(true);
    try {
      const result = await requestPasswordReset(email.trim());
      toast.success(
        result.otp
          ? `Reset code sent. Dev OTP: ${result.otp}`
          : "If that email is registered, a reset code has been sent.",
      );
      setStep("otp");
      setErrors({});
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to send reset code.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function onVerifyOtp(e: FormEvent) {
    e.preventDefault();
    const next = toFieldErrors({ otp: validateOtp(otp) });
    setErrors(next);
    markTouched("otp");
    const summary = summarizeFieldErrors(next);
    if (summary) {
      toast.error(summary);
      return;
    }

    setLoading(true);
    try {
      await verifyResetOtp(email.trim(), otp.trim());
      toast.success("Code verified. Choose a new password.");
      setStep("password");
      setErrors({});
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Invalid or expired reset code.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function onResetPassword(e: FormEvent) {
    e.preventDefault();
    const next = toFieldErrors({
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    });
    setErrors(next);
    setTouched((prev) => ({
      ...prev,
      password: true,
      confirmPassword: true,
    }));
    const summary = summarizeFieldErrors(next);
    if (summary) {
      toast.error(summary);
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        password,
        confirmPassword,
      });
      toast.success("Password updated successfully. You can sign in now.");
      setTimeout(() => router.replace("/login"), 900);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to reset password.",
      );
    } finally {
      setLoading(false);
    }
  }

  const descriptions: Record<Step, string> = {
    email: "Enter your registered email and we’ll send a reset code.",
    otp: "Enter the 6-digit OTP sent for your account.",
    password: "Set a new password for your account.",
  };

  return (
    <AuthShell
      eyebrow="Account Recovery"
      title="Forgot password"
      description={descriptions[step]}
    >
      {step === "email" ? (
        <form onSubmit={onRequestCode} className="space-y-5" noValidate>
          <AuthTextField
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(value) => {
              setEmail(value);
              if (touched.email || errors.email) {
                setFieldError("email", validateEmail(value));
              }
            }}
            onBlur={() => {
              markTouched("email");
              setFieldError("email", validateEmail(email));
            }}
            error={errors.email}
          />

          <button type="submit" className="btn-gold w-full" disabled={loading}>
            {loading ? "Sending…" : "Send reset code"}
          </button>
        </form>
      ) : null}

      {step === "otp" ? (
        <form onSubmit={onVerifyOtp} className="space-y-5" noValidate>
          <AuthTextField
            label="Reset code (OTP)"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={otp}
            onChange={(value) => {
              const next = value.replace(/\D/g, "").slice(0, 6);
              setOtp(next);
              if (touched.otp || errors.otp) {
                setFieldError("otp", validateOtp(next));
              }
            }}
            onBlur={() => {
              markTouched("otp");
              setFieldError("otp", validateOtp(otp));
            }}
            maxLength={6}
            error={errors.otp}
          />

          <button type="submit" className="btn-gold w-full" disabled={loading}>
            {loading ? "Verifying…" : "Verify code"}
          </button>

          <button
            type="button"
            className="w-full text-sm text-white/60 transition hover:text-ff-gold"
            onClick={() => {
              setStep("email");
              setOtp("");
              setErrors({});
              setTouched((prev) => ({
                ...prev,
                otp: false,
                password: false,
                confirmPassword: false,
              }));
            }}
          >
            Use a different email
          </button>
        </form>
      ) : null}

      {step === "password" ? (
        <form onSubmit={onResetPassword} className="space-y-5" noValidate>
          <PasswordField
            label="New password"
            value={password}
            onChange={(value) => {
              setPassword(value);
              if (touched.password || errors.password) {
                setFieldError("password", validatePassword(value));
              }
              if (touched.confirmPassword || errors.confirmPassword) {
                setFieldError(
                  "confirmPassword",
                  validateConfirmPassword(value, confirmPassword),
                );
              }
            }}
            onBlur={() => {
              markTouched("password");
              setFieldError("password", validatePassword(password));
            }}
            autoComplete="new-password"
            error={errors.password}
          />

          <PasswordField
            label="Confirm new password"
            value={confirmPassword}
            onChange={(value) => {
              setConfirmPassword(value);
              if (touched.confirmPassword || errors.confirmPassword) {
                setFieldError(
                  "confirmPassword",
                  validateConfirmPassword(password, value),
                );
              }
            }}
            onBlur={() => {
              markTouched("confirmPassword");
              setFieldError(
                "confirmPassword",
                validateConfirmPassword(password, confirmPassword),
              );
            }}
            autoComplete="new-password"
            error={errors.confirmPassword}
          />

          <button type="submit" className="btn-gold w-full" disabled={loading}>
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      ) : null}

      <p className="mt-6 text-center text-sm text-white/65">
        Remembered your password? <AuthLink href="/login">Sign in</AuthLink>
      </p>
    </AuthShell>
  );
}
