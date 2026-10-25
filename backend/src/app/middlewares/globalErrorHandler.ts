import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { ApiError, type FieldErrors } from "../errors/ApiError";

const errorBody = (code: string, message: string, fields?: FieldErrors) => ({
  error: {
    code,
    message,
    ...(fields && Object.keys(fields).length > 0 ? { fields } : {}),
  },
});

const zodFields = (error: ZodError): FieldErrors => {
  const fields: FieldErrors = {};

  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : "form";
    fields[key] = [...(fields[key] ?? []), issue.message];
  }

  return fields;
};

const globalErrorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json(errorBody(error.code, error.message, error.fields));
    return;
  }

  if (error instanceof ZodError) {
    res.status(422).json(
      errorBody("VALIDATION_ERROR", "Please check the highlighted fields.", zodFields(error)),
    );
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = Array.isArray(error.meta?.target) ? error.meta.target.join(",") : "";
      const isEmail = target.includes("email");
      res
        .status(409)
        .json(
          errorBody(
            isEmail ? "EMAIL_TAKEN" : "DUPLICATE_SUBMISSION",
            isEmail ? "This email is already registered." : "This repository was already submitted.",
          ),
        );
      return;
    }

    if (error.code === "P2025") {
      res.status(404).json(errorBody("NOT_FOUND", "The requested resource was not found."));
      return;
    }
  }

  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json(errorBody("INVALID_JSON", "Request body must be valid JSON."));
    return;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    (error as { type?: string }).type === "entity.too.large"
  ) {
    res.status(413).json(errorBody("PAYLOAD_TOO_LARGE", "Request body is too large."));
    return;
  }

  console.error("Unhandled API error:", error);
  res.status(500).json(errorBody("INTERNAL_ERROR", "Something went wrong. Please try again."));
};

export default globalErrorHandler;
