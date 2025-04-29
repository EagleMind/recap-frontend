import { api } from "./api";

export const roleService = {
  getAll: () => api.get("/roles"),
  getById: (roleId: string) => api.get(`/roles/${roleId}`),
  create: (data: any) => api.post("/roles", data),
  update: (roleId: string, data: any) => api.put(`/roles/${roleId}`, data),
  delete: (roleId: string) => api.delete(`/roles/${roleId}`),
};
