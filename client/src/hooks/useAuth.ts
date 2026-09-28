import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { loginThunk, logoutThunk, signupThunk } from "../state/authSlice";
import type { LoginPayload, SignupPayload } from "../api/authApi";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, accessToken, status, error, bootstrapped } = useAppSelector(
    (state) => state.auth,
  );

  const login = useCallback(
    (payload: LoginPayload) => dispatch(loginThunk(payload)),
    [dispatch],
  );

  const signup = useCallback(
    (payload: SignupPayload) => dispatch(signupThunk(payload)),
    [dispatch],
  );

  const logout = useCallback(() => dispatch(logoutThunk()), [dispatch]);

  return {
    user,
    isAuthenticated: Boolean(accessToken),
    status,
    error,
    bootstrapped,
    login,
    signup,
    logout,
  };
};
