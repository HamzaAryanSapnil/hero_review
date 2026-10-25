import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { getSession } from "@/lib/session";
import { roleHome } from "@/lib/navigation";
import { LoginForm } from "./login-form";
import Link from "next/link";
import { ROUTES } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Sign in — HeroReview",
};

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect(roleHome(session.role));
  }

  return (
    <AuthShell
      title="Sign in to your workspace"
      subtitle="Students submit projects. Mentors review them. Use the account that matches your role."
      footer={
        <div className="space-y-5">
          <div className="rounded-2xl border border-foreground/10 bg-card p-4">
            <p className="eyebrow">Evaluator demo accounts</p>
            <dl className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between gap-3">
                <dt className="font-medium text-ink">Mentor</dt>
                <dd className="font-mono text-muted-foreground">
                  mentor@heroreview.dev / Mentor@12345
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="font-medium text-ink">Student</dt>
                <dd className="font-mono text-muted-foreground">
                  student1@heroreview.dev / Student@12345
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="font-medium text-ink">Admin</dt>
                <dd className="font-mono text-muted-foreground">
                  admin@gmail.com / Ab123456
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-[11px] leading-4 text-muted-foreground">
              The demo buttons in the form fill these credentials for you.
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            New student?{" "}
            <Link href={ROUTES.SIGNUP} className="font-semibold text-ink underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
