import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { FieldErrors } from "@/lib/action-state";

const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("Missing BACKEND_URL. Add it to frontend/.env.local");
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fields?: FieldErrors;

  constructor(status: number, code: string, message: string, fields?: FieldErrors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

type ApiFetchOptions = RequestInit & {
  redirectOn401?: boolean;
};

export async function apiFetch<T>(
  path: string,
  { redirectOn401 = true, headers, ...options }: ApiFetchOptions = {},
): Promise<T> {
  const token = (await cookies()).get("token")?.value;

  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    cache: options.cache ?? "no-store",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: { code?: string; message?: string; fields?: FieldErrors } }
      | null;

    if (response.status === 401 && redirectOn401) {
      redirect("/login");
    }

    if (response.status === 403) {
      redirect("/");
    }

    throw new ApiError(
      response.status,
      payload?.error?.code ?? "REQUEST_FAILED",
      payload?.error?.message ?? "Something went wrong. Please try again.",
      payload?.error?.fields,
    );
  }

  return (await response.json()) as T;
}
