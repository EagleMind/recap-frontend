import { create } from "zustand";
import { persist } from "zustand/middleware";
import { teamService } from "@/services/teamService";
import { showSuccess, showError } from "@/lib/toast";
import type { Team } from "@/types/team";

import type { TeamMember } from "@/components/hub/team/types";

interface TeamState {
  teams: Team[];
  activeTeam: Team | null;
  isLoading: boolean;
  error: string | null;
  fetchTeams: () => Promise<void>;
  fetchTeamById: (teamId: string) => Promise<Team | null>;
  setActiveTeam: (team: Team) => void;
  createTeam: (teamData: Partial<Team>) => Promise<void>;
  updateTeam: (teamId: string, teamData: Partial<Team>) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
  members: TeamMember[];
  roles: {
    _id: string;
    name: string;
    permissions: string[];
  }[];
  permissions: string[];
  fetchMembers: () => Promise<void>;
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      teams: [],
      activeTeam: null,
      isLoading: false,
      error: null,
      members: [],
      roles: [],
      permissions: [],
      fetchTeams: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await teamService.getUserTeamsWithDetails();
          const teams = Array.isArray(data) ? data : (data.teams || []);
          const validActive = teams.length > 0 && typeof teams[0].name === 'string' && teams[0].name.trim() ? teams[0] : null;
          set({
            teams,
            activeTeam: validActive,
            isLoading: false,
          });
        } catch (error: any) {
          set({ error: error.message || "Failed to fetch teams", isLoading: false });
          showError(error.message || "Failed to fetch teams");
        }
      },
      fetchTeamById: async (teamId: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await teamService.getById(teamId);
          set({ activeTeam: data, isLoading: false });
          return data;
        } catch (error: any) {
          set({ error: error.message || "Failed to fetch team", isLoading: false });
          showError(error.message || "Failed to fetch team");
          return null;
        }
      },
      setActiveTeam: (team: Team) => {
        set((state) => ({ ...state, activeTeam: team }));
        console.log('[setActiveTeam] activeTeam set to:', team);
      },
      createTeam: async (teamData: Partial<Team>) => {
        set({ isLoading: true, error: null });
        try {
          const { data: newTeam } = await teamService.create(teamData);
          const prevTeams = get().teams;
          // Validate newTeam has a name
          let validTeam = newTeam && typeof newTeam.name === 'string' && newTeam.name.trim() ? newTeam : null;
          const updatedTeams = [...prevTeams, ...(validTeam ? [validTeam] : [])];
          set((state) => ({
            ...state,
            teams: updatedTeams,
            activeTeam: validTeam || updatedTeams[0] || null,
            isLoading: false,
          }));
          console.log('[createTeam] teams set to:', updatedTeams);
        } catch (error: any) {
          set({ error: error.message || "Failed to create team", isLoading: false });
        }
      },
      updateTeam: async (teamId: string, teamData: Partial<Team>) => {
        set({ isLoading: true, error: null });
        try {
          const { data: updatedTeam } = await teamService.update(teamId, teamData);
          set((state) => ({
            teams: state.teams.map((team) =>
              team.teamId === teamId ? updatedTeam : team
            ),
            activeTeam: updatedTeam,
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message || "Failed to update team", isLoading: false });
        }
      },
      deleteTeam: async (teamId: string) => {
        set({ isLoading: true, error: null });
        try {
          await teamService.delete(teamId);
          set((state) => ({
            teams: state.teams.filter((team) => team.teamId !== teamId),
            activeTeam: state.activeTeam && state.activeTeam.teamId === teamId ? null : state.activeTeam,
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message || "Failed to delete team", isLoading: false });
        }
      },
      fetchMembers: async () => {
        set({ isLoading: true, error: null });
        try {
          const activeTeam = get().activeTeam;
          if (!activeTeam) throw new Error("No active team selected");
          const { data } = await teamService.getMembers(activeTeam.teamId);
          console.log(data)
          // Normalize members to match TeamMember type
          const members = (Array.isArray(data) ? data : data.members || []).map((m: TeamMember & { status?: string; memberId?: string }) => ({
            memberId: m.memberId,
            userId: m.userId,
            name: m.name,
            email: m.email,
            role: m.role,
            status: m.status,
          }));
          // Extract unique roles
          const roleMap = new Map();
          members.forEach((m: TeamMember & { status?: string }) => {
            if (m.role && m.role._id && !roleMap.has(m.role._id)) {
              roleMap.set(m.role._id, m.role);
            }
          });
          const roles = Array.from(roleMap.values());
          // Extract unique permissions
          const permissionSet = new Set<string>();
          roles.forEach((role: { _id: string; name: string; permissions: string[] }) => {
            (role.permissions || []).forEach((perm: string) => permissionSet.add(perm));
          });
          const permissions = Array.from(permissionSet);
          set((state) => ({
            ...state,
            members,
            roles,
            permissions,
            isLoading: false
          }));
          console.log('[fetchMembers] members set to:', members);
        } catch (error: any) {
          set({ error: error.message || "Failed to fetch members", isLoading: false });
        }
      },
    }),
    {
      name: "team-store",
      partialize: (state) => ({ teams: state.teams, activeTeam: state.activeTeam }),
    }
  )
);
