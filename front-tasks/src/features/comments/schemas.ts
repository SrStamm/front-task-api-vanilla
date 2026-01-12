import { z } from "zod";

export const CreateCommentSchema = z.object({
  content: z.string(),
});

export const ReadCommentSchema = z.object({
  comment_id: z.number(),
  task_id: z.number(),
  user_id: z.number(),
  username: z.string(),
  content: z.string(),
  created_at: z.date(),
  update_at: z.date(),
  is_deleted: z.boolean(),
});

export const UpdateCommentSchema = z.object({
  content: z.string().optional(), // max_length=300
  is_deleted: z.boolean().optional(),
});

export type CreateCommentInterface = z.infer<typeof CreateCommentSchema>;
export type ReadCommentInterface = z.infer<typeof ReadCommentSchema>;
export type UpdateCommentInterface = z.infer<typeof UpdateCommentSchema>;
