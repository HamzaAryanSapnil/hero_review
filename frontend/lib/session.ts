import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { ApiError, apiFetch } from "@/lib/api";
import type { SessionUser } from "@/lib/types";

export const getToken = async (): Promise<string | null> => {
  return (await cookies()).get("token")?.value ?? null;
};

/**
 * React cache() dedupes this call across the same request, so a layout and a
 * page can both ask for the session without hitting Express twice.
 */
export const getSession = cache(async (): Promise<SessionUser | null> => {
  const token = await getToken();

  if (!token) {
    return null;
  }

  try {
    const { user } = await apiFetch<{ user: SessionUser }>("/api/auth/me", {
      redirectOn401: false,
    });
    return user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
});
