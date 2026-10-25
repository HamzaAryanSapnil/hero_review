import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckCircle2, ClipboardCheck, Clock3, GitPullRequestArrow } from "lucide-react";
import { ProjectSubmissionForm } from "@/components/project-submission-form";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Submit a project — HeroReview",
};

const checklist = [
  "The repository is public and the link opens in incognito.",
  "The live link is deployed and loads without a login.",
  "The description explains what the project does and what you learned.",
  "You have not submitted this repository before.",
];

export default async function SubmitPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "STUDENT") {
    redirect("/mentor/dashboard");
  }

  return (
    <div className="space-y-8">
      <header className="max-w-2xl">
        <p className="eyebrow">Student workspace</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Submit your project
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-ink">
          Four fields, one submission. Your mentor will review it and mark it
          approved or rejected. You cannot resubmit the same repository.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <section className="surface-card p-5 sm:p-7">
          <div className="mb-6 flex items-start justify-between gap-4 border-b border-foreground/10 pb-5">
            <div>
              <h2 className="text-lg font-semibold text-ink">Project details</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Fields are validated as you type. The server checks again.
              </p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-slate-blue-ink">
              Ready to submit
            </span>
          </div>

          <ProjectSubmissionForm />
        </section>

        <aside className="space-y-5">
          <div className="surface-card p-5">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-cream text-warning">
                <ClipboardCheck className="size-4" />
              </span>
              <h2 className="text-sm font-semibold text-ink">Before you submit</h2>
            </div>
            <ul className="mt-4 space-y-3">
              {checklist.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-5 text-muted-ink">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="surface-card p-5">
            <h2 className="text-sm font-semibold text-ink">What happens next</h2>
            <ol className="mt-4 space-y-4">
              {[
                {
                  icon: GitPullRequestArrow,
                  title: "Submitted",
                  body: "Your project appears in the mentor queue immediately.",
                },
                {
                  icon: Clock3,
                  title: "Reviewed",
                  body: "A mentor checks the repository and the live link.",
                },
                {
                  icon: CheckCircle2,
                  title: "Decision",
                  body: "The status becomes approved or rejected. It is final.",
                },
              ].map(({ icon: Icon, title, body }, index) => (
                <li key={title} className="flex gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-xl border border-foreground/10 bg-surface text-slate-blue-ink">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {index + 1}. {title}
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-3xl border border-slate-blue/30 bg-slate-blue/10 p-5">
            <p className="text-xs leading-5 text-slate-blue-ink">
              <span className="font-semibold">Duplicate guard:</span> the same student
              cannot submit the same GitHub repository twice, even with{" "}
              <span className="font-mono">.git</span> or a trailing slash.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
