import Router from "express";
import {
  signup,
  login,
  refresh,
  logout,
  getMe
} from "../controllers/auth.controllers.js";
import {
  loginValidator,
  signupValidator,
} from "../validators/auth.validators.js";
import { authenticated } from "../middleware/auth.middleware.js";
const authRouter = Router();

// [GET] "/me"

// [POST] "/register"
authRouter.post("/signup", signupValidator, signup);

authRouter.post("/login", loginValidator, login);

authRouter.get("/refresh", refresh);

authRouter.get("/logout", authenticated, logout);

authRouter.get("/me", authenticated, getMe);

export default authRouter;
