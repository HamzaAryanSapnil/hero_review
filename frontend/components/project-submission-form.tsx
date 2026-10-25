"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AlignLeft,
  CheckCircle2,
  FolderKanban,
  GitBranch,
  Globe,
  Loader2,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FormAlert } from "@/components/form-field";
import type { FieldErrors } from "@/lib/action-state";
import { submissionFieldSchemas } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { createSubmission, type SubmissionActionState } from "@/app/(student)/submit/actions";

type Values = {
  projectName: string;
  repoUrl: string;
  liveUrl: string;
  description: string;
};

const emptyValues: Values = {
  projectName: "",
  repoUrl: "",
  liveUrl: "",
  description: "",
};

const initialState: SubmissionActionState = { ok: false };

export function ProjectSubmissionForm() {
  const [values, setValues] = useState<Values>(emptyValues);
  const [touched, setTouched] = useState<Record<keyof Values, boolean>>({
    projectName: false,
    repoUrl: false,
    liveUrl: false,
    description: false,
  });
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const [state, formAction, isPending] = useActionState(createSubmission, initialState);
  const lastHandledSubmission = useRef<string | null>(null);

  useEffect(() => {
    if (!state.ok || !state.submissionId) return;
    if (lastHandledSubmission.current === state.submissionId) return;

    lastHandledSubmission.current = state.submissionId;
    toast.success("Project submitted for review.");
    setValues(emptyValues);
    setTouched({
      projectName: false,
      repoUrl: false,
      liveUrl: false,
      description: false,
    });
    setClientErrors({});
  }, [state.ok, state.submissionId]);

  const validateField = (name: keyof Values, value: string) => {
    const result = submissionFieldSchemas[name].safeParse(value);
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

  const errors = (name: keyof Values) =>
    clientErrors[name]?.[0] ?? state.fields?.[name]?.[0];

  return (
    <form action={formAction} noValidate className="space-y-5">
      {state.ok ? (
        <div
          role="status"
          className="flex items-start gap-2.5 rounded-xl border border-success/20 bg-success/5 px-3.5 py-3 text-sm text-success"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <p className="leading-5">
            Submitted. Your project is now in the mentor review queue.
          </p>
        </div>
      ) : null}

      <FormAlert message={state.formError} />

      <Field label="Project name" htmlFor="projectName" error={errors("projectName")}>
        <div className="relative">
          <FolderKanban className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="projectName"
            name="projectName"
            placeholder="e.g. DevFlow Community Q&A"
            value={values.projectName}
            onChange={(event) => handleChange("projectName", event.target.value)}
            onBlur={() => handleBlur("projectName")}
            aria-invalid={Boolean(errors("projectName"))}
            aria-describedby={errors("projectName") ? "projectName-error" : undefined}
            className={cn(
              "h-11 rounded-xl border-input bg-card pr-3.5 pl-10 text-sm shadow-sm",
              errors("projectName") && "border-danger/50",
            )}
          />
        </div>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="GitHub repository"
          htmlFor="repoUrl"
          error={errors("repoUrl")}
          hint="Public repo"
        >
          <div className="relative">
            <GitBranch className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="repoUrl"
              name="repoUrl"
              placeholder="https://github.com/you/project"
              value={values.repoUrl}
              onChange={(event) => handleChange("repoUrl", event.target.value)}
              onBlur={() => handleBlur("repoUrl")}
              aria-invalid={Boolean(errors("repoUrl"))}
              aria-describedby={errors("repoUrl") ? "repoUrl-error" : undefined}
              className={cn(
                "h-11 rounded-xl border-input bg-card pr-3.5 pl-10 font-mono text-[13px] shadow-sm",
                errors("repoUrl") && "border-danger/50",
              )}
            />
          </div>
        </Field>

        <Field
          label="Live link"
          htmlFor="liveUrl"
          error={errors("liveUrl")}
          hint="Deployed site"
        >
          <div className="relative">
            <Globe className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="liveUrl"
              name="liveUrl"
              placeholder="https://your-project.vercel.app"
              value={values.liveUrl}
              onChange={(event) => handleChange("liveUrl", event.target.value)}
              onBlur={() => handleBlur("liveUrl")}
              aria-invalid={Boolean(errors("liveUrl"))}
              aria-describedby={errors("liveUrl") ? "liveUrl-error" : undefined}
              className={cn(
                "h-11 rounded-xl border-input bg-card pr-3.5 pl-10 font-mono text-[13px] shadow-sm",
                errors("liveUrl") && "border-danger/50",
              )}
            />
          </div>
        </Field>
      </div>

      <Field
        label="Description"
        htmlFor="description"
        error={errors("description")}
        hint={`${values.description.length}/1000`}
      >
        <div className="relative">
          <AlignLeft className="pointer-events-none absolute top-3.5 left-3.5 size-4 text-muted-foreground" />
          <Textarea
            id="description"
            name="description"
            rows={6}
            placeholder="What does the project do? Which stack did you use? What was the hardest part?"
            value={values.description}
            onChange={(event) => handleChange("description", event.target.value)}
            onBlur={() => handleBlur("description")}
            aria-invalid={Boolean(errors("description"))}
            aria-describedby={errors("description") ? "description-error" : undefined}
            className={cn(
              "min-h-36 resize-y rounded-xl border-input bg-card py-3 pr-3.5 pl-10 text-sm leading-6 shadow-sm",
              errors("description") && "border-danger/50",
            )}
          />
        </div>
      </Field>

      <div className="flex flex-col gap-3 border-t border-foreground/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-muted-foreground">
          Submitting does not lock the project immediately — a mentor reviews it first.
        </p>
        <Button
          type="submit"
          disabled={isPending}
          className="h-11 rounded-xl px-5 text-sm font-semibold shadow-sm sm:min-w-44"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              <Send className="size-4" />
              Submit project
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
