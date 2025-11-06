import type { ReadUser } from "./User";

export interface ReadProjectForUser {
  project_id: number;
  group_id: number;
  title: string;
  description: string;
}

export interface ReadProject {
  project_id: number;
  group_id: number;
  title: string;
  description: string;
  users: ReadUser[];
}

export interface CreateProject {
  group_id: number;
  title: string;
  description?: string;
}

export interface UpdateProject {
  group_id: number;
  title?: string;
  description?: string;
}

export interface DeleteProject {
  group_id: number;
  project_id: number;
}

export interface AddRemoveUserToProject {
  group_id: number;
  project_id: number;
  user_id: number;
}

export interface UpdateRoleUserInProject {
  group_id: number;
  project_id: number;
  user_id: number;
  permission: PermissionProject;
}

enum PermissionProject {
  admin = "admin",
  write = "write",
  read = "read",
}

export interface UserInProject {
  user_id: number;
  username: string;
  permission: string;
}
