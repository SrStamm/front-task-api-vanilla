import { z } from "zod";

const TaskState = z.enum(["sin empezar", "en proceso", "completado"]);

export const ReadTaskSchema = z.object({
  task_id: z.number(),
  project_id: z.number(),
  title: z.string(),
  description: z.string(),
  date_exp: z.string().nullable(),
  state: TaskState,
  task_label_links: z.array(z.object({ label: z.string() })),
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
  date_exp: z.string().nullable(),
  state: TaskState,
  task_label_links: z.array(z.object({ label: z.string() })),
  assigned_user: ReadUserAssignedSchema,
});

export type TaskStateEnum = z.infer<typeof TaskState>;
export type ReadTaskInterface = z.infer<typeof ReadTaskSchema>;
export type ReadAllTaskFromProjectInterface = z.infer<
  typeof ReadAllTaskFromProjectSchema
>;
