import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { SubmissionService } from "./submission.service";
import type {
  CreateSubmissionInput,
  ListSubmissionsQuery,
  UpdateStatusInput,
} from "./submission.interface";

const create = catchAsync(async (req: Request, res: Response) => {
  const result = await SubmissionService.create(
    req.user!.id,
    req.validated!.body as CreateSubmissionInput,
  );

  sendResponse(res, 201, result);
});

const list = catchAsync(async (req: Request, res: Response) => {
  const result = await SubmissionService.list(
    req.validated!.query as ListSubmissionsQuery,
  );

  sendResponse(res, 200, { data: result.data }, result.meta);
});

const stats = catchAsync(async (_req: Request, res: Response) => {
  const result = await SubmissionService.stats();
  sendResponse(res, 200, result);
});

const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.validated!.params as { id: string };
  const result = await SubmissionService.updateStatus(
    id,
    req.user!.id,
    req.validated!.body as UpdateStatusInput,
  );

  sendResponse(res, 200, result);
});

export const SubmissionController = {
  create,
  list,
  stats,
  updateStatus,
};
