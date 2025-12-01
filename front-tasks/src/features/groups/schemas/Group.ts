import { ReadUserSchema } from "../../../types/User.ts";
import { z } from "zod";

export const RoleGroupEnum = z.enum(["admin", "editor", "member"]);

export const ReadGroupSchema = z.object({
  group_id: z.number(),
  name: z.string(),
  description: z.string(),
  users: z.array(ReadUserSchema),
});

export const CreateGroupSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export const UpdateGroupSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

export const DeleteGroupSchema = z.object({
  group_id: z.number(),
});

export const AddRemoveUserToGroupSchema = z.object({
  group_id: z.number(),
  user_id: z.number(),
});

export const UpdateRoleUserInGroupSchema = z.object({
  group_id: z.number(),
  user_id: z.number(),
  role: RoleGroupEnum,
});

export const UserInGroupSchema = z.object({
  user_id: z.number(),
  username: z.string(),
  role: z.string(),
});

export type ReadGroup = z.infer<typeof ReadGroupSchema>;
export type CreateGroupInterface = z.infer<typeof CreateGroupSchema>;
export type UpdateGroupInterface = z.infer<typeof UpdateGroupSchema>;
export type DeleteGroup = z.infer<typeof DeleteGroupSchema>;
export type AddRemoveUserToGroupInterface = z.infer<
  typeof AddRemoveUserToGroupSchema
>;
export type UpdateRoleUserInGroup = z.infer<typeof UpdateRoleUserInGroupSchema>;
export type UserInGroup = z.infer<typeof UserInGroupSchema>;
