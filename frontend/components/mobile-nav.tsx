"use client";

import { useState } from "react";
import { LogOut, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { logoutAction } from "@/lib/actions/auth";
import { initials } from "@/lib/format";
import type { SessionUser } from "@/lib/types";
import { Brand } from "./brand";
import { NavLinks } from "./nav-links";

export function MobileNav({ user }: { user: SessionUser }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex size-10 items-center justify-center rounded-xl border border-foreground/10 bg-card text-ink transition-colors hover:bg-cream"
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </SheetTrigger>

      <SheetContent side="left" className="w-[300px] bg-surface p-5">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Move between your HeroReview pages.</SheetDescription>
        </SheetHeader>

        <Brand />

        <NavLinks role={user.role} className="mt-8" onNavigate={() => setOpen(false)} />

        <div className="mt-auto rounded-2xl border border-foreground/10 bg-cream/60 p-3">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-slate-blue text-xs font-bold text-white">
              {initials(user.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <form action={logoutAction} className="mt-3">
            <button
              type="submit"
              className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-white hover:text-ink"
            >
              <LogOut className="size-4" />
              Log out
            </button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
