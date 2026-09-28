import { axiosInstance } from "./axiosInstance";

export interface AuthUser {
  name: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthUser & { accessToken: string };
}

interface RefreshResponse {
  success: boolean;
  message: string;
  data: { accessToken: string };
}

interface MeResponse {
  data: AuthUser & { role?: string };
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const signup = async (payload: SignupPayload) => {
  const response = await axiosInstance.post<AuthResponse>(
    "/auth/signup",
    payload,
  );
  return response.data.data;
};

export const login = async (payload: LoginPayload) => {
  const response = await axiosInstance.post<AuthResponse>(
    "/auth/login",
    payload,
  );
  return response.data.data;
};

export const refresh = async () => {
  const response = await axiosInstance.get<RefreshResponse>("/auth/refresh");
  return response.data.data;
};

export const logout = async () => {
  await axiosInstance.get("/auth/logout");
};

export const me = async () => {
  const response = await axiosInstance.get<MeResponse>("/auth/me");
  return response.data.data;
};
