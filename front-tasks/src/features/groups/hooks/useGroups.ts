import { useEffect, useState } from "react";
import {
  addUserToGroupApi,
  createGroupApi,
  deleteGroupApi,
  fetchGroupsMe,
  fetchUsersGroup,
  updateGroupApi,
} from "../api/GroupService";
import {
  type CreateGroupInterface,
  type ReadGroup,
  type UpdateGroupInterface,
  type AddRemoveUserToGroupInterface,
} from "../schemas/Group";

export function useGroups() {
  const [groups, setGroups] = useState<ReadGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadGroups() {
    try {
      setLoading(true);
      const data = await fetchGroupsMe();
      setGroups(data);
    } catch (err) {
      console.error("Error al cargar los grupos", err);
      setError("Failed to load groups");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGroups();
  }, []);

  async function createGroup(payload: CreateGroupInterface) {
    const newGroup = await createGroupApi(payload);
    setGroups((prev) => [...prev, newGroup]);
  }

  async function updateGroup(id: number, payload: UpdateGroupInterface) {
    const updated = await updateGroupApi(id, payload);
    setGroups((prev) => prev.map((g) => (g.group_id === id ? updated : g)));
  }

  async function deleteGroup(id: number) {
    await deleteGroupApi(id);
    setGroups((prev) => prev.filter((g) => g.group_id !== id));
  }

  async function getUsersInGroup(id: number) {
    const users = await fetchUsersGroup(id);
    return users;
  }

  async function addUserToGroup(groupId: number, userId: number) {
    const data: AddRemoveUserToGroupInterface = {
      group_id: groupId,
      user_id: userId,
    };
    const user = await addUserToGroupApi(data);
    return user;
  }

  return {
    groups,
    loading,
    error,
    createGroup,
    updateGroup,
    deleteGroup,
    getUsersInGroup,
    addUserToGroup,
  };
}
