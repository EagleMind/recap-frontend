import { create } from 'zustand';
import { fetchMe, UserMeResponse } from '@/services/userService';

interface UserStoreState {
  user: UserMeResponse | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  updateUser: (updates: Partial<Pick<UserMeResponse, 'name' | 'email'>>) => Promise<void>;
}

import { updateMe } from '@/services/userService';

import { showSuccess, showError } from "@/lib/toast";

export const useUserStore = create<UserStoreState>((set) => ({
  user: null,
  loading: false,
  error: null,
  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const user = await fetchMe();
      set({ user, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch user', loading: false });
    }
  },
  updateUser: async (updates) => {
    set({ loading: true, error: null });
    try {
      const user = await updateMe(updates);
      set({ user, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to update user', loading: false });
    }
  },
}));
