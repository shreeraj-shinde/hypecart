import type mongoose from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface ISession {
  refreshTokenHash: string;
  ip?: string | undefined;
  userId?: mongoose.Types.ObjectId;
  agent?: string | undefined;
  revoked?: boolean;
  expiresAt: Date;
}

export interface IProduct {
  userId: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  description?: string;
  imageUrl?: string;
}

export enum TokenVariant {
  ACCESS_TOKEN = "ACCESS_TOKEN",
  REFRESH_TOKEN = "REFRESH_TOKEN",
}

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}
