import { Prisma } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import { ApiError } from "../../errors/ApiError";
import { normalizeRepoUrl } from "../../shared/normalizeRepoUrl";
import type {
  CreateSubmissionInput,
  ListSubmissionsQuery,
  UpdateStatusInput,
} from "./submission.interface";

const submissionSelect = {
  id: true,
  projectName: true,
  repoUrl: true,
  liveUrl: true,
  description: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  reviewedAt: true,
  student: {
    select: {
      name: true,
      email: true,
    },
  },
  reviewedBy: {
    select: {
      name: true,
    },
  },
} satisfies Prisma.SubmissionSelect;

const create = async (studentId: string, input: CreateSubmissionInput) => {
  const repoUrlNormalized = normalizeRepoUrl(input.repoUrl);

  const existing = await prisma.submission.findUnique({
    where: {
      studentId_repoUrlNormalized: {
        studentId,
        repoUrlNormalized,
      },
    },
    select: { id: true },
  });

  if (existing) {
    throw new ApiError(
      409,
      "DUPLICATE_SUBMISSION",
      "You have already submitted this repository.",
      { repoUrl: ["You have already submitted this repository."] },
    );
  }

  try {
    const submission = await prisma.submission.create({
      data: {
        projectName: input.projectName,
        repoUrl: input.repoUrl,
        repoUrlNormalized,
        liveUrl: input.liveUrl,
        description: input.description,
        studentId,
      },
      select: submissionSelect,
    });

    return { submission };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new ApiError(
        409,
        "DUPLICATE_SUBMISSION",
        "You have already submitted this repository.",
        { repoUrl: ["You have already submitted this repository."] },
      );
    }
    throw error;
  }
};

const list = async (query: ListSubmissionsQuery) => {
  const where: Prisma.SubmissionWhereInput =
    query.status === "ALL" ? {} : { status: query.status };

  const [data, total] = await prisma.$transaction([
    prisma.submission.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      select: submissionSelect,
    }),
    prisma.submission.count({ where }),
  ]);

  return {
    data,
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
};

const stats = async () => {
  const grouped = await prisma.submission.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  const counts = { PENDING: 0, APPROVED: 0, REJECTED: 0 };

  for (const row of grouped) {
    counts[row.status] = row._count._all;
  }

  return {
    total: counts.PENDING + counts.APPROVED + counts.REJECTED,
    pending: counts.PENDING,
    approved: counts.APPROVED,
    rejected: counts.REJECTED,
  };
};

const updateStatus = async (
  submissionId: string,
  reviewerId: string,
  input: UpdateStatusInput,
) => {
  // updateMany is atomic: two mentors clicking at the same time cannot both win.
  const result = await prisma.submission.updateMany({
    where: { id: submissionId, status: "PENDING" },
    data: {
      status: input.status,
      reviewedById: reviewerId,
      reviewedAt: new Date(),
    },
  });

  if (result.count === 0) {
    const existing = await prisma.submission.findUnique({
      where: { id: submissionId },
      select: { status: true },
    });

    if (!existing) {
      throw new ApiError(404, "NOT_FOUND", "Submission not found.");
    }

    throw new ApiError(
      409,
      "ALREADY_REVIEWED",
      "This submission has already been reviewed.",
    );
  }

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    select: submissionSelect,
  });

  if (!submission) {
    throw new ApiError(404, "NOT_FOUND", "Submission not found.");
  }

  return { submission };
};

export const SubmissionService = {
  create,
  list,
  stats,
  updateStatus,
};
