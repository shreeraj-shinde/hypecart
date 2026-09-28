import { type IUser } from "../types.js";
import userModel from "../models/user.model.js";

// Creating New User
export const createUser = async ({ name, email, password }: IUser) => {
  const user = await userModel.create({ name, email, password });
  return user;
};
