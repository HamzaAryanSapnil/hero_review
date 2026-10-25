"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { updateSubmissionStatus } from "@/app/(mentor)/mentor/dashboard/actions";
import { FormAlert } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { initialActionState } from "@/lib/action-state";

export function ReviewButtons({ submissionId }: { submissionId: string }) {
  const [state, formAction, isPending] = useActionState(
    updateSubmissionStatus,
    initialActionState,
  );

  return (
    <div className="space-y-2">
      <FormAlert message={state.formError} />
      <div className="flex flex-wrap gap-2">
        <form action={formAction}>
          <input type="hidden" name="id" value={submissionId} />
          <input type="hidden" name="status" value="APPROVED" />
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" /> : null}
            Approve
          </Button>
        </form>
        <form action={formAction}>
          <input type="hidden" name="id" value={submissionId} />
          <input type="hidden" name="status" value="REJECTED" />
          <Button type="submit" size="sm" variant="destructive" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" /> : null}
            Reject
          </Button>
        </form>
      </div>
    </div>
  );
}
