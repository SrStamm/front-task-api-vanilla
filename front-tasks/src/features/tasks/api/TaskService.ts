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
  if (!res) throw new Error("Failed to Fetch all Task assigned to user");
  return res.json();
}

export async function FetchUsersAssignedToTask(taskId: number) {
  const res = await Fetch({ path: `task/${taskId}/users`, method: "GET" });
  if (!res) throw new Error("Failed to Fetch all users assigned to task");
  return res.json();
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

  console.log("Path:", path);
  console.log("Filters:", filters);

  if (!res) throw new Error(`Failed to Fetch all task in project ${projectId}`);
  return res.json();
}

export async function FetchCreateTask(projectId: number, data: CreateTask) {
  const res = await Fetch({
    path: `task/${projectId}`,
    method: "POST",
    body: data,
  });
  if (!res) throw new Error("Failed to create a task");
  return res.json();
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
  if (!res)
    throw new Error(
      `Failed to update a task ${taskId} in project ${projectId}`,
    );
  return res.json();
}

export async function FetchDeleteTask(projectId: number, taskId: number) {
  const res = await Fetch({
    path: `task/${projectId}/${taskId}`,
    method: "DELETE",
  });
  if (!res)
    throw new Error(
      `Failed to delete a task ${taskId} in project ${projectId}`,
    );
  return res.json();
}
