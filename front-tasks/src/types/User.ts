import { z } from "zod";

export const ReadUserSchema = z.object({
  user_id: z.number(),
  username: z.string(),
});

export const CreateUserSchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
});

export const UpdateUserSchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
});

export type ReadUser = z.infer<typeof ReadUserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUserSchema = z.infer<typeof UpdateUserSchema>;
