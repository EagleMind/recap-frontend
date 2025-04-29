import { create } from "zustand";
import { storage } from "@/storage/storage";
import { authService } from "@/services/authService";
import { showSuccess, showError } from "@/lib/toast";
import { User } from "@/types/User";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  initialize: () => void;
  fetchUserDetails: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,
  error: null,

  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authService.login(payload);
      set({ user, token, isAuthenticated: true, isInitialized: true });
      showSuccess("Authenticated!");
    } catch (error: any) {
      let errorMessage = "Authentication failed.";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message && typeof error.message === "string") {
        errorMessage = error.message;
      } else if (error?.code === "ECONNABORTED" || error?.message === "Network Error") {
        errorMessage = "Unable to connect to server. Please check your connection.";
      }
      set({
        error: errorMessage,
      });
      showError(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authService.register(payload);
      set({ user, token, isAuthenticated: true, isInitialized: true });
      showSuccess("Registered!");
    } catch (error: any) {
      let errorMessage = "Registration failed.";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message && typeof error.message === "string") {
        errorMessage = error.message;
      } else if (error?.code === "ECONNABORTED" || error?.message === "Network Error") {
        errorMessage = "Unable to connect to server. Please check your connection.";
      }
      set({
        error: errorMessage,
      });
      showError(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    storage.remove("authToken");
    storage.remove("user");
    set({ user: null, token: null, isAuthenticated: false, isInitialized: true });
  },

  clearError: () => set({ error: null }),

  initialize: () => {
    const token = storage.get<string>("authToken");
    const user = storage.get<User>("user");
    if (token && user) {
      set({ token, user, isAuthenticated: true, isInitialized: true });
    } else {
      set({ token: null, user: null, isAuthenticated: false, isInitialized: true });
    }
  },

  fetchUserDetails: async () => {
    set({ isLoading: true, error: null });
    try {
      const currentUser = get().user;
      if (!currentUser) {
        throw new Error("No authenticated user");
      }

      const apiUser = await authService.getCurrentUser();
      const updatedUser: User = {
        id: apiUser.id,
        _id: apiUser._id,
        name: apiUser.name || currentUser.name,
        email: apiUser.email,
        role: apiUser.role,
        isVerified: apiUser.isVerified,
      };

      set({ user: updatedUser });
      storage.set("user", updatedUser);
      showSuccess("User details updated!");
    } catch (error) {
      let errorMessage = "Failed to fetch user details.";
      if (error instanceof Error) errorMessage = error.message;
      set({
        error: errorMessage,
      });
      showError(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },
}));
