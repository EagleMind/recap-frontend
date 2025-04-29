import { storage } from "@/storage/storage";
import { api } from "./api";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { User } from "@/types/User";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  invitationToken?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface JwtPayload {
  user: {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
    role: {
      _id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
      permissions: Array<{
        // Add permission structure if known
      }>;
    };
  };
  iat: number;
  exp: number;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const { data } = await api.post<{ token: string }>(
        "/auth/register",
        payload
      );
      const decoded = jwtDecode<JwtPayload>(data.token);
      console.log("Decoded Token:", decoded);
      const user: User = {
        id: decoded.user.id,
        name: decoded.user.name || "",
        email: decoded.user.email,
        isVerified: decoded.user.isVerified,
        role: decoded.user.role.name,
      };
      storage.set("authToken", data.token);
      storage.set("user", user);
      return { token: data.token, user };
    } catch (error) {
      throw new Error(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Registration failed"
      );
    }
  },

  async login(payload: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    try {
      const { data } = await api.post<{ token: string }>(
        "/auth/login",
        payload
      );
      const decoded = jwtDecode<JwtPayload>(data.token);
      console.log("Decoded Token:", decoded);
      const user: User = {
        id: decoded.user.id,
        name: decoded.user.name || "",
        email: decoded.user.email,
        isVerified: decoded.user.isVerified,
        role: decoded.user.role.name,
      };
      storage.set("authToken", data.token);
      storage.set("user", user);
      return { token: data.token, user };
    } catch (error) {
      throw new Error(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Login failed"
      );
    }
  },

  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post("/auth/forgot-password", { email });
    } catch (error) {
      throw new Error(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to send reset email"
      );
    }
  },

  async resetPassword(token: string, password: string): Promise<void> {
    try {
      await api.post("/auth/reset-password", { token, password });
    } catch (error) {
      throw new Error(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to reset password"
      );
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const { data } = await api.get<{
        _id: string;
        name: string;
        email: string;
        role: string;
      }>("/users/me");
      return {
        id: data._id,
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        isVerified: true,
      };
    } catch (error) {
      throw new Error(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to fetch user information"
      );
    }
  },
};
