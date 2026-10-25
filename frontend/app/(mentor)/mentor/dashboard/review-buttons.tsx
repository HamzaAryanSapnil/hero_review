"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { updateSubmissionStatus } from "@/app/(mentor)/mentor/dashboard/actions";
import { FormAlert } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { initialActionState } from "@/lib/action-state";

export function ReviewButtons({ submissionId }: { submissionId: string }) {
  const [approveState, approveAction, approvePending] = useActionState(
    updateSubmissionStatus,
    initialActionState,
  );
  const [rejectState, rejectAction, rejectPending] = useActionState(
    updateSubmissionStatus,
    initialActionState,
  );
  const isPending = approvePending || rejectPending;

  return (
    <div className="space-y-2">
      <FormAlert message={approveState.formError ?? rejectState.formError} />
      <div className="flex flex-nowrap justify-end gap-2">
        <form action={approveAction}>
          <input type="hidden" name="id" value={submissionId} />
          <input type="hidden" name="status" value="APPROVED" />
          <Button type="submit" size="sm" disabled={isPending}>
            {approvePending ? <Loader2 className="animate-spin" /> : null}
            Approve
          </Button>
        </form>
        <form action={rejectAction}>
          <input type="hidden" name="id" value={submissionId} />
          <input type="hidden" name="status" value="REJECTED" />
          <Button type="submit" size="sm" variant="destructive" disabled={isPending}>
            {rejectPending ? <Loader2 className="animate-spin" /> : null}
            Reject
          </Button>
        </form>
      </div>
    </div>
  );
}
