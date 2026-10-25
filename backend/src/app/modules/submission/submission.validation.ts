import { z } from "zod";

const repoUrlSchema = z
  .string()
  .trim()
  .regex(
    /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\.git)?\/?$/,
    "Use a GitHub repository URL like https://github.com/owner/repo.",
  );

const liveUrlSchema = z
  .string()
  .trim()
  .refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && url.hostname.includes(".");
    } catch {
      return false;
    }
  }, "Live link must be a valid https:// URL.");

export const createSubmissionSchema = z.object({
  projectName: z
    .string()
    .trim()
    .min(3, "Project name must be at least 3 characters.")
    .max(80, "Project name must be at most 80 characters."),
  repoUrl: repoUrlSchema,
  liveUrl: liveUrlSchema,
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters.")
    .max(1000, "Description must be at most 1000 characters."),
});

const emptyToUndefined = (value: unknown) =>
  value === undefined || value === "" || value === null ? undefined : value;

export const listSubmissionsQuerySchema = z.object({
  status: z.preprocess(
    emptyToUndefined,
    z.enum(["ALL", "PENDING", "APPROVED", "REJECTED"]).default("ALL"),
  ),
  page: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int("Page must be a whole number.").min(1, "Page must be at least 1.").default(1),
  ),
  limit: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number()
      .int("Limit must be a whole number.")
      .min(1, "Limit must be at least 1.")
      .max(50, "Limit must be at most 50.")
      .default(10),
  ),
});

export const submissionIdParamsSchema = z.object({
  id: z.string().min(1, "Submission id is required."),
});

export const updateSubmissionStatusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"], {
    message: "Status must be APPROVED or REJECTED.",
  }),
});
