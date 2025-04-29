import { api } from "./api";

export const projectService = {
  getAll: () => api.get("/projects"),
  getById: (projectId: string) => api.get(`/projects/${projectId}`),
  create: (data: any) => api.post("/projects", data),
  update: (projectId: string, data: any) => api.put(`/projects/${projectId}`, data),
  delete: (projectId: string) => api.delete(`/projects/${projectId}`),
  getByMember: (memberId: string) => api.get(`/projects/member/${memberId}`),
};
