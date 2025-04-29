import { create } from "zustand";
import type { Recap } from "@/types/recap";
import { api } from "@/services/api";
import { showSuccess, showError } from "@/lib/toast";

interface PinsState {
  pinnedRecaps: Recap[];
  loading: boolean;
  error: string | null;
  fetchPins: () => Promise<void>;
  pinRecap: (recapId: string) => Promise<void>;
  unpinRecap: (recapId: string) => Promise<void>;
}

export const usePinsStore = create<PinsState>((set, get) => ({
  pinnedRecaps: [],
  loading: false,
  error: null,

  fetchPins: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get<Recap[]>("/pins");
      set({ pinnedRecaps: res.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      showError(error.message || "Failed to load pins.");
    }
  },

  pinRecap: async (recapId: string) => {
    set({ loading: true, error: null });
    try {
      await api.post(`/pins/${recapId}`);
      await get().fetchPins();
      showSuccess("Recap pinned!");
    } catch (error: any) {
      set({ error: error.message, loading: false });
      showError(error.message || "Failed to pin recap.");
    }
  },

  unpinRecap: async (recapId: string) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/pins/${recapId}`);
      await get().fetchPins();
      showSuccess("Recap unpinned!");
    } catch (error: any) {
      set({ error: error.message, loading: false });
      showError(error.message || "Failed to unpin recap.");
    }
  },
}));
