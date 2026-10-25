import express from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { healthRoutes } from "../modules/health/health.routes";
import { submissionRoutes } from "../modules/submission/submission.routes";

const router = express.Router();

const moduleRoutes = [
  { path: "/auth", route: authRoutes },
  { path: "/submissions", route: submissionRoutes },
  { path: "/health", route: healthRoutes },
];

for (const moduleRoute of moduleRoutes) {
  router.use(moduleRoute.path, moduleRoute.route);
}

export default router;
