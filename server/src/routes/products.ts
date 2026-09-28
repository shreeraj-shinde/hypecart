import { Router } from "express";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controllers.js";
import {
  createProductValidator,
  updateProductValidator,
} from "../validators/product.validators.js";
import { authenticated } from "../middleware/auth.middleware.js";

const productsRouter = Router();

productsRouter.use(authenticated);

productsRouter.get("/", listProducts);
productsRouter.get("/:id", getProduct);
productsRouter.post("/", createProductValidator, createProduct);
productsRouter.patch("/:id", updateProductValidator, updateProduct);
productsRouter.delete("/:id", deleteProduct);

export default productsRouter;
