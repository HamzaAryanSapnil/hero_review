export type Role = "STUDENT" | "MENTOR";

export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
};

export type Submission = {
  id: string;
  projectName: string;
  repoUrl: string;
  liveUrl: string;
  description: string;
  status: SubmissionStatus;
  createdAt: string;
  updatedAt: string;
  reviewedAt: string | null;
  student: {
    name: string;
    email: string;
  };
  reviewedBy: {
    name: string;
  } | null;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ListSubmissionsResponse = {
  data: Submission[];
  meta: PaginationMeta;
};

export type SubmissionStats = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};
