import { create } from "zustand";
import { fetchRecapsApi, RecapApiModel } from "@/services/recapsService";

import type { Recap } from "@/types/recap";
import { showSuccess, showError } from "@/lib/toast";

export interface RecapsStoreState {
  recapsByDate: Record<string, Recap[]>;
  loading: boolean;
  error?: string;
  success?: string;
  fetchRecaps: () => Promise<void>;
  createRecap: (data: Partial<Recap>) => Promise<void>;
  updateRecap: (id: string, data: Partial<Recap>) => Promise<void>;
  deleteRecap: (id: string) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
}

function groupByDate(recaps: Recap[]): Record<string, Recap[]> {
  return recaps.reduce((acc, recap) => {
    if (!acc[recap.date]) acc[recap.date] = [];
    acc[recap.date].push(recap);
    return acc;
  }, {} as Record<string, Recap[]>);
}

function toRecap(r: RecapApiModel): Recap {
  // Group by date (YYYY-MM-DD) from createdAt
  const date = r.createdAt.slice(0, 10);
  return {
    _id: r._id,
    title: r.title,
    assignedTo: typeof r.assignedTo === "object" && r.assignedTo !== null ? r.assignedTo.name : String(r.assignedTo),
    description: r.description,
    date,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    createdBy: typeof r.createdBy === "object" && r.createdBy !== null ? r.createdBy.name : String(r.createdBy ?? ""),
    team: typeof r.team === "object" && r.team !== null ? r.team.name : String(r.team ?? ""),
  };
}

import { createRecapApi, updateRecapApi, deleteRecapApi } from "@/services/recapsService";

export const useRecapsStore = create<RecapsStoreState>((set, get) => ({
  recapsByDate: {},
  loading: false,
  error: undefined,
  success: undefined,
  fetchRecaps: async () => {
    set({ loading: true });
    try {
      const data = await fetchRecapsApi();
      const recaps = data.map(toRecap);
      set({ recapsByDate: groupByDate(recaps), loading: false });
    } catch (err) {
      set({ loading: false, error: "Failed to fetch recaps." });
      showError("Failed to fetch recaps.");
    }
  },
  createRecap: async (data) => {
    set({ loading: true, error: undefined, success: undefined });
    try {
      const recap = await createRecapApi(data);
      set({ recapsByDate: groupByDate([toRecap(recap), ...Object.values(get().recapsByDate).flat()]), loading: false, success: "Recap created." });
      showSuccess("Recap created!");
    } catch (err) {
      set({ loading: false, error: "Failed to create recap." });
      showError("Failed to create recap.");
    }
  },
  updateRecap: async (id, data) => {
    set({ loading: true, error: undefined, success: undefined });
    try {
      const recap = await updateRecapApi(id, data);
      // Update only the specific recap in recapsByDate
      const prev = get().recapsByDate;
      let found = false;
      const newRecapsByDate = Object.fromEntries(
        Object.entries(prev).map(([date, recaps]) => {
          const updated = recaps.map(r => {
            if (r._id === id) {
              found = true;
              return toRecap(recap);
            }
            return r;
          });
          return [date, updated];
        })
      );
      // If recap date changed, regroup
      if (found && toRecap(recap).date && !newRecapsByDate[toRecap(recap).date]?.some(r => r._id === id)) {
        // Remove from old date
        for (const date in newRecapsByDate) {
          newRecapsByDate[date] = newRecapsByDate[date].filter(r => r._id !== id);
        }
        // Add to new date
        if (!newRecapsByDate[toRecap(recap).date]) newRecapsByDate[toRecap(recap).date] = [];
        newRecapsByDate[toRecap(recap).date].push(toRecap(recap));
      }
      set({ recapsByDate: newRecapsByDate, loading: false, success: "Recap updated." });
      showSuccess("Recap updated!");
    } catch (err) {
      set({ loading: false, error: "Failed to update recap." });
      showError("Failed to update recap.");
    }
  },
  deleteRecap: async (id) => {
    set({ loading: true, error: undefined, success: undefined });
    try {
      await deleteRecapApi(id);
      const allRecaps = Object.values(get().recapsByDate).flat();
      const filteredRecaps = allRecaps.filter((r) => r._id !== id);
      set({ recapsByDate: groupByDate(filteredRecaps), loading: false, success: "Recap deleted." });
      showSuccess("Recap deleted!");
    } catch (err) {
      set({ loading: false, error: "Failed to delete recap." });
      showError("Failed to delete recap.");
    }
  },
  clearError: () => set({ error: undefined }),
  clearSuccess: () => set({ success: undefined }),
}));
