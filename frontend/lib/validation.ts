import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(60, "Name must be at most 60 characters."),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be at most 72 characters."),
});

export const loginFieldSchemas = {
  email: loginSchema.shape.email,
  password: loginSchema.shape.password,
};

export const signupFieldSchemas = {
  name: signupSchema.shape.name,
  email: signupSchema.shape.email,
  password: signupSchema.shape.password,
};

const repoUrlSchema = z
  .string()
  .trim()
  .regex(
    /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\.git)?\/?$/,
    "Use a GitHub URL like https://github.com/owner/repo.",
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
  }, "Enter a valid https:// URL.");

export const submissionSchema = z.object({
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

export const submissionFieldSchemas = {
  projectName: submissionSchema.shape.projectName,
  repoUrl: submissionSchema.shape.repoUrl,
  liveUrl: submissionSchema.shape.liveUrl,
  description: submissionSchema.shape.description,
};

export const updateStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["APPROVED", "REJECTED"]),
});

export const toFieldErrors = (error: z.ZodError): Record<string, string[]> => {
  const fields: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : "form";
    fields[key] = [...(fields[key] ?? []), issue.message];
  }

  return fields;
};
