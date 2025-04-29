import { TeamPermission } from "@/components/settings/types";
import { TeamRole } from "@/types/team";

export interface TeamMember {
  memberId: string; // Member document _id
  userId: string;  // User document _id
  name: string;
  email: string;
  role: {
    _id: string;
    name: string;
    permissions: string[];
  };
  status: "active" | "inactive";
}

export interface TeamManagementState {
  members: TeamMember[];
  roles: TeamRole[];
  permissions: TeamPermission[];
}
