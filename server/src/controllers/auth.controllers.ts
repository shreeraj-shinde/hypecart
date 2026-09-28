import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import { createUser } from "../services/user.services.js";
import { createToken } from "../utils.js";
import { TokenVariant } from "../types.js";
import { env } from "../config/env.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import crypto from "crypto";
import sessionModel from "../models/session.models.js";

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUser({ email, name, password: hashedPassword });

  const refreshToken = createToken(TokenVariant.REFRESH_TOKEN, { id: user.id });

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await sessionModel.create({
    refreshTokenHash,
    userId: user.id,
    ip: req.ip,
    agent: req.headers["user-agent"],
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const accessToken = createToken(TokenVariant.ACCESS_TOKEN, {
    id: user.id,
    sessionId: session.id,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: true,
    secure: env.nodeEnv === "production",
  });

  return res.status(201).json({
    success: true,
    message: "User Created Successfully",
    data: {
      name: user.name,
      email: user.email,
      accessToken,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  // Schema validated
  const { email, password } = req.body;

  // find User
  const user = await userModel.findOne({ email });

  if (!user)
    return res.status(404).json({
      success: false,
      message: "User not found",
      data: null,
    });
  // Compare Password
  const authenticated = await bcrypt.compare(password, user.password);

  if (!authenticated) {
    return res.status(401).json({
      success: false,
      message: "Invalid Credentials",
      data: null,
    });
  }

  const refreshToken = createToken(TokenVariant.REFRESH_TOKEN, { id: user.id });

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await sessionModel.create({
    refreshTokenHash,
    userId: user.id,
    ip: req.ip,
    agent: req.headers["user-agent"],
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const accessToken = createToken(TokenVariant.ACCESS_TOKEN, {
    id: user.id,
    sessionId: session.id,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: true,
    secure: env.nodeEnv === "production",
  });

  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: {
      name: user.name,
      email: user.email,
      accessToken,
    },
  });
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies["refreshToken"];

  if (!token)
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      data: null,
    });

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  let decoded: JwtPayload & { id: string };
  try {
    decoded = jwt.verify(token, env.refrehSecret!) as JwtPayload & {
      id: string;
    };
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      data: null,
    });
  }

  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoked: false,
  });

  if (!session)
    return res.status(401).json({
      success: false,
      message: "Session revoked or not found",
      data: null,
    });

  const accessToken = createToken(TokenVariant.ACCESS_TOKEN, {
    id: decoded.id,
    sessionId: session.id,
  });

  const refreshToken = createToken(TokenVariant.REFRESH_TOKEN, {
    id: decoded.id,
  });

  const refreshTokenHashNew = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  session.refreshTokenHash = refreshTokenHashNew;
  await session.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: true,
    secure: env.nodeEnv === "production",
  });

  return res.status(200).json({
    success: true,
    message: "Authenticated",
    data: {
      accessToken,
    },
  });
};

export const logout = async (req: Request, res: Response) => {
  try {
    // Extracting userID

    const userId = req.userId;
    const refreshToken = req.cookies["refreshToken"];
    const refreshTokenhash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    if (!userId)
      return res.status(401).json({
        message: "Unauthorized",
        data: null,
      });

    const session = await sessionModel.findOne({
      userId,
      refreshTokenHash: refreshTokenhash,
      revoked: false,
    });

    if (!session)
      return res.status(404).json({
        message: "Session not found",
        data: null,
      });

    session.revoked = true;

    await session.save();

    res.clearCookie("refreshToken");

    return res.status(201).json({
      message: "Logged out Successfully",
      data: null,
    });
  } catch (error) {}
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const userData = await userModel.findById(userId);

    if (!userData)
      return res.status(404).json({
        message: "User not found",
        data: null,
      });

    return res.status(200).json({
      data: {
        email: userData.email,
        name: userData.name,
        role: userData.role,
      },
    });
  } catch (error) {}
};
