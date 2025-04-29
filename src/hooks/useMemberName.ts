import { useTeamStore } from "@/store/teamStore";

export function useMemberName(memberId?: string) {
  const members = useTeamStore((state) => state.members);
  return members.find((m) => m.memberId === memberId)?.name || memberId || "";
}
