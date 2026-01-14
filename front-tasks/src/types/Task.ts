import { TaskStateEnum } from "../features/tasks/schemas/Tasks";

interface label {
  label: string;
}

enum StateEnum {
  completado = "completado",
  en_proceso = "en proceso",
  cancelado = "cancelado",
  sin_empezar = "sin empezar",
}

export interface ReadTaskForUser {
  task_id: number;
  project_id: number;
  title: string;
  description: string;
  date_exp: string;
  state: string;
  task_label_links: label[];
}

export interface UserAssigned {
  user_id: number;
  username: string;
}

export interface ReadTaskForUser {
  task_id: number;
  project_id: number;
  title: string;
  description: string;
  date_exp: string;
  state: string;
  assigned_users: UserAssigned[];
  task_label_links: label[];
}

export interface CreateTask {
  project_id: number;
  title: string;
  description?: string;
  date_exp: string | null;
  assigned_user_id: number;
  label?: label[];
}

export interface UpdateTask {
  project_id: number;
  task_id: number;
  title?: string;
  description?: string;
  date_exp?: string;
  state?: StateEnum | TaskStateEnum | string;
  assigned_user_id?: number;
  remove_assigned_user_id?: boolean;
  append_label?: label[];
  remove_label?: label[];
}

export interface DeleteTask {
  task_id: number;
  project_id: number;
}
