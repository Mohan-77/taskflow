"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

type FieldName = "name" | "email" | "password" | "confirmPassword";

type FieldErrors = Partial<Record<FieldName, string>>;

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const FIELD_ORDER: FieldName[] = [
  "name",
  "email",
  "password",
  "confirmPassword",
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateFields(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};
  const trimmedName = values.name.trim();
  const trimmedEmail = values.email.trim();

  if (!trimmedName) {
    errors.name = "Full name is required.";
  }

  if (!trimmedEmail) {
    errors.email = "Email address is required.";
  } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (values.password.length > 128) {
    errors.password = "Password must be 128 characters or fewer.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

function inputClass(invalid: boolean) {
  return `w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600 ${
    invalid ? "border-red-500" : "border-gray-300"
  }`;
}

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function valuesFrom(
    overrides: Partial<FormValues> = {}
  ): FormValues {
    return {
      name,
      email,
      password,
      confirmPassword,
      ...overrides,
    };
  }

  function updateField(field: FieldName, value: string) {
    if (field === "name") setName(value);
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    if (field === "confirmPassword") setConfirmPassword(value);

    setError("");

    if (!submitted) {
      return;
    }

    setFieldErrors(validateFields(valuesFrom({ [field]: value })));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");
    setSubmitted(true);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const nextErrors = validateFields({
      name,
      email,
      password,
      confirmPassword,
    });

    setFieldErrors(nextErrors);

    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);

    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name: trimmedName,
        email: trimmedEmail,
        password,
        callbackURL: "/dashboard",
      });

      if (result.error) {
        setError(result.error.message || "Registration failed.");
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium">
          Full name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => updateField("name", event.target.value)}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
          className={inputClass(Boolean(fieldErrors.name))}
          placeholder="Your full name"
        />
        {fieldErrors.name && (
          <p id="name-error" role="alert" className="mt-2 text-sm text-red-600">
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => updateField("email", event.target.value)}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
          className={inputClass(Boolean(fieldErrors.email))}
          placeholder="you@example.com"
        />
        {fieldErrors.email && (
          <p id="email-error" role="alert" className="mt-2 text-sm text-red-600">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => updateField("password", event.target.value)}
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={
            fieldErrors.password ? "password-error" : undefined
          }
          className={inputClass(Boolean(fieldErrors.password))}
          placeholder="At least 8 characters"
        />
        {fieldErrors.password && (
          <p
            id="password-error"
            role="alert"
            className="mt-2 text-sm text-red-600"
          >
            {fieldErrors.password}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-medium"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) =>
            updateField("confirmPassword", event.target.value)
          }
          aria-invalid={Boolean(fieldErrors.confirmPassword)}
          aria-describedby={
            fieldErrors.confirmPassword ? "confirmPassword-error" : undefined
          }
          className={inputClass(Boolean(fieldErrors.confirmPassword))}
          placeholder="At least 8 characters"
        />
        {fieldErrors.confirmPassword && (
          <p
            id="confirmPassword-error"
            role="alert"
            className="mt-2 text-sm text-red-600"
          >
            {fieldErrors.confirmPassword}
          </p>
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
