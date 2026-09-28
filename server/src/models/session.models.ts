import mongoose, { Schema } from "mongoose";
import type { ISession } from "../types.js";

const sessionSchema = new mongoose.Schema<ISession>(
  {
    refreshTokenHash: {
      type: String,
      required: true,
      index: true,
    },
    ip: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    agent: {
      type: String,
    },
    revoked: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const sessionModel = mongoose.model<ISession>("Session", sessionSchema);

export default sessionModel;
