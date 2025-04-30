import { create } from "zustand";
import type { Recap } from "@/types/recap";
import { api } from "@/services/api";
import { showSuccess, showError } from "@/lib/toast";
import { pinsService } from "@/services/pinsService";

interface PinsState {
  pinnedRecaps: Recap[];
  loading: boolean;
  error: string | null;
  fetchPins: () => Promise<void>;
  pinRecap: (recapId: string) => Promise<void>;
  unpinRecap: (recapId: string) => Promise<void>;
  reorderPins: (recapIds: string[]) => Promise<void>;
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

  reorderPins: async (recapIds: string[]) => {
    set({ loading: true, error: null });
    try {
      await pinsService.reorderPins(recapIds);
      // Reorder locally
      const current = get().pinnedRecaps;
      const ordered = recapIds
        .map((id) => current.find((r) => r._id === id))
        .filter(Boolean) as Recap[];
      set({ pinnedRecaps: ordered, loading: false });
      showSuccess("Pin order updated!");
    } catch (error: any) {
      set({ error: error.message, loading: false });
      showError(error.message || "Failed to reorder pins.");
    }
  },
}));
