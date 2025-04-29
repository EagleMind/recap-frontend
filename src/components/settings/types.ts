
export interface TeamRole {
    id: string;
    name: string;
    permissions: string[];
    memberCount: number;
}

export interface TeamPermission {
    id: string;
    name: string;
    description: string;
    assignedRoles: string[];
}
