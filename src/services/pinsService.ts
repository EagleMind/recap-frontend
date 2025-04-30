import { Recap } from "@/types/recap";
import { api } from "./api";

export const pinsService = {
  async fetchPins(): Promise<Recap[]> {
    const res = await api.get("/pins");
    return res.data;
  },

  async pinRecap(recapId: string): Promise<string[]> {
    const res = await api.post(`/pins/${recapId}`);
    return res.data.pinnedRecaps;
  },

  async unpinRecap(recapId: string): Promise<string[]> {
    const res = await api.delete(`/pins/${recapId}`);
    return res.data.pinnedRecaps;
  },

  async reorderPins(recapIds: string[]): Promise<void> {
    await api.post("/pins/reorder", { recapIds });
  },
};
