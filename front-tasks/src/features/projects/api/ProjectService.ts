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

  return res;
}

export async function fetchProjectsMe() {
  const res = await Fetch({ path: "project/me", method: "GET" });

  return res;
}

export async function fetchUsersProject(group_id: number, project_id: number) {
  const res = await Fetch({
    path: `project/${group_id}/${project_id}/users`,
    method: "GET",
  });

  return res;
}

export async function createProjectApi(data: CreateProject) {
  const res = await Fetch({
    path: `project/${data.group_id}`,
    method: "POST",
    body: data,
  });

  return res;
}

export async function updateProjectApi(data: UpdateProject) {
  const res = await Fetch({
    path: `project/${data.group_id}/${data.project_id}`,
    method: "PATCH",
    body: data,
  });

  return res;
}

export async function deleteProjectApi({
  group_id,
  project_id,
}: DeleteProject) {
  const res = await Fetch({
    path: `project/${group_id}/${project_id}`,
    method: "DELETE",
  });

  return res;
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

  return res;
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

  return res;
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

  return res;
}
