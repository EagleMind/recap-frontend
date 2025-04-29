import { create } from "zustand";
import { teamService } from "@/services/teamService";
import { showSuccess, showError } from "@/lib/toast";

export interface TeamMember {
  _id: string;
  name: string;
  user: any;
  team: string;
  role: any;
  permissions: string[];
  // Add other fields as needed
}

interface TeamMemberState {
  member: TeamMember | null;
  loading: boolean;
  error: string | null;
  fetchMember: (teamId: string, memberId: string) => Promise<void>;
  updateMember: (teamId: string, memberId: string, update: Partial<TeamMember>) => Promise<void>;
  deleteMember: (teamId: string, memberId: string) => Promise<void>;
}

export const useTeamMemberStore = create<TeamMemberState>((set) => ({
  member: null,
  loading: false,
  error: null,

  fetchMember: async (teamId: string, memberId: string) => {
    set({ loading: true, error: null });
    try {
      const { data } = await teamService.getMember(teamId, memberId);
      set({ member: data, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Error fetching member", loading: false });
      showError(error.message || "Failed to load team member.");
    }
  },

  updateMember: async (teamId: string, memberId: string, update: Partial<TeamMember>) => {
    set({ loading: true, error: null });
    try {
      const { data } = await teamService.updateMember(teamId, memberId, update);
      set({ member: data, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Error updating member", loading: false });
    }
  },

  deleteMember: async (teamId: string, memberId: string) => {
    set({ loading: true, error: null });
    try {
      await teamService.deleteMember(teamId, memberId);
      set({ member: null, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Error deleting member", loading: false });
    }
  },
}));
