import { Router } from "express";
import { uploadProductImage } from "../controllers/upload.controllers.js";
import { uploadImage } from "../middleware/upload.js";
import { authenticated } from "../middleware/auth.middleware.js";

const uploadsRouter = Router();

uploadsRouter.post("/image", authenticated, uploadImage, uploadProductImage);

export default uploadsRouter;
