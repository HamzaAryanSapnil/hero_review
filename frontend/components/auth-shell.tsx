import type { ReactNode } from "react";
import { CheckCircle2, Layers3, ShieldCheck } from "lucide-react";
import { Brand } from "./brand";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[1.06fr_1fr]">
      <section className="relative hidden overflow-hidden bg-cream lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div className="soft-grid absolute inset-0 opacity-70" />
        <div className="absolute -top-24 -right-16 size-72 rounded-full bg-peach/50 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 size-80 rounded-full bg-slate-blue/20 blur-3xl" />

        <div className="relative">
          <Brand />
        </div>

        <div className="relative max-w-md">
          <p className="eyebrow">Programming Hero · Hiring task</p>
          <h1 className="mt-4 text-4xl leading-[1.1] font-semibold tracking-tight text-ink xl:text-[44px]">
            Ship your work.
            <br />
            Get feedback that matters.
          </h1>
          <p className="mt-5 text-sm leading-6 text-muted-ink">
            One focused place for students to submit projects and mentors to
            review them — without spreadsheets, lost links, or duplicate entries.
          </p>

          <div className="auth-3d-scene mt-9" aria-hidden="true">
            <div className="auth-3d-bob">
              <div className="auth-3d-stack">
                <div className="auth-3d-card auth-3d-card-back" />
                <div className="auth-3d-card auth-3d-card-mid">
                  <span className="auth-3d-bar w-3/4" />
                  <span className="auth-3d-bar mt-2 w-1/2" />
                  <span className="auth-3d-bar mt-2 w-2/3" />
                </div>
                <div className="auth-3d-card auth-3d-card-front">
                  <span className="auth-3d-chip">APPROVED</span>
                  <span className="auth-3d-bar w-1/2 bg-[rgba(17,24,39,0.35)]" />
                  <span className="auth-3d-bar mt-2 w-3/4" />
                  <span className="auth-3d-bar mt-2 w-2/5" />
                  <span className="mt-3 block w-fit rounded-full bg-[#fad4c0] px-2.5 py-1 font-mono text-[9px] font-semibold text-[#111827]">
                    github.com/owner/repo
                  </span>
                </div>
              </div>
            </div>
          </div>

          <ul className="mt-8 space-y-3 text-sm text-ink">
            {[
              { icon: CheckCircle2, text: "Validated submissions with duplicate protection" },
              { icon: Layers3, text: "A paginated review queue with server-side filters" },
              { icon: ShieldCheck, text: "JWT sessions and role-based access" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-6 place-items-center rounded-lg bg-white/70 text-slate-blue-ink">
                  <Icon className="size-3.5" />
                </span>
                <span className="leading-6">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative grid max-w-sm grid-cols-3 gap-2">
          {[
            ["Submit", "4 fields"],
            ["Review", "5 / page"],
            ["Decide", "1 click"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-ink/10 bg-white/65 p-3 backdrop-blur-sm"
            >
              <p className="text-[10px] font-semibold tracking-wider text-muted-ink uppercase">
                {label}
              </p>
              <p className="mt-1 font-mono text-sm font-semibold text-ink">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-9 lg:hidden">
            <Brand />
          </div>

          <p className="eyebrow">Welcome to HeroReview</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-ink">{subtitle}</p>

          <div className="mt-8">{children}</div>
          {footer ? <div className="mt-6">{footer}</div> : null}
        </div>
      </section>
    </main>
  );
}
