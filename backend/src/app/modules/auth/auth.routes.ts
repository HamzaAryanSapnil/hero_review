import express from "express";
import { authenticate } from "../../middlewares/authenticate";
import { authLimiter } from "../../middlewares/rateLimit";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { loginSchema, signupSchema } from "./auth.validation";

const router = express.Router();

router.post(
  "/signup",
  authLimiter,
  validateRequest({ body: signupSchema }),
  AuthController.signup,
);

router.post(
  "/login",
  authLimiter,
  validateRequest({ body: loginSchema }),
  AuthController.login,
);

router.get("/me", authenticate, AuthController.me);

export const authRoutes = router;
