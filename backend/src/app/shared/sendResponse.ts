import type { Response } from "express";

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const sendResponse = <T extends object>(
  res: Response,
  statusCode: number,
  body: T,
  meta?: PaginationMeta,
) => {
  res.status(statusCode).json(meta ? { ...body, meta } : body);
};

export default sendResponse;
