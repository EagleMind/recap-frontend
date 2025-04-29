import { api } from "./api";

export const teamService = {
  getUserTeamsWithDetails: () => api.get("/teams/user-teams-with-details"),
  create: (data: any) => api.post("/teams", data),
  invite: (teamId: string, data: { name: string; email: string; roleId?: string }) => api.post("/teams/invite", { ...data, teamId }),
  getMembers: (teamId: string) => api.get(`/teams/${teamId}/members`),
  getMember: (teamId: string, memberId: string) => api.get(`/teams/${teamId}/members/${memberId}`),
  updateMember: (teamId: string, memberId: string, update: any) => api.put(`/teams/${teamId}/members/${memberId}`, update),
  deleteMember: (teamId: string, memberId: string) => api.delete(`/teams/${teamId}/members/${memberId}`),

  verifyInvitation: (token: string) => api.post(`/teams/invite/${token}`),
  addProject: (teamId: string, data: any) => api.post(`/teams/${teamId}/projects`, data),
  update: (teamId: string, data: any) => api.put(`/teams/${teamId}`, data),
  getById: (teamId: string) => api.get(`/teams/${teamId}`),
  delete: (teamId: string) => api.delete(`/teams/${teamId}`),
};
