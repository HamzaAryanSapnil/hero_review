import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

type ValidationSchemas = {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
};

/**
 * Express 5 exposes req.query as a getter, so parsed values are stored on
 * req.validated instead of overwriting the original properties.
 */
export const validateRequest = (schemas: ValidationSchemas) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.validated = {
        body: schemas.body ? schemas.body.parse(req.body) : undefined,
        query: schemas.query ? schemas.query.parse(req.query) : undefined,
        params: schemas.params ? schemas.params.parse(req.params) : undefined,
      };
      next();
    } catch (error) {
      next(error);
    }
  };
};
