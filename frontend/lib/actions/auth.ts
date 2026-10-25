"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api";
import type { ActionState } from "@/lib/action-state";
import { roleHome } from "@/lib/navigation";
import type { SessionUser } from "@/lib/types";
import { loginSchema, signupSchema, toFieldErrors } from "@/lib/validation";

const TOKEN_COOKIE = "token";
const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

const setSessionCookie = async (token: string) => {
  const cookieStore = await cookies();

  cookieStore.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_DAY_IN_SECONDS,
  });
};

export async function loginAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    return { ok: false, fields: toFieldErrors(parsed.error) };
  }

  let result: { user: SessionUser; token: string };

  try {
    result = await apiFetch<{ user: SessionUser; token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(parsed.data),
      redirectOn401: false,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, formError: error.message };
    }
    throw error;
  }

  await setSessionCookie(result.token);
  redirect(roleHome(result.user.role));
}

export async function signupAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signupSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    return { ok: false, fields: toFieldErrors(parsed.error) };
  }

  let result: { user: SessionUser; token: string };

  try {
    result = await apiFetch<{ user: SessionUser; token: string }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(parsed.data),
      redirectOn401: false,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.code === "EMAIL_TAKEN") {
        return {
          ok: false,
          fields: { email: [error.message] },
        };
      }
      return { ok: false, formError: error.message, fields: error.fields };
    }
    throw error;
  }

  await setSessionCookie(result.token);
  redirect(roleHome(result.user.role));
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE);
  redirect("/login");
}
