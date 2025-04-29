import { create } from "zustand";
import { fetchManagerInsights, RecapInsight } from "../services/managerInsightsService";

interface ManagerInsightsState {
  insights: RecapInsight | null;
  loading: boolean;
  error: string | null;
  fetchInsights: () => Promise<void>;
}

export const useManagerInsightsStore = create<ManagerInsightsState>((set) => ({
  insights: null,
  loading: false,
  error: null,
  fetchInsights: async () => {
    set({ loading: true, error: null });
    try {
      const insights = await fetchManagerInsights();
      set({ insights, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to load insights", loading: false });
    }
  },
}));
