"use client";

import { FormEvent, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthDivider,
  AuthLink,
  AuthShell,
  AuthTextField,
  GoogleSignInButton,
  PasswordField,
} from "@/components/AuthForm";
import { signup } from "@/lib/api";
import type { AuthResult } from "@/lib/api";
import { setSession } from "@/lib/auth";
import { toast } from "@/lib/toast";
import {
  summarizeFieldErrors,
  toFieldErrors,
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
} from "@/lib/validation";

type FieldKey = "name" | "email" | "phone" | "password" | "confirmPassword";
type FieldErrors = Partial<Record<FieldKey, string>>;

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    name: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
  });

  const completeAuth = useCallback(
    (data: AuthResult, source: "password" | "google") => {
      setSession(data.token, data.user);
      toast.success(
        source === "google"
          ? `Signed up with Google. Welcome, ${data.user.name}!`
          : `Account created successfully. Welcome, ${data.user.name}!`,
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

  function validateField(
    field: FieldKey,
    overrides?: Partial<Record<FieldKey, string>>,
  ) {
    const values = {
      name,
      email,
      phone,
      password,
      confirmPassword,
      ...overrides,
    };

    switch (field) {
      case "name":
        setFieldError("name", validateName(values.name));
        break;
      case "email":
        setFieldError("email", validateEmail(values.email));
        break;
      case "phone":
        setFieldError("phone", validatePhone(values.phone));
        break;
      case "password":
        setFieldError("password", validatePassword(values.password));
        if (
          touched.confirmPassword ||
          errors.confirmPassword ||
          values.confirmPassword
        ) {
          setFieldError(
            "confirmPassword",
            validateConfirmPassword(values.password, values.confirmPassword),
          );
        }
        break;
      case "confirmPassword":
        setFieldError(
          "confirmPassword",
          validateConfirmPassword(values.password, values.confirmPassword),
        );
        break;
    }
  }

  function validateAll(): boolean {
    const next = toFieldErrors({
      name: validateName(name),
      email: validateEmail(email),
      phone: validatePhone(phone),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    });
    setErrors(next);
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });
    const summary = summarizeFieldErrors(next);
    if (summary) {
      toast.error(summary);
      return false;
    }
    return true;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    if (!validateAll()) return;

    setLoading(true);
    try {
      const data = await signup({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
        confirmPassword,
      });
      completeAuth(data, "password");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Signup failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Create Account"
      title="Sign up"
      description="Create your FootFall account to get started."
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <AuthTextField
          label="Name"
          autoComplete="name"
          value={name}
          onChange={(value) => {
            setName(value);
            if (touched.name || errors.name) {
              validateField("name", { name: value });
            }
          }}
          onBlur={() => {
            markTouched("name");
            validateField("name");
          }}
          maxLength={120}
          error={errors.name}
        />

        <AuthTextField
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(value) => {
            setEmail(value);
            if (touched.email || errors.email) {
              validateField("email", { email: value });
            }
          }}
          onBlur={() => {
            markTouched("email");
            validateField("email");
          }}
          error={errors.email}
        />

        <AuthTextField
          label="Phone Number"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(value) => {
            setPhone(value);
            if (touched.phone || errors.phone) {
              validateField("phone", { phone: value });
            }
          }}
          onBlur={() => {
            markTouched("phone");
            validateField("phone");
          }}
          maxLength={40}
          optional
          error={errors.phone}
        />

        <PasswordField
          label="Password"
          value={password}
          onChange={(value) => {
            setPassword(value);
            if (touched.password || errors.password || touched.confirmPassword) {
              validateField("password", { password: value });
            }
          }}
          onBlur={() => {
            markTouched("password");
            validateField("password");
          }}
          autoComplete="new-password"
          error={errors.password}
        />

        <PasswordField
          label="Confirm Password"
          value={confirmPassword}
          onChange={(value) => {
            setConfirmPassword(value);
            if (touched.confirmPassword || errors.confirmPassword) {
              validateField("confirmPassword", { confirmPassword: value });
            }
          }}
          onBlur={() => {
            markTouched("confirmPassword");
            validateField("confirmPassword");
          }}
          autoComplete="new-password"
          error={errors.confirmPassword}
        />

        <button
          type="submit"
          className="btn-gold w-full min-h-[3.1rem]"
          disabled={loading}
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <div className="mt-5 space-y-5">
        <AuthDivider />
        <GoogleSignInButton
          label="Sign up with Google"
          onSuccess={onGoogleSuccess}
          onError={onGoogleError}
        />
        <p className="text-center text-sm text-white/65">
          Already have an account? <AuthLink href="/login">Sign in</AuthLink>
        </p>
      </div>
    </AuthShell>
  );
}
