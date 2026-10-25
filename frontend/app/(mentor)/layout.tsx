import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { getSession } from "@/lib/session";

export default async function MentorLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "MENTOR") {
    redirect("/submit");
  }

  return <AppShell user={session}>{children}</AppShell>;
}
