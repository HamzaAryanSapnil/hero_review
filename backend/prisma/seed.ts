import { PrismaClient, Role, SubmissionStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const normalizeRepoUrl = (url: string) => {
  const withoutTrailingSlash = url.trim().replace(/\/+$/, "");
  const withoutGit = withoutTrailingSlash.endsWith(".git")
    ? withoutTrailingSlash.slice(0, -4)
    : withoutTrailingSlash;
  return withoutGit.toLowerCase();
};

const daysAgo = (days: number) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  date.setUTCHours(10, 0, 0, 0);
  return date;
};

type SeedSubmission = {
  student: number;
  projectName: string;
  repo: string;
  liveUrl: string;
  description: string;
  status: SubmissionStatus;
  createdDaysAgo: number;
};

const students = [
  { name: "Arif Hossain", email: "student1@heroreview.dev", username: "arif-hossain" },
  { name: "Sadia Islam", email: "student2@heroreview.dev", username: "sadia-islam" },
  { name: "Tanvir Ahmed", email: "student3@heroreview.dev", username: "tanvir-ahmed" },
];

const submissions: SeedSubmission[] = [
  {
    student: 0,
    projectName: "DevFlow Community Q&A",
    repo: "devflow-community",
    liveUrl: "https://devflow-community.vercel.app",
    description:
      "A developer Q&A platform with questions, answers, tags, voting and a global search built with Next.js and Prisma.",
    status: "APPROVED",
    createdDaysAgo: 28,
  },
  {
    student: 0,
    projectName: "FoodHub Delivery",
    repo: "foodhub-delivery",
    liveUrl: "https://foodhub-delivery.vercel.app",
    description:
      "A food delivery app with restaurant browsing, cart management, checkout and an order tracking dashboard.",
    status: "PENDING",
    createdDaysAgo: 3,
  },
  {
    student: 0,
    projectName: "FinTrack Expense Manager",
    repo: "fintrack-expense",
    liveUrl: "https://fintrack-expense.vercel.app",
    description:
      "Personal finance tracker with monthly budgets, category breakdowns and exportable spending reports.",
    status: "REJECTED",
    createdDaysAgo: 24,
  },
  {
    student: 0,
    projectName: "NextShop Storefront",
    repo: "nextshop-storefront",
    liveUrl: "https://nextshop-storefront.vercel.app",
    description:
      "A headless e-commerce storefront with product filters, cart persistence and a Stripe test checkout flow.",
    status: "APPROVED",
    createdDaysAgo: 22,
  },
  {
    student: 0,
    projectName: "TaskPilot Kanban",
    repo: "taskpilot-kanban",
    liveUrl: "https://taskpilot-kanban.vercel.app",
    description:
      "A team kanban board with drag-and-drop columns, labels, assignees and activity history for each task.",
    status: "PENDING",
    createdDaysAgo: 5,
  },
  {
    student: 0,
    projectName: "WeatherNow Dashboard",
    repo: "weathernow-dashboard",
    liveUrl: "https://weathernow-dashboard.vercel.app",
    description:
      "A weather dashboard with location search, hourly forecasts, saved cities and a responsive chart view.",
    status: "APPROVED",
    createdDaysAgo: 20,
  },
  {
    student: 0,
    projectName: "LearnHub LMS",
    repo: "learnhub-lms",
    liveUrl: "https://learnhub-lms.vercel.app",
    description:
      "An online learning platform with courses, video lessons, progress tracking and an instructor dashboard.",
    status: "PENDING",
    createdDaysAgo: 7,
  },
  {
    student: 0,
    projectName: "ChatWave Realtime",
    repo: "chatwave-realtime",
    liveUrl: "https://chatwave-realtime.vercel.app",
    description:
      "A realtime chat application with rooms, typing indicators, message reactions and an online presence list.",
    status: "REJECTED",
    createdDaysAgo: 26,
  },
  {
    student: 1,
    projectName: "MediCare Appointment",
    repo: "medicare-appointment",
    liveUrl: "https://medicare-appointment.vercel.app",
    description:
      "A clinic appointment booking system with doctor schedules, slot selection and patient confirmation emails.",
    status: "APPROVED",
    createdDaysAgo: 27,
  },
  {
    student: 1,
    projectName: "BentoSpend Tracker",
    repo: "bentospend-tracker",
    liveUrl: "https://bentospend-tracker.vercel.app",
    description:
      "A bento-style expense tracker with budget goals, category filters, search and a monthly summary view.",
    status: "PENDING",
    createdDaysAgo: 2,
  },
  {
    student: 1,
    projectName: "RecipeNest",
    repo: "recipenest",
    liveUrl: "https://recipenest.vercel.app",
    description:
      "A recipe sharing platform with ingredient search, step-by-step cooking mode and saved collections.",
    status: "APPROVED",
    createdDaysAgo: 25,
  },
  {
    student: 1,
    projectName: "TravelBuddy Planner",
    repo: "travelbuddy-planner",
    liveUrl: "https://travelbuddy-planner.vercel.app",
    description:
      "A trip planning app with itineraries, shared packing lists, maps and a budget estimator for groups.",
    status: "REJECTED",
    createdDaysAgo: 21,
  },
  {
    student: 1,
    projectName: "QuizMaster Platform",
    repo: "quizmaster-platform",
    liveUrl: "https://quizmaster-platform.vercel.app",
    description:
      "A quiz builder with timed questions, leaderboards, question banks and instant result breakdowns.",
    status: "PENDING",
    createdDaysAgo: 6,
  },
  {
    student: 1,
    projectName: "FitPulse Workout",
    repo: "fitpulse-workout",
    liveUrl: "https://fitpulse-workout.vercel.app",
    description:
      "A workout tracker with weekly plans, exercise logging, personal records and progress charts.",
    status: "APPROVED",
    createdDaysAgo: 19,
  },
  {
    student: 1,
    projectName: "BookShelf Library",
    repo: "bookshelf-library",
    liveUrl: "https://bookshelf-library.vercel.app",
    description:
      "A personal library manager with reading status, notes, ratings and a recommendation shelf.",
    status: "PENDING",
    createdDaysAgo: 8,
  },
  {
    student: 1,
    projectName: "EventLane Ticketing",
    repo: "eventlane-ticketing",
    liveUrl: "https://eventlane-ticketing.vercel.app",
    description:
      "An event ticketing flow with seat selection, QR check-in and an organiser sales overview.",
    status: "REJECTED",
    createdDaysAgo: 18,
  },
  {
    student: 2,
    projectName: "TeamSync Workspace",
    repo: "teamsync-workspace",
    liveUrl: "https://teamsync-workspace.vercel.app",
    description:
      "A team workspace with projects, threaded discussions, file sharing and role-based member permissions.",
    status: "APPROVED",
    createdDaysAgo: 23,
  },
  {
    student: 2,
    projectName: "ShopCart Checkout",
    repo: "shopcart-checkout",
    liveUrl: "https://shopcart-checkout.vercel.app",
    description:
      "A focused checkout experience with address forms, coupon codes, order review and payment states.",
    status: "PENDING",
    createdDaysAgo: 4,
  },
  {
    student: 2,
    projectName: "MovieMate Discovery",
    repo: "moviemate-discovery",
    liveUrl: "https://moviemate-discovery.vercel.app",
    description:
      "A movie discovery app with trending lists, genre filters, cast pages and a personal watchlist.",
    status: "APPROVED",
    createdDaysAgo: 17,
  },
  {
    student: 2,
    projectName: "BlogCraft CMS",
    repo: "blogcraft-cms",
    liveUrl: "https://blogcraft-cms.vercel.app",
    description:
      "A markdown blog platform with drafts, scheduled publishing, tags and reading time estimates.",
    status: "REJECTED",
    createdDaysAgo: 16,
  },
  {
    student: 2,
    projectName: "ResumeForge Builder",
    repo: "resumeforge-builder",
    liveUrl: "https://resumeforge-builder.vercel.app",
    description:
      "A resume builder with live preview, section reordering, ATS-friendly templates and PDF export.",
    status: "PENDING",
    createdDaysAgo: 9,
  },
  {
    student: 2,
    projectName: "HotelNest Booking",
    repo: "hotelnest-booking",
    liveUrl: "https://hotelnest-booking.vercel.app",
    description:
      "A hotel booking app with date-range search, room comparison, guest details and reservation history.",
    status: "REJECTED",
    createdDaysAgo: 15,
  },
  {
    student: 2,
    projectName: "PollPulse Voting",
    repo: "pollpulse-voting",
    liveUrl: "https://pollpulse-voting.vercel.app",
    description:
      "A live polling tool with anonymous votes, result charts, poll expiry and shareable result links.",
    status: "PENDING",
    createdDaysAgo: 11,
  },
  {
    student: 2,
    projectName: "JobTrack Applications",
    repo: "jobtrack-applications",
    liveUrl: "https://jobtrack-applications.vercel.app",
    description:
      "A job application tracker with stages, interview reminders, notes and a weekly activity summary.",
    status: "PENDING",
    createdDaysAgo: 1,
  },
];

async function main() {
  const mentorEmail = (process.env.SEED_MENTOR_EMAIL || "mentor@heroreview.dev").toLowerCase();
  const mentorPassword = process.env.SEED_MENTOR_PASSWORD || "Mentor@12345";
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || "admin@gmail.com").toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Ab123456";
  const studentPassword = process.env.SEED_STUDENT_PASSWORD || "Student@12345";

  const mentor = await prisma.user.upsert({
    where: { email: mentorEmail },
    update: {
      name: "Nusrat Jahan",
      role: Role.MENTOR,
      passwordHash: await bcrypt.hash(mentorPassword, 10),
    },
    create: {
      name: "Nusrat Jahan",
      email: mentorEmail,
      role: Role.MENTOR,
      passwordHash: await bcrypt.hash(mentorPassword, 10),
    },
  });

  // The brief seeds an admin; there is no separate ADMIN role, so the admin is
  // a second MENTOR account with its own credentials.
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Admin",
      role: Role.MENTOR,
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
    create: {
      name: "Admin",
      email: adminEmail,
      role: Role.MENTOR,
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
  });

  const studentPasswordHash = await bcrypt.hash(studentPassword, 10);
  const studentUsers = [];

  for (const student of students) {
    const user = await prisma.user.upsert({
      where: { email: student.email },
      update: {
        name: student.name,
        role: Role.STUDENT,
        passwordHash: studentPasswordHash,
      },
      create: {
        name: student.name,
        email: student.email,
        role: Role.STUDENT,
        passwordHash: studentPasswordHash,
      },
    });
    studentUsers.push(user);
  }

  for (const item of submissions) {
    const student = studentUsers[item.student];
    const repoUrl = `https://github.com/${students[item.student].username}/${item.repo}`;
    const repoUrlNormalized = normalizeRepoUrl(repoUrl);
    const createdAt = daysAgo(item.createdDaysAgo);
    const isReviewed = item.status !== "PENDING";

    await prisma.submission.upsert({
      where: {
        studentId_repoUrlNormalized: {
          studentId: student.id,
          repoUrlNormalized,
        },
      },
      update: {
        projectName: item.projectName,
        repoUrl,
        liveUrl: item.liveUrl,
        description: item.description,
        status: item.status,
        reviewedById: isReviewed ? mentor.id : null,
        reviewedAt: isReviewed ? daysAgo(Math.max(item.createdDaysAgo - 1, 0)) : null,
        createdAt,
      },
      create: {
        projectName: item.projectName,
        repoUrl,
        repoUrlNormalized,
        liveUrl: item.liveUrl,
        description: item.description,
        status: item.status,
        studentId: student.id,
        reviewedById: isReviewed ? mentor.id : null,
        reviewedAt: isReviewed ? daysAgo(Math.max(item.createdDaysAgo - 1, 0)) : null,
        createdAt,
      },
    });
  }

  const [users, total, pending, approved, rejected] = await Promise.all([
    prisma.user.count(),
    prisma.submission.count(),
    prisma.submission.count({ where: { status: "PENDING" } }),
    prisma.submission.count({ where: { status: "APPROVED" } }),
    prisma.submission.count({ where: { status: "REJECTED" } }),
  ]);

  console.log("Seed complete");
  console.log(`Users: ${users} (2 mentor accounts + ${studentUsers.length} students)`);
  console.log(`Submissions: ${total} (pending ${pending}, approved ${approved}, rejected ${rejected})`);
  console.log(`Mentor login: ${mentorEmail} / ${mentorPassword}`);
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
