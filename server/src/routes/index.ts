import { Router } from "express";
import { healthRouter } from "./health.js";
import authRouter from "./auth.js";
import productsRouter from "./products.js";
import uploadsRouter from "./uploads.js";

export const apiRouter: Router = Router();

apiRouter.use("/health", healthRouter);

apiRouter.use("/auth", authRouter);

apiRouter.use("/products", productsRouter);

apiRouter.use("/uploads", uploadsRouter);
