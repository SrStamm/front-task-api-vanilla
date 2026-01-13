import { z } from "zod";

const TaskState = z.enum(["sin empezar", "en proceso", "completado"]);

export const ReadTaskSchema = z.object({
  task_id: z.number(),
  project_id: z.number(),
  title: z.string(),
  description: z.string(),
  date_exp: z.date(),
  state: TaskState,
  task_labels_links: z.array(z.string()),
});

export const ReadUserAssignedSchema = z.object({
  user_id: z.number(),
  username: z.string(),
});

export const ReadAllTaskFromProjectSchema = z.object({
  task_id: z.number(),
  project_id: z.number(),
  title: z.string(),
  description: z.string(),
  date_exp: z.date(),
  state: TaskState,
  task_labels_links: z.array(z.string()),
  assigned_user: ReadUserAssignedSchema,
});

export const CreateTaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  task_labels_links: z.array(z.string()),
  user_ids: z.array(z.number()),
});

export const UpdateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  remove_label: z.array(z.string()).optional(),
  append_label: z.array(z.string()).optional(),
  append_user_ids: z.array(z.number()).optional(),
  remove_user_ids: z.array(z.number()).optional(),
});

export const RemoveTaskSchema = z.object({
  task_id: z.number(),
  project_id: z.number(),
});

export type TaskStateEnum = z.infer<typeof TaskState>;
export type ReadTaskInterface = z.infer<typeof ReadTaskSchema>;
export type ReadUserAssignedInterface = z.infer<typeof ReadUserAssignedSchema>;
export type ReadAllTaskFromProjectInterface = z.infer<
  typeof ReadAllTaskFromProjectSchema
>;
export type CreateTaskInterface = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInterface = z.infer<typeof UpdateTaskSchema>;
export type RemoveTaskInterface = z.infer<typeof RemoveTaskSchema>;
