# HeroReview

Students submit their GitHub projects in one place. Mentors review them in a filterable dashboard. Built as the Associate Web Instructor hiring task for Programming Hero.

The browser never calls Express directly. Every request goes from the Next.js server (a Server Component or a Server Action) with a Bearer JWT, and the JWT lives in an httpOnly cookie.

Live API: https://hero-review.onrender.com

Repository: https://github.com/HamzaAryanSapnil/hero_review

## Tech stack

| Layer | Choice |
| :-- | :-- |
| Frontend | Next.js 16.4 (App Router), React 19.3, TypeScript 5 |
| Styling | Tailwind CSS v4, shadcn/ui (`base-nova`, Base UI), custom Bento-inspired theme |
| Fonts | Inter (UI) + JetBrains Mono (numbers, metadata) |
| Backend | Express 5, TypeScript, Zod 4 |
| Database | PostgreSQL + Prisma 6 |
| Auth | JWT in an httpOnly cookie, bcrypt password hashing |
| Security | Helmet, role-based access control, per-user and per-IP rate limits |
| Dev database | Neon (used here); any PostgreSQL 16 instance also works |

## Architecture

```mermaid
flowchart LR
  B["Browser"] -->|"HTML + RSC payload"| N
  B -->|"form submit / button click"| SA
  subgraph N["Next.js 16 server - frontend/"]
    RSC["Server Components<br/>page.tsx, dashboard"]
    SA["Server Actions<br/>login, signup, createSubmission,<br/>updateSubmissionStatus"]
  end
  RSC -->|"fetch + Bearer JWT"| MW
  SA -->|"fetch + Bearer JWT"| MW
  subgraph E["Express API :4000 - backend/"]
    MW["rate limit, JWT verify,<br/>role check, Zod"] --> H["route handlers"]
  end
  H --> P[("PostgreSQL via Prisma")]
```

**Why two servers?** The task requires Express, and the teaching video explains the path from a Server Action to Express. Express is the only security boundary. Hiding a button in the UI is never enough: every endpoint verifies the JWT and the role again.

## Run locally

### 1. Prerequisites

- Node.js 20.9+ and npm
- PostgreSQL 16 (a free cloud instance such as Neon or Supabase, or any local instance)

### 2. Install

```bash
git clone https://github.com/HamzaAryanSapnil/hero_review.git
cd hero_review

npm install --prefix backend
npm install --prefix frontend
```

### 3. Environment files

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

`backend/.env`:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST/hero_review?sslmode=require"
JWT_SECRET="replace-with-a-long-random-string"
PORT=4000
SEED_MENTOR_EMAIL="mentor@heroreview.dev"
SEED_MENTOR_PASSWORD="Mentor@12345"
SEED_ADMIN_EMAIL="admin@gmail.com"
SEED_ADMIN_PASSWORD="Ab123456"
SEED_STUDENT_PASSWORD="Student@12345"
DEMO_DELAY_MS=0
```

`frontend/.env.local`:

```dotenv
BACKEND_URL=http://localhost:4000
```

Do not use `NEXT_PUBLIC_BACKEND_URL`. The API URL stays on the server on purpose.

**Neon.** Create a free PostgreSQL database and copy its connection string into `DATABASE_URL`. Keep `sslmode=require`. If the Neon URI contains `channel_binding=require` and Prisma rejects it, remove only that parameter. For `prisma migrate`, use the direct host, not the host that contains `-pooler`.

### 4. Migrate and seed

```bash
cd backend
npx prisma generate
npx prisma migrate dev
npm run seed
```

The seed is idempotent. It creates 2 mentor accounts (the mentor and the admin) and 3 students, plus the demo submissions spread over several dates.

### 5. Start both servers

```bash
# terminal 1
cd backend && npm run dev      # http://localhost:4000

# terminal 2
cd frontend && npm run dev     # http://localhost:3000
```

Open http://localhost:3000. The login page lists the demo accounts and fills the form when you press a demo button.

## Demo accounts

| Role | Email | Password |
| :-- | :-- | :-- |
| Mentor | `mentor@heroreview.dev` | `Mentor@12345` |
| Admin | `admin@gmail.com` | `Ab123456` |
| Student 1 | `student1@heroreview.dev` | `Student@12345` |
| Student 2 | `student2@heroreview.dev` | `Student@12345` |
| Student 3 | `student3@heroreview.dev` | `Student@12345` |

Mentor and admin both open `/mentor/dashboard`. A student opens `/submit`. A new signup is always `STUDENT`. A role sent in the request body is ignored.

## Decisions

| Question | Decision | Why |
| :-- | :-- | :-- |
| What counts as a duplicate? | Same student + same normalized GitHub repo (lowercase, trailing `/` and `.git` removed) | One student submitting the same project twice is the real duplicate. Another student may submit the same repo for a group project. |
| Race condition? | A database unique constraint is the final guard. `P2002` becomes `409` | Two simultaneous requests cannot both pass a pre-check. |
| Can approve or reject be changed? | No. Only `PENDING → APPROVED` or `PENDING → REJECTED` | Simple and auditable. A second attempt returns `409 ALREADY_REVIEWED`. |
| Admin vs mentor? | There is no separate `ADMIN` role. `admin@gmail.com` is seeded as a second `MENTOR`. Signup is always `STUDENT` | The brief seeds an admin, but the privileged role in the app is `MENTOR`. Accepting a role from the body would be mass assignment. |
| Rate limits? | Submissions: 5 per 10 minutes per user id. Auth: 20 per 15 minutes per IP | Every call reaches Express from the Next.js server, so Express mostly sees one IP. Per-user limiting is fairer for submissions. |
| Filter options? | `ALL` (default), `PENDING`, `APPROVED`, `REJECTED` | The brief names approved and rejected, but mentors also need the pending queue. |
| What do stats count? | All submissions, independent of the filter and the page | Counts that change when you filter are confusing. |
| Where do stats live? | A separate `/api/submissions/stats` endpoint | Stats can load before the table. |
| Sort order? | Newest `createdAt` first | The most recent work is reviewed first. |
| Pagination? | `page` starts at 1. `limit` defaults to 10 and the dashboard requests 10 (maximum 50) | Enough rows to show several pages. |
| URL rules? | Repo: only `https://github.com/owner/repo`. Live link: any `https://` URL | Cuts down malformed submissions. |
| Token? | JWT, 1-day expiry, httpOnly cookie, no refresh token | Enough for this scope. |
| How is the role checked? | From the JWT claims (`sub`, `role`). No database lookup on every request | Performance. A role change can take up to one day to affect an old token. |
| Mass assignment? | Express never accepts `role`, `status`, or `studentId` from a request body | Security. |
| Refresh after a review? | `revalidatePath('/mentor/dashboard')` in the Server Action | The database changed, but Next.js does not know until that path is revalidated. |

## API

Local base URL: `http://localhost:4000`. Production base URL: `https://hero-review.onrender.com`.

Every error uses the same shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please check the highlighted fields.",
    "fields": { "repoUrl": ["Use a valid GitHub repository URL."] }
  }
}
```

| Method | Path | Who | Body / query | Success | Failure |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `POST` | `/api/auth/signup` | Public | `name, email, password` | `201 {user, token}` | `409 EMAIL_TAKEN`, `422`, `429` |
| `POST` | `/api/auth/login` | Public | `email, password` | `200 {user, token}` | `401 INVALID_CREDENTIALS`, `422`, `429` |
| `GET` | `/api/auth/me` | Logged in | — | `200 {user}` | `401` |
| `POST` | `/api/submissions` | `STUDENT` | `projectName, repoUrl, liveUrl, description` | `201 {submission}` | `409 DUPLICATE_SUBMISSION`, `422`, `429`, `403` |
| `GET` | `/api/submissions` | `MENTOR` | `status, page, limit` | `200 {data, meta}` | `401`, `403`, `422` |
| `GET` | `/api/submissions/stats` | `MENTOR` | — | `200 {total, pending, approved, rejected}` | `401`, `403` |
| `PATCH` | `/api/submissions/:id/status` | `MENTOR` | `status: APPROVED or REJECTED` | `200 {submission}` | `404`, `409 ALREADY_REVIEWED`, `422`, `403` |
| `GET` | `/api/health` | Public | — | `200` | — |

A submission row includes `student: { name, email }`. `passwordHash` is never returned.

## Checks

```bash
cd backend  && npm run typecheck
cd frontend && npm run typecheck && npm run lint && npm run build
```

## Deployment

One GitHub repository, two hosts. The browser never calls Express, so the two origins do not need CORS.

The API is already deployed at https://hero-review.onrender.com.

### Backend on Render

| Setting | Value |
| :-- | :-- |
| Root directory | `backend` |
| Build command | `npm install --include=dev && npx prisma generate && npm run build` |
| Start command | `npm start` |
| Environment | `DATABASE_URL`, `JWT_SECRET` |

Do not run `npx prisma migrate deploy` inside the Render build command. On the free plan the build machine cannot reach Render's internal database host (`dpg-...-a`), and Prisma fails with `P1001`. The free plan also has no pre-deploy command.

Use a public Postgres URL, such as Neon. Drop `-pooler` from the host when you migrate, keep `sslmode=require`, and drop `channel_binding=require`.

Apply the schema and the demo data once from your own machine, with `DATABASE_URL` pointing at that same production database:

```bash
cd backend
npx prisma migrate deploy
npm run seed
```

`npm start` runs `node dist/server.js`. Render injects `PORT` (this service listens on `10000`).

### Frontend on Vercel

| Setting | Value |
| :-- | :-- |
| Root directory | `frontend` |
| Install command | leave empty (`npm install`) |
| Build command | leave empty (`npm run build`) |
| Environment | `BACKEND_URL=https://hero-review.onrender.com` |

Do not put `npx prisma migrate deploy` or `npm start` in the Vercel install command. The frontend package does not depend on Prisma, so `npx` would download Prisma 8, which no longer has `migrate deploy`, and the build exits with code 2.

There is no trailing slash on `BACKEND_URL`.

After both deploys, open the Vercel URL and sign in with a demo account. A free Render service sleeps when idle. The first request after sleep can take about half a minute.

## Videos

Record both videos in Bengali, 10 to 12 minutes each, with OBS and a facecam in the lower-right corner. One video must come from Category 1 and the other from Category 2. Two topics from the same category disqualify the submission.

| Video | Topic | Status |
| :-- | :-- | :-- |
| Category 1 | Theoretical lesson, using this project as the example | Link coming soon |
| Category 2C | Live-code the mentor dashboard: server fetch, `loading.tsx`, `revalidatePath`, and `error.tsx` | Link coming soon |

Set `DEMO_DELAY_MS=1000` in `backend/.env` before recording if you want the loading skeletons to stay on screen. Set it back to `0` afterwards.

## Known trade-offs

- The role is inside the JWT. There is no database lookup on each request, so a role change does not affect an existing token until it expires (up to one day).
- Rate limits are in memory. They reset when the backend restarts, and they do not span multiple instances. A larger deployment would use Redis.
- There is no refresh token. After one day the user signs in again.
- Stats count every submission. They do not follow the active filter.
- The Next.js proxy only checks that a cookie exists. That is a navigation guard. Express verifies the JWT and the role on every protected route.
- Two mentor accounts are seeded. There is no screen for creating more mentors.
- A hosted database adds network latency. Suspense skeletons cover that wait, and `DEMO_DELAY_MS` makes the wait visible while recording.

## Project structure

```text
hero_review/
├── backend/
│   ├── prisma/                 schema, migration, seed
│   └── src/
│       ├── app/modules/        auth, submission, health
│       ├── middlewares/        auth, RBAC, validation, rate limit, errors
│       └── shared/             prisma, jwt, async handler, response helper
├── frontend/
│   ├── app/
│   │   ├── (student)/submit/   student submission flow and Server Action
│   │   └── (mentor)/mentor/dashboard/
│   ├── components/             form, table, shell
│   ├── lib/                    server-only API and session helpers, types, validation
│   └── proxy.ts                cookie check that sends anonymous users to login
└── README.md
```

## Contact

Built by Hamza Aryan Sapnil for the Programming Hero Associate Web Instructor hiring task.
