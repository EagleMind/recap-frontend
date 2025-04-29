import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      navigate("/hub");
    }
  }, [isAuthenticated, isInitialized, navigate]);

  if (!isInitialized) return null; // or a spinner

  return !isAuthenticated ? <>{children}</> : null;
}
