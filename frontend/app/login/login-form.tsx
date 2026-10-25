"use client";

import { useActionState, useState } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FormAlert } from "@/components/form-field";
import { initialActionState, type FieldErrors } from "@/lib/action-state";
import { loginAction } from "@/lib/actions/auth";
import { loginFieldSchemas } from "@/lib/validation";
import { cn } from "@/lib/utils";

type Values = {
  email: string;
  password: string;
};

const emptyValues: Values = { email: "", password: "" };

export function LoginForm() {
  const [values, setValues] = useState<Values>(emptyValues);
  const [touched, setTouched] = useState<Record<keyof Values, boolean>>({
    email: false,
    password: false,
  });
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(loginAction, initialActionState);

  const validateField = (name: keyof Values, value: string) => {
    const result = loginFieldSchemas[name].safeParse(value);
    setClientErrors((current) => ({
      ...current,
      [name]: result.success ? undefined : [result.error.issues[0].message],
    }));
  };

  const handleChange = (name: keyof Values, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (name: keyof Values) => {
    setTouched((current) => ({ ...current, [name]: true }));
    validateField(name, values[name]);
  };

  const emailError = clientErrors.email?.[0] ?? state.fields?.email?.[0];
  const passwordError = clientErrors.password?.[0] ?? state.fields?.password?.[0];

  return (
    <form action={formAction} noValidate className="space-y-5">
      <FormAlert message={state.formError} />

      <Field label="Email address" htmlFor="email" error={emailError}>
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={(event) => handleChange("email", event.target.value)}
            onBlur={() => handleBlur("email")}
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? "email-error" : undefined}
            className={cn(
              "h-11 rounded-xl border-input bg-card pr-3.5 pl-10 text-sm shadow-sm",
              emailError && "border-danger/50",
            )}
          />
        </div>
      </Field>

      <Field label="Password" htmlFor="password" error={passwordError}>
        <div className="relative">
          <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={values.password}
            onChange={(event) => handleChange("password", event.target.value)}
            onBlur={() => handleBlur("password")}
            aria-invalid={Boolean(passwordError)}
            aria-describedby={passwordError ? "password-error" : undefined}
            className={cn(
              "h-11 rounded-xl border-input bg-card pr-11 pl-10 text-sm shadow-sm",
              passwordError && "border-danger/50",
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-ink"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </Field>

      <Button
        type="submit"
        disabled={isPending}
        className="h-11 w-full rounded-xl px-4 text-sm font-semibold shadow-sm"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Signing in…
          </>
        ) : (
          <>
            Sign in
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>

      <p className="text-center text-xs leading-5 text-muted-foreground">
        Your session is stored in an httpOnly cookie and expires after one day.
      </p>
    </form>
  );
}
