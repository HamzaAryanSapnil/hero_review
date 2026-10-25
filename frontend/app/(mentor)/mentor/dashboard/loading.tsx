import { Skeleton } from "@/components/ui/skeleton";

export default function MentorDashboardLoading() {
  return (
    <div className="space-y-7">
      <div className="max-w-2xl space-y-3">
        <Skeleton className="h-3 w-36 rounded-full" />
        <Skeleton className="h-10 w-72 max-w-full rounded-xl" />
        <Skeleton className="h-4 w-[480px] max-w-full rounded-full" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-2xl" />
        ))}
      </div>

      <div className="surface-card space-y-4 p-6 sm:p-8">
        <Skeleton className="h-9 w-full max-w-md rounded-xl" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded-xl" />
          ))}
        </div>
        <div className="flex justify-between pt-2">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
