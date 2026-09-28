import { type NextFunction, type Request, type Response } from "express";
import mongoose from "mongoose";
import { HttpError } from "../middleware/errorHandler.js";
import * as productService from "../services/product.services.js";

const getProductId = (req: Request): string => {
  const id = req.params.id;
  if (typeof id !== "string" || !mongoose.isValidObjectId(id)) {
    throw new HttpError(400, "Invalid product id");
  }
  return id;
};

export const listProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await productService.listProducts(req.userId!);
    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = getProductId(req);
    const product = await productService.getOwnedProduct(req.userId!, id);
    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, category, price, stock, description, imageUrl } = req.body;
    const product = await productService.createProduct({
      userId: req.userId!,
      name,
      category,
      price,
      stock,
      description,
      imageUrl,
    });
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = getProductId(req);
    const { name, category, price, stock, description, imageUrl } = req.body;
    const updates = Object.fromEntries(
      Object.entries({ name, category, price, stock, description, imageUrl }).filter(
        ([, value]) => value !== undefined,
      ),
    );
    const product = await productService.updateProduct(
      req.userId!,
      id,
      updates,
    );
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = getProductId(req);
    await productService.deleteProduct(req.userId!, id);
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
