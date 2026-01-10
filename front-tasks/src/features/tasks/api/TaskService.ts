import type { CreateTask, UpdateTask } from "../../../types/Task";
import Fetch from "../../../utils/api";

export async function FetchTaskAssignedToUser(
  page: number,
  items_per_page: number,
  filters?: { state: string; label: string },
) {
  let path = `task?limit=${items_per_page}&skip=${page}`;

  if (filters?.state) {
    path += `&state=${encodeURIComponent(filters.state)}`;
  }

  const res = await Fetch({
    path: path,
    method: "GET",
  });
  return res;
}

export async function FetchUsersAssignedToTask(taskId: number) {
  const res = await Fetch({ path: `task/${taskId}/users`, method: "GET" });
  return res;
}

export async function FetchTaskToProject(
  projectId: number,
  filters?: { state: string; label: string },
) {
  let path = `task/${projectId}`;

  if (filters?.state && filters.state.length > 0) {
    path += `?state=${encodeURIComponent(filters.state)}`;
  }

  const res = await Fetch({ path: path, method: "GET" });

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
