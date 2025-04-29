import { api } from "./api";

export interface RecapInsight {
  totalRecaps: number;
  recapsPerMember: { _id: string; count: number }[];
  recapsPerTeam: { _id: string; count: number }[];
  recentRecaps: any[];
  membersWithoutRecaps: string[];
  recapsByStatus: { _id: string; count: number }[];
  recapsPerMonth: { _id: string; count: number }[];
}

export async function fetchManagerInsights() {
  const { data } = await api.get<RecapInsight>("/insights/manager");
  return data;
}
