import { type NextFunction, type Request, type Response } from "express";
import { cloudinary } from "../config/cloudinary.js";
import { HttpError } from "../middleware/errorHandler.js";

export const uploadProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      throw new HttpError(400, "No image file provided");
    }

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `hypecart/${req.userId}`,
            resource_type: "image",
          },
          (error, uploadResult) => {
            if (error || !uploadResult) return reject(error);
            resolve(uploadResult);
          },
        );
        stream.end(req.file!.buffer);
      },
    );

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: { url: result.secure_url, publicId: result.public_id },
    });
  } catch (error) {
    next(error);
  }
};
