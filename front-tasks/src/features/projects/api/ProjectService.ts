import type {
  AddRemoveUserToProject,
  CreateProject,
  DeleteProject,
  UpdateProject,
  UpdateRoleUserInProject,
} from "../schemas/Project.ts";
import Fetch from "../../../utils/api.ts";

export async function fetchProjects(groupId: number) {
  const res = await Fetch({ path: `project/${groupId}`, method: "GET" });

  if (!res.ok) throw new Error(`Failed to fetch projects to group ${groupId}`);
  return res.json();
}

export async function fetchProjectsMe() {
  const res = await Fetch({ path: "project/me", method: "GET" });

  if (!res.ok) throw new Error("Failed to fetch my projects");
  return res.json();
}

export async function fetchUsersProject(group_id: number, project_id: number) {
  const res = await Fetch({
    path: `project/${group_id}/${project_id}/users`,
    method: "GET",
  });

  if (!res.ok) throw new Error("Failed to fetch useras in project");
  return res.json();
}

export async function createProjectApi(data: CreateProject) {
  const res = await Fetch({
    path: `project/${data.group_id}`,
    method: "POST",
    body: data,
  });

  if (!res.ok) throw new Error("Failed to create project");
  return res.json();
}

export async function updateProjectApi(data: UpdateProject) {
  const res = await Fetch({
    path: `project/${data.group_id}/${data.project_id}`,
    method: "PATCH",
    body: data,
  });

  if (!res.ok) throw new Error("Failed to update project");
  return res.json();
}

export async function deleteProjectApi({
  group_id,
  project_id,
}: DeleteProject) {
  const res = await Fetch({
    path: `project/${group_id}/${project_id}`,
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete project");
  return res.json();
}

export async function addUserToProjectApi({
  group_id,
  project_id,
  user_id,
}: AddRemoveUserToProject) {
  const res = await Fetch({
    path: `project/${group_id}/${project_id}/${user_id}`,
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to add user to group");
  return res.json();
}

export async function removeUserToProject({
  group_id,
  project_id,
  user_id,
}: AddRemoveUserToProject) {
  const res = await Fetch({
    path: `project/${group_id}/${project_id}/${user_id}`,
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to remove user to project");
  return res.json();
}

export async function updateUserToProject({
  group_id,
  project_id,
  user_id,
  permission,
}: UpdateRoleUserInProject) {
  const roleData = {
    role: permission,
  };

  const res = await Fetch({
    path: `project/${group_id}/${project_id}/${user_id}`,
    method: "PATCH",
    body: roleData,
  });

  if (!res.ok) throw new Error("Failed to update role for user to project");
  return res.json();
}
