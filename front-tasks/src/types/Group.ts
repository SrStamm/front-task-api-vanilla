import type { ReadUser } from "./User";

export interface ReadGroup {
  group_id: number;
  name: string;
  users: ReadUser[];
}

export interface CreateGroup {
  name: string;
  description?: string;
}

export interface UpdateGroup {
  name?: string;
  description?: string;
}

export interface DeleteGroup {
  group_id: number;
}

export interface AddRemoveUserToGroup {
  group_id: number;
  user_id: number;
}

export interface UpdateRoleUserInGroup {
  group_id: number;
  user_id: number;
  role: RoleGroup;
}

enum RoleGroup {
  admin = "admin",
  editor = "editor",
  member = "member",
}

export interface UserInGroup {
  user_id: number;
  username: string;
  role: string;
}
