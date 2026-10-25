import type { ReactNode } from "react";
import { initials } from "@/lib/format";
import type { SessionUser } from "@/lib/types";
import { Brand } from "./brand";
import { LogoutButton } from "./logout-button";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";

export function AppShell({
  user,
  children,
}: {
  user: SessionUser;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[264px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-foreground/10 bg-surface/90 p-5 backdrop-blur lg:flex">
        <div className="px-2 pt-2">
          <Brand />
        </div>

        <div className="mt-9 flex-1">
          <p className="eyebrow px-3.5">Workspace</p>
          <NavLinks role={user.role} className="mt-3" />
        </div>

        <div className="rounded-2xl border border-foreground/10 bg-cream/60 p-3">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-slate-blue text-xs font-bold text-white">
              {initials(user.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="mt-3 border-t border-foreground/10 pt-2">
            <LogoutButton />
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 border-b border-foreground/10 bg-background/85 backdrop-blur-xl lg:hidden">
          <div className="page-shell flex h-16 items-center justify-between">
            <Brand compact />
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-xl bg-slate-blue text-xs font-bold text-white">
                {initials(user.name)}
              </span>
              <MobileNav user={user} />
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="page-shell py-8 lg:py-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
