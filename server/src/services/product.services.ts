import crypto from "crypto";
import productModel from "../models/product.model.js";
import { HttpError } from "../middleware/errorHandler.js";

const generateSku = () =>
  `HC-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

export const listProducts = (userId: string) =>
  productModel.find({ userId }).sort({ createdAt: -1 });

export const getOwnedProduct = async (userId: string, productId: string) => {
  const product = await productModel.findOne({ _id: productId, userId });
  if (!product) throw new HttpError(404, "Product not found");
  return product;
};

export const createProduct = ({
  userId,
  name,
  category,
  price,
  stock,
  description,
  imageUrl,
}: {
  userId: string;
  name: string;
  category: string;
  price: number;
  stock?: number;
  description?: string;
  imageUrl?: string;
}) =>
  productModel.create({
    userId,
    name,
    category,
    price,
    stock: stock ?? 0,
    description: description ?? "",
    sku: generateSku(),
    ...(imageUrl ? { imageUrl } : {}),
  });

export const updateProduct = async (
  userId: string,
  productId: string,
  updates: Partial<{
    name: string;
    category: string;
    price: number;
    stock: number;
    description: string;
    imageUrl: string;
  }>,
) => {
  const product = await getOwnedProduct(userId, productId);
  Object.assign(product, updates);
  await product.save();
  return product;
};

export const deleteProduct = async (userId: string, productId: string) => {
  const product = await productModel.findOneAndDelete({
    _id: productId,
    userId,
  });
  if (!product) throw new HttpError(404, "Product not found");
  return product;
};
