import axios from "axios";
import { storage } from "@/storage/storage";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = storage.get<string>("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token refresh (if needed)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration or unauthorized access
      storage.remove("authToken");
      storage.remove("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
