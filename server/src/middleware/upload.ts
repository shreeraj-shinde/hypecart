import multer from "multer";
import type { NextFunction, Request, Response } from "express";
import { HttpError } from "./errorHandler.js";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new HttpError(400, "Only JPEG, PNG, WEBP, or GIF images are allowed"));
      return;
    }
    cb(null, true);
  },
}).single("image");

export const uploadImage = (req: Request, res: Response, next: NextFunction) => {
  multerUpload(req, res, (error: unknown) => {
    if (!error) return next();
    if (error instanceof multer.MulterError) {
      return next(new HttpError(400, error.message));
    }
    return next(error);
  });
};
