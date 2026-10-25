import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { ROUTES, roleHome } from "@/lib/navigation";
import { getSession } from "@/lib/session";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Create a student account — HeroReview",
};

export default async function SignupPage() {
  const session = await getSession();

  if (session) {
    redirect(roleHome(session.role));
  }

  return (
    <AuthShell
      title="Create your student account"
      subtitle="Sign up to submit your projects for review. Mentor accounts are created by the programme team."
      footer={
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href={ROUTES.LOGIN} className="font-semibold text-ink underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
