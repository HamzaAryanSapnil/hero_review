import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/ApiError";
import { verifyToken } from "../shared/jwt";

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    next(new ApiError(401, "UNAUTHORIZED", "Please sign in to continue."));
    return;
  }

  const token = header.slice("Bearer ".length).trim();

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new ApiError(401, "UNAUTHORIZED", "Your session is invalid or has expired."));
  }
};
