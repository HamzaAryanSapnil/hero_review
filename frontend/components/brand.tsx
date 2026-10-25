import Link from "next/link";
import { CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/navigation";

export function Brand({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link href={ROUTES.HOME} className={cn("inline-flex items-center gap-3", className)}>
      <span className="grid size-10 place-items-center rounded-2xl bg-ink text-cream shadow-sm">
        <CheckCheck className="size-5" strokeWidth={2.4} />
      </span>
      {!compact && (
        <span className="text-[19px] font-semibold tracking-tight text-ink">
          Hero<span className="text-slate-blue-ink">Review</span>
        </span>
      )}
    </Link>
  );
}
