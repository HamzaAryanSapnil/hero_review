import type { NextFunction, Request, Response } from "express";
import type { Role } from "@prisma/client";
import { ApiError } from "../errors/ApiError";

export const requireRole = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new ApiError(401, "UNAUTHORIZED", "Please sign in to continue."));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new ApiError(403, "FORBIDDEN", "You do not have permission to perform this action."));
      return;
    }

    next();
  };
};
