export type FieldErrors = Record<string, string[]>;

export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly fields?: FieldErrors;

  constructor(statusCode: number, code: string, message: string, fields?: FieldErrors) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.fields = fields;
    Error.captureStackTrace(this, this.constructor);
  }
}
