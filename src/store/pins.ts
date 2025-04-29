import { create } from "zustand";
import { pinsService } from "@/services/pinsService";
import { Recap } from "@/store/recapsStore";

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
      const recaps = await pinsService.fetchPins();
      set({ pinnedRecaps: recaps, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  pinRecap: async (recapId: string) => {
    set({ loading: true, error: null });
    try {
      await pinsService.pinRecap(recapId);
      await get().fetchPins();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  unpinRecap: async (recapId: string) => {
    set({ loading: true, error: null });
    try {
      await pinsService.unpinRecap(recapId);
      await get().fetchPins();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
