import type { CreateTask, UpdateTask } from "../../../types/Task";
import Fetch from "../../../utils/api";

function appendFilter(
  params: URLSearchParams,
  key: string,
  value?: string | string[],
) {
  if (!value) return;
  const values = Array.isArray(value) ? value : [value];
  values
    .filter((v) => v.trim().length > 0)
    .forEach((v) => params.append(key, v.trim()));
}

export async function FetchTaskAssignedToUser(
  page: number,
  items_per_page: number,
  filters?: { state: string; label: string },
) {
  const params = new URLSearchParams();

  params.append("limit", items_per_page.toString());
  params.append("skip", page.toString());

  appendFilter(params, "state", filters?.state);
  appendFilter(params, "labels", filters?.label);

  const res = await Fetch({
    path: `task?${params.toString()}`,
    method: "GET",
  });
  return res;
}

export async function FetchUsersAssignedToTask(taskId: number) {
  const res = await Fetch({ path: `task/${taskId}/users`, method: "GET" });
  return res;
}

export async function FetchTaskToProject({
  projectId,
  limit = 100,
  filters,
}: {
  projectId: number;
  limit?: number;
  filters?: { state: string | string[]; label: string };
}) {
  const params = new URLSearchParams();

  params.append("limit", limit.toString());

  appendFilter(params, "state", filters?.state);
  appendFilter(params, "labels", filters?.label);

  const res = await Fetch({
    path: `task/${projectId}?${params.toString()}`,
    method: "GET",
  });

  return res;
}

export async function FetchCreateTask(projectId: number, data: CreateTask) {
  const res = await Fetch({
    path: `task/${projectId}`,
    method: "POST",
    body: data,
  });
  return res;
}

export async function FetchUpdateTask(
  projectId: number,
  taskId: number,
  data: UpdateTask,
) {
  const res = await Fetch({
    path: `task/${projectId}/${taskId}`,
    method: "PATCH",
    body: data,
  });
  return res;
}

export async function FetchDeleteTask(projectId: number, taskId: number) {
  const res = await Fetch({
    path: `task/${projectId}/${taskId}`,
    method: "DELETE",
  });
  return res;
}
