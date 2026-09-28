import { env } from "./config/env.js";
import { TokenVariant } from "./types.js";
import jwt from "jsonwebtoken";

export const createToken = <T extends object>(
  variant: TokenVariant,
  payload: T,
) => {
  let token = null;
  if (variant === TokenVariant.ACCESS_TOKEN) {
    token = jwt.sign(payload, env.accessSecret!, {
      expiresIn: "15m",
    });
  } else {
    token = jwt.sign(payload, env.refrehSecret!, {
      expiresIn: "7d",
    });
  }
  return token;
};
