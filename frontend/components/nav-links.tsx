"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/navigation";
import type { Role } from "@/lib/types";

export function NavLinks({
  role,
  className,
  onNavigate,
}: {
  role: Role;
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className={cn("space-y-1.5", className)}>
      {NAV_ITEMS[role].map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground shadow-[0_1px_0_rgba(17,24,39,0.06)]"
                : "text-muted-foreground hover:bg-cream hover:text-ink",
            )}
          >
            <Icon className="size-[18px]" strokeWidth={isActive ? 2.3 : 2} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
