import express from "express";
import { HealthController } from "./health.controller";

const router = express.Router();

router.get("/", HealthController.health);

export const healthRoutes = router;
