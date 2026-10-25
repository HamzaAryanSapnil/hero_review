import { Skeleton } from "@/components/ui/skeleton";

export default function SubmitLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-3 w-32 rounded-full" />
        <Skeleton className="h-10 w-80 max-w-full rounded-xl" />
        <Skeleton className="h-4 w-[520px] max-w-full rounded-full" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="surface-card space-y-6 p-7">
          <Skeleton className="h-5 w-40 rounded-full" />
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-full" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          ))}
          <Skeleton className="h-11 w-44 rounded-xl" />
        </div>
        <div className="space-y-5">
          <Skeleton className="h-52 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
