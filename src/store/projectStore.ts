import { create } from "zustand";
import { projectService } from "@/services/projectService";

export interface Project {
  name: string;
  url: string;
  icon?: React.ElementType;
}

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  isLoading: false,
  error: null,
  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await projectService.getAll();
      set({ projects: data.projects || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch projects", isLoading: false });
    }
  },
}));
