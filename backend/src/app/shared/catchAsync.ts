import type { NextFunction, Request, RequestHandler, Response } from "express";

const catchAsync = (handler: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default catchAsync;
