import mongoose from "mongoose";
import { type IUser, Role } from "../types.js";

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    require: [true, "Name is required"],
  },

  email: {
    type: String,
    require: [true, "Email is required"],
    unique: [true, "Email should be unique"],
    lowercase: true,
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },

  role: {
    type: String,
    default: Role.USER,
  },
});

const userModel = mongoose.model<IUser>("User", userSchema);

export default userModel;
