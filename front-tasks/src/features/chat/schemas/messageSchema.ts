import { z } from "zod";

export const ReadMessageSchema = z.object({
  chat_id: z.number(),
  project_id: z.number(),
  user_id: z.number(),
  message: z.string(),
  timestamp: z.date(),
});

export const CreateMessageSchema = z.object({
  project_id: z.number(),
  content: z.string(),
});

export type ReadMessageInterface = z.infer<typeof ReadMessageSchema>;
export type CreateMessageInterface = z.infer<typeof CreateMessageSchema>;
