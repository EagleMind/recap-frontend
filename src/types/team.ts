// Types for Team API response

export interface Team {
  teamId: string;
  name: string;
  description: string;
  createdBy: TeamCreator;
  projects: Project[];
  members: TeamMember[];
}

export interface TeamCreator {
  _id: string;
  name: string;
  email: string;
}

export interface Project {
  // Define project properties if available, otherwise keep as any
  [key: string]: any;
}

export interface TeamMember {
  userId: string;
  name: string;
  email: string;
  role: TeamRole;
}

export interface TeamRole {
  _id: string;
  name: string;
  permissions: string[];
}
