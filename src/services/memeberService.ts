import { api } from "./api";

export const memberService = {
  getAll: () => api.get("/members"),
  getById: (memberId: string) => api.get(`/members/${memberId}`),
  update: (memberId: string, data: any) => api.put(`/members/${memberId}`, data),
  delete: (memberId: string) => api.delete(`/members/${memberId}`),
};
