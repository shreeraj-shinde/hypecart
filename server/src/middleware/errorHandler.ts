import type { NextFunction, Request, Response } from "express";
import { isProduction } from "../config/env.js";

export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const status = err instanceof HttpError ? err.status : 500;
  const message =
    err instanceof HttpError
      ? err.message
      : isProduction
        ? "Internal server error"
        : err instanceof Error
          ? err.message
          : "Unknown error";

  if (status >= 500) {
    req.log.error(err);
  }

  res.status(status).json({ error: { status, message } });
};
