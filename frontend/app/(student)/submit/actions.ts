"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api";
import type { ActionState } from "@/lib/action-state";
import { getSession } from "@/lib/session";
import { submissionSchema, toFieldErrors } from "@/lib/validation";

export type SubmissionActionState = ActionState & {
  submissionId?: string;
};

export async function createSubmission(
  _previousState: SubmissionActionState,
  formData: FormData,
): Promise<SubmissionActionState> {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "STUDENT") {
    redirect("/mentor/dashboard");
  }

  const parsed = submissionSchema.safeParse({
    projectName: String(formData.get("projectName") ?? ""),
    repoUrl: String(formData.get("repoUrl") ?? ""),
    liveUrl: String(formData.get("liveUrl") ?? ""),
    description: String(formData.get("description") ?? ""),
  });

  if (!parsed.success) {
    return { ok: false, fields: toFieldErrors(parsed.error) };
  }

  try {
    const result = await apiFetch<{ submission: { id: string } }>("/api/submissions", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });

    revalidatePath("/mentor/dashboard");

    return { ok: true, submissionId: result.submission.id };
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
