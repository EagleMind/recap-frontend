import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "sonner";
import { RouterProvider } from "react-router-dom";
import { router } from "@/config/router";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";

function App() {
  const { initialize, isInitialized, isAuthenticated } = useAuthStore();
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      fetchUser();
    }
  }, [isInitialized, isAuthenticated, fetchUser]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster position="top-center" richColors />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
