import { api } from "./api";

export const insightService = {
  getOverview: () => api.get("/insights/overview"),
  getUpdateTrends: () => api.get("/insights/update-trends"),
  getMemberActivity: (teamId: string) => api.get(`/insights/member-activity/${teamId}`),
};
