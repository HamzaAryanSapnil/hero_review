"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api";
import type { ActionState } from "@/lib/action-state";
import { getSession } from "@/lib/session";
import { toFieldErrors, updateStatusSchema } from "@/lib/validation";

export async function updateSubmissionStatus(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "MENTOR") {
    redirect("/submit");
  }

  const parsed = updateStatusSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    status: String(formData.get("status") ?? ""),
  });

  if (!parsed.success) {
    return { ok: false, fields: toFieldErrors(parsed.error) };
  }

  try {
    await apiFetch(`/api/submissions/${parsed.data.id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: parsed.data.status }),
    });

    revalidatePath("/mentor/dashboard");

    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        ok: false,
        formError: error.fields ? undefined : error.message,
        fields: error.fields,
      };
    }
    throw error;
  }
}
