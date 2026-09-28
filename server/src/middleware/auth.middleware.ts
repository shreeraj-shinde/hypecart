import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const authenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid Token",
        data: null,
      });
    }

    const decoded = jwt.verify(token, env.accessSecret!) as {
      id: string;
      sessionId: string;
    };

    req.userId = decoded.id;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token",
      data: null,
    });
  }
};
