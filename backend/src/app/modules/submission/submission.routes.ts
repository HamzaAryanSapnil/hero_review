import express from "express";
import { authenticate } from "../../middlewares/authenticate";
import { requireRole } from "../../middlewares/requireRole";
import { submissionLimiter } from "../../middlewares/rateLimit";
import { validateRequest } from "../../middlewares/validateRequest";
import { SubmissionController } from "./submission.controller";
import {
  createSubmissionSchema,
  listSubmissionsQuerySchema,
  submissionIdParamsSchema,
  updateSubmissionStatusSchema,
} from "./submission.validation";

const router = express.Router();

router.post(
  "/",
  authenticate,
  requireRole("STUDENT"),
  submissionLimiter,
  validateRequest({ body: createSubmissionSchema }),
  SubmissionController.create,
);

router.get(
  "/",
  authenticate,
  requireRole("MENTOR"),
  validateRequest({ query: listSubmissionsQuerySchema }),
  SubmissionController.list,
);

router.get("/stats", authenticate, requireRole("MENTOR"), SubmissionController.stats);

router.patch(
  "/:id/status",
  authenticate,
  requireRole("MENTOR"),
  validateRequest({ params: submissionIdParamsSchema, body: updateSubmissionStatusSchema }),
  SubmissionController.updateStatus,
);

export const submissionRoutes = router;
