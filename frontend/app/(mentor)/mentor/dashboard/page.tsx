import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  Inbox,
  XCircle,
} from "lucide-react";
import { ReviewButtons } from "@/app/(mentor)/mentor/dashboard/review-buttons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiFetch } from "@/lib/api";
import { formatDate, statusLabel, truncate } from "@/lib/format";
import { getSession } from "@/lib/session";
import type { ListSubmissionsResponse, SubmissionStats, SubmissionStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Review dashboard — HeroReview",
};

const STATUS_FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const filterLabels: Record<StatusFilter, string> = {
  ALL: "All",
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

function parseStatus(value: string | undefined): StatusFilter {
  if (value && STATUS_FILTERS.includes(value as StatusFilter)) {
    return value as StatusFilter;
  }
  return "ALL";
}

function parsePage(value: string | undefined): number {
  const page = Number(value);
  return Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1;
}

function dashboardHref(status: StatusFilter, page = 1): string {
  const params = new URLSearchParams();
  if (status !== "ALL") {
    params.set("status", status);
  }
  if (page > 1) {
    params.set("page", String(page));
  }
  const query = params.toString();
  return query ? `/mentor/dashboard?${query}` : "/mentor/dashboard";
}

function StatusBadge({ status }: { status: SubmissionStatus }) {
  const variant =
    status === "APPROVED"
      ? "default"
      : status === "REJECTED"
        ? "destructive"
        : "secondary";

  return (
    <Badge variant={variant} className="font-semibold">
      {statusLabel(status)}
    </Badge>
  );
}

type PageProps = {
  searchParams: Promise<{ status?: string; page?: string }>;
};

export default async function MentorDashboardPage({ searchParams }: PageProps) {
  const session = await getSession();
  const params = await searchParams;
  const status = parseStatus(params.status);
  const page = parsePage(params.page);

  const query = new URLSearchParams({
    status,
    page: String(page),
    limit: "10",
  });

  const [stats, list] = await Promise.all([
    apiFetch<SubmissionStats>("/api/submissions/stats"),
    apiFetch<ListSubmissionsResponse>(`/api/submissions?${query}`),
  ]);

  const { data, meta } = list;
  const hasPrevious = page > 1;
  const hasNext = page < meta.totalPages;

  const statCards = [
    {
      label: "Total submissions",
      value: stats.total,
      icon: Inbox,
      accent: "text-slate-blue-ink bg-cream",
    },
    {
      label: "Pending review",
      value: stats.pending,
      icon: Clock3,
      accent: "text-warning bg-peach/60",
    },
    {
      label: "Approved",
      value: stats.approved,
      icon: CheckCircle2,
      accent: "text-success bg-cream",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      accent: "text-danger bg-cream",
    },
  ];

  const emptyMessage =
    status === "ALL"
      ? "There are no submissions yet."
      : `There are no ${filterLabels[status].toLowerCase()} submissions for this filter.`;

  return (
    <div className="space-y-7">
      <header className="max-w-2xl">
        <p className="eyebrow">Mentor workspace</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Review dashboard
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-ink">
          Welcome back, {session?.name ?? "Mentor"}. Review student projects, filter
          by status, and approve or reject pending submissions.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, accent }) => (
          <article
            key={label}
            className="surface-card flex items-start justify-between gap-4 rounded-2xl p-5"
          >
            <div>
              <p className="text-xs font-medium text-muted-ink">{label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">{value}</p>
            </div>
            <span className={cn("grid size-10 place-items-center rounded-2xl", accent)}>
              <Icon className="size-4" />
            </span>
          </article>
        ))}
      </section>

      <section className="surface-card overflow-hidden">
        <div className="border-b border-foreground/10 px-5 py-5 sm:px-7">
          <h2 className="text-lg font-semibold text-ink">Submission queue</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pending rows can be approved or rejected. Decisions are final.
          </p>
          <nav
            className="mt-4 flex flex-wrap gap-2"
            aria-label="Filter submissions by status"
          >
            {STATUS_FILTERS.map((filter) => {
              const isActive = status === filter;
              return (
                <Link
                  key={filter}
                  href={dashboardHref(filter, 1)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                    isActive
                      ? "border-ink bg-ink text-peach"
                      : "border-foreground/10 bg-cream/60 text-muted-ink hover:border-foreground/20 hover:text-ink",
                  )}
                >
                  {filterLabels[filter]}
                </Link>
              );
            })}
          </nav>
        </div>

        {data.length === 0 ? (
          <div className="px-5 py-16 text-center sm:px-7">
            <p className="text-sm font-medium text-ink">Nothing in the queue</p>
            <p className="mt-2 text-sm text-muted-ink">{emptyMessage}</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Project</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Links</TableHead>
                  <TableHead className="min-w-[200px]">Description</TableHead>
                  <TableHead>Reviewer</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium text-ink">
                      {submission.projectName}
                    </TableCell>
                    <TableCell>
                      <div className="text-ink">{submission.student.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {submission.student.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={submission.status} />
                    </TableCell>
                    <TableCell className="text-muted-ink">
                      {formatDate(submission.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <a
                          href={submission.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-slate-blue-ink hover:underline"
                        >
                          Repository
                          <ExternalLink className="size-3" />
                        </a>
                        <a
                          href={submission.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-slate-blue-ink hover:underline"
                        >
                          Live site
                          <ExternalLink className="size-3" />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[240px] whitespace-normal text-xs leading-5 text-muted-ink">
                      {truncate(submission.description, 120)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-ink">
                      {submission.reviewedBy?.name ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {submission.status === "PENDING" ? (
                        <ReviewButtons submissionId={submission.id} />
                      ) : (
                        <span className="text-xs text-muted-foreground">Reviewed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {meta.totalPages > 1 ? (
              <div className="flex items-center justify-between gap-4 border-t border-foreground/10 px-5 py-4 sm:px-7">
                <p className="text-xs text-muted-ink">
                  Page {meta.page} of {meta.totalPages} · {meta.total} submission
                  {meta.total === 1 ? "" : "s"}
                </p>
                <div className="flex gap-2">
                  {hasPrevious ? (
                    <Button variant="outline" size="sm" render={<Link href={dashboardHref(status, page - 1)} />}>
                      <ChevronLeft />
                      Previous
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      <ChevronLeft />
                      Previous
                    </Button>
                  )}
                  {hasNext ? (
                    <Button variant="outline" size="sm" render={<Link href={dashboardHref(status, page + 1)} />}>
                      Next
                      <ChevronRight />
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      Next
                      <ChevronRight />
                    </Button>
                  )}
                </div>
              </div>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
