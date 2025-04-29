import { create } from "zustand";
import { insightService } from "@/services/insightService";

interface InsightOverview {
  totalTeams: number;
  totalMembers: number;
  totalUpdates: number;
  activeUpdates: number;
  updateCompletionRate: number;
}

interface InsightState {
  overview: InsightOverview | null;
  isLoading: boolean;
  error: string | null;
  fetchOverview: () => Promise<void>;
}

export const useInsightStore = create<InsightState>((set) => ({
  overview: null,
  isLoading: false,
  error: null,
  fetchOverview: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await insightService.getOverview();
      set({ overview: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch overview", isLoading: false });
    }
  },
}));
