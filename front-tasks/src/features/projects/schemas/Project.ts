import { ReadUserSchema } from "../../../types/User.ts";
import { z } from "zod";

export const PermissionProjectEnum = z.enum(["admin", "write", "read"]);

export const ReadProjectForUserSchema = z.object({
  project_id: z.number(),
  group_id: z.number(),
  title: z.string(),
  description: z.string(),
});

export const ReadProjectSchema = z.object({
  project_id: z.number(),
  group_id: z.number,
  title: z.string,
  description: z.string,
  users: z.array(ReadUserSchema),
});

export const CreateProjectSchema = z.object({
  group_id: z.number(),
  title: z.string(),
  description: z.string().optional(),
});

export const UpdateProjectSchema = z.object({
  group_id: z.number(),
  project_id: z.number(),
  title: z.string().optional(),
  description: z.string().optional(),
});

export const DeleteProjectSchema = z.object({
  group_id: z.number(),
  project_id: z.number(),
});

export const AddRemoveUserToProjectSchema = z.object({
  group_id: z.number(),
  project_id: z.number(),
  user_id: z.number(),
});

export const UpdateRoleUserInProjectSchema = z.object({
  group_id: z.number(),
  project_id: z.number(),
  user_id: z.number(),
  permission: PermissionProjectEnum,
});

export const UserInProjectSchema = z.object({
  user_id: z.number(),
  username: z.string(),
  permission: z.string(),
});

export type ReadProjectForUser = z.infer<typeof ReadProjectForUserSchema>;
export type ReadProject = z.infer<typeof ReadProjectSchema>;
export type CreateProject = z.infer<typeof CreateProjectSchema>;
export type UpdateProject = z.infer<typeof UpdateProjectSchema>;
export type DeleteProject = z.infer<typeof DeleteProjectSchema>;
export type AddRemoveUserToProject = z.infer<
  typeof AddRemoveUserToProjectSchema
>;
export type UpdateRoleUserInProject = z.infer<
  typeof UpdateRoleUserInProjectSchema
>;
export type UserInProject = z.infer<typeof UserInProjectSchema>;
