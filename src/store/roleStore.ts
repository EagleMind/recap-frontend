import { create } from "zustand";
import { roleService } from "@/services/roleService";
import { showSuccess, showError } from "@/lib/toast";

export interface Role {
  _id: string;
  name: string;
  permissions: string[];
}

interface RoleState {
  roles: Role[];
  loading: boolean;
  error: string | null;
  fetchRoles: () => Promise<void>;
  createRole: (data: { name: string; permissions: string[] }) => Promise<void>;
  updateRole: (roleId: string, data: { name: string; permissions: string[] }) => Promise<void>;
  deleteRole: (roleId: string) => Promise<void>;
}

export const useRoleStore = create<RoleState>((set, get) => ({
  roles: [],
  loading: false,
  error: null,
  fetchRoles: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await roleService.getAll();
      set({ roles: data, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Error fetching roles", loading: false });
      showError(error.message || "Failed to load roles.");
    }
  },
  createRole: async (data) => {
    set({ loading: true, error: null });
    try {
      await roleService.create(data);
      await get().fetchRoles();
      // Don't set loading to false here, fetchRoles does it
    } catch (error: any) {
      set({ error: error.message || "Error creating role", loading: false });
    }
  },
  updateRole: async (roleId, data) => {
    set({ loading: true, error: null });
    try {
      await roleService.update(roleId, data);
      await get().fetchRoles();
      // Don't set loading to false here, fetchRoles does it
    } catch (error: any) {
      set({ error: error.message || "Error updating role", loading: false });
    }
  },
  deleteRole: async (roleId) => {
    set({ loading: true, error: null });
    try {
      await roleService.delete(roleId);
      await get().fetchRoles();
      // Don't set loading to false here, fetchRoles does it
    } catch (error: any) {
      set({ error: error.message || "Error deleting role", loading: false });
    }
  },
}));
