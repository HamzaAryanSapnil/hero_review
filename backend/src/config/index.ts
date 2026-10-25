import dotenv from "dotenv";

dotenv.config();

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const config = {
  port: Number(process.env.PORT || 4000),
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: "1d" as const,
  demoDelayMs: Number(process.env.DEMO_DELAY_MS || 0),
  seed: {
    mentorEmail: process.env.SEED_MENTOR_EMAIL || "mentor@heroreview.dev",
    mentorPassword: process.env.SEED_MENTOR_PASSWORD || "Mentor@12345",
    studentPassword: process.env.SEED_STUDENT_PASSWORD || "Student@12345",
  },
};

export default config;
