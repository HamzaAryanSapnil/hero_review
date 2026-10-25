import type { SubmissionStatus } from "@prisma/client";

export type CreateSubmissionInput = {
  projectName: string;
  repoUrl: string;
  liveUrl: string;
  description: string;
};

export type ListSubmissionsQuery = {
  status: SubmissionStatus | "ALL";
  page: number;
  limit: number;
};

export type UpdateStatusInput = {
  status: "APPROVED" | "REJECTED";
};
