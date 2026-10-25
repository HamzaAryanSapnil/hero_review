# HeroReview

Students submit projects. Mentors review them.

This repository holds both apps:

- `frontend` — Next.js, Tailwind, shadcn
- `backend` — Express, Prisma, PostgreSQL, JWT

## Run locally

Backend:

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run seed
npm run dev
```

Frontend:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Set `BACKEND_URL=http://localhost:4000` in `frontend/.env.local`.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@gmail.com | Ab123456 |
| Mentor | mentor@heroreview.dev | Mentor@12345 |
| Student | student1@heroreview.dev | Student@12345 |
