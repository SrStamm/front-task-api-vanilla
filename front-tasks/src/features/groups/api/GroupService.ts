import type {
  CreateGroupInterface,
  UpdateRoleUserInGroup,
} from "../schemas/Group.ts";
import Fetch from "../../../utils/api.ts";
import { AddRemoveUserToGroup, UpdateGroup } from "../../../types/Group.ts";

export async function fetchGroups() {
  const res = await Fetch({ path: "group", method: "GET" });
  return res;
}

export async function fetchGroupsMe() {
  const res = await Fetch({ path: "group/me", method: "GET" });
  return res;
}

export async function fetchUsersGroup(group_id: number) {
  const res = await Fetch({ path: `group/${group_id}/users`, method: "GET" });
  return res;
}

export async function createGroupApi(data: CreateGroupInterface) {
  const res = await Fetch({ path: "group", method: "POST", body: data });

  return res;
}

export async function updateGroupApi(group_id: number, data: UpdateGroup) {
  const res = await Fetch({
    path: `group/${group_id}`,
    method: "PATCH",
    body: data,
  });

  return res;
}

export async function deleteGroupApi(group_id: number) {
  const res = await Fetch({ path: `group/${group_id}`, method: "DELETE" });

  return res;
}

export async function addUserToGroupApi({
  group_id,
  user_id,
}: AddRemoveUserToGroup) {
  const res = await Fetch({
    path: `group/${group_id}/${user_id}`,
    method: "POST",
  });

  return res;
}

export async function removeUserToGroup({
  group_id,
  user_id,
}: AddRemoveUserToGroup) {
  const res = await Fetch({
    path: `group/${group_id}/${user_id}`,
    method: "DELETE",
  });

  return res;
}

export async function updateUserToGroup({
  group_id,
  user_id,
  role,
}: UpdateRoleUserInGroup) {
  const roleData = {
    role: role,
  };

  const res = await Fetch({
    path: `group/${group_id}/${user_id}`,
    method: "PATCH",
    body: roleData,
  });

  return res;
}

export async function getUserDataInGroup(group_id: number) {
  const res = await Fetch({
    path: `group/${group_id}/role`,
    method: "GET",
  });

  return res;
}
