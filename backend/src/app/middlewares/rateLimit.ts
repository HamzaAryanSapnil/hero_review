import rateLimit, { type RateLimitExceededEventHandler } from "express-rate-limit";

const onLimitReached: RateLimitExceededEventHandler = (_req, res) => {
  res.status(429).json({
    error: {
      code: "RATE_LIMITED",
      message: "Too many requests. Please wait a moment and try again.",
    },
  });
};

/**
 * Every request reaches Express through the Next.js server, so all users share
 * one IP address. Submission limits are therefore keyed by the authenticated
 * user id, which is only available after the authenticate middleware.
 */
export const submissionLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user!.id,
  handler: onLimitReached,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: onLimitReached,
});
