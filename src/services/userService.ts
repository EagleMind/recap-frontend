import { api } from "./api";

export interface UserMeResponse {
  role: string;
  name: string;
  email: string;
  isVerified: boolean;
  plan?: {
    priceId: string;
    limits: {
      teams_limit: string;
      members_per_team: string;
      recaps_per_team: string;
      ai_calls: string;
    };
  };
  subscriptionStatus?: "active" | "past_due" | "canceled";
}
export async function fetchMe(): Promise<UserMeResponse> {
  const response = await api.get<UserMeResponse>("/users/me");
  return response.data;
}

export async function updateMe(
  updates: Partial<Pick<UserMeResponse, "name" | "email">>
): Promise<UserMeResponse> {
  const response = await api.patch<UserMeResponse>("/users/me", updates);
  return response.data;
}
