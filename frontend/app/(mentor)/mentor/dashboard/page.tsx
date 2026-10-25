import type { Metadata } from "next";
import { BarChart3, Filter, LayoutDashboard, MousePointerClick } from "lucide-react";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Review dashboard — HeroReview",
};

const nextSteps = [
  {
    icon: BarChart3,
    title: "Stats cards",
    body: "Fetch total, pending, approved and rejected from /api/submissions/stats.",
  },
  {
    icon: Filter,
    title: "URL filters",
    body: "Read status and page from searchParams, then pass them to the Express list endpoint.",
  },
  {
    icon: MousePointerClick,
    title: "Review actions",
    body: "Add ReviewButtons, the updateSubmissionStatus action and revalidatePath.",
  },
];

export default async function MentorDashboardPage() {
  const session = await getSession();

  return (
    <div className="space-y-7">
      <header className="max-w-2xl">
        <p className="eyebrow">Mentor workspace</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Review dashboard
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-ink">
          Welcome back, {session?.name ?? "Mentor"}. Auth, RBAC, the student
          submission flow and the Express API are ready. The dashboard data layer
          is the last piece.
        </p>
      </header>

      <section className="surface-card overflow-hidden">
        <div className="relative border-b border-foreground/10 bg-peach/45 px-6 py-8 sm:px-8">
          <span className="grid size-12 place-items-center rounded-2xl bg-ink text-peach">
            <LayoutDashboard className="size-5" />
          </span>
          <p className="eyebrow mt-5 text-ink/60">Video 2C starting point</p>
          <h2 className="mt-2 max-w-xl text-2xl font-semibold tracking-tight text-ink">
            The review queue gets built here.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-ink">
            This placeholder exists so the dashboard can be live-coded in the
            second video without touching auth or the student flow. The finished
            version streams stats first, then the filtered table, and updates both
            after an approve or reject.
          </p>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
          {nextSteps.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="rounded-2xl border border-foreground/10 bg-cream/60 p-5"
            >
              <Icon className="size-4 text-slate-blue-ink" />
              <h3 className="mt-4 text-sm font-semibold text-ink">{title}</h3>
              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                {body}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
