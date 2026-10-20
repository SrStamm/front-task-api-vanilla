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
import { useMutation } from "@tanstack/react-query";

export function useGroups() {
  const [groups, setGroups] = useState<ReadGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadGroups() {
    try {
      setLoading(true);
      const data = await fetchGroupsMe();
      setGroups(data);
    } catch {
      setError("Failed to load groups");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGroups();
  }, []);

  const createGroupMutation = useMutation({
    mutationFn: (payload: CreateGroupInterface) => createGroupApi(payload),
    meta: { errorMode: "inline" },
    onSuccess: (created) => {
      setGroups((prev) => (prev ? [...prev, created] : [created]));
    },
  });

  const updateGroupMutation = useMutation({
    mutationFn: (payload: UpdateGroupInterface) => updateGroupApi(payload),
    meta: { errorMode: "inline" },
    onSuccess: (updated, { group_id }) => {
      setGroups((prev) =>
        prev.map((g) => (g.group_id === group_id ? updated : g)),
      );
    },
  });

  const deleteGroupMutation = useMutation({
    mutationFn: (id: number) => deleteGroupApi(id),
    onSuccess: (_, id) =>
      setGroups((prev) => prev.filter((g) => g.group_id !== id)),
  });

  async function getUsersInGroup(id: number) {
    return fetchUsersGroup(id);
  }

  const addUserToGroupMutation = useMutation({
    mutationFn: (data: AddRemoveUserToGroupInterface) =>
      addUserToGroupApi(data),
    meta: { errorMode: "inline" },
    onSuccess: (data, { group_id }) =>
      setGroups((prev) =>
        prev.map((g) =>
          g.group_id === group_id ? { ...g, users: [...g.users, data] } : g,
        ),
      ),
  });

  return {
    groups,
    loading,
    error,
    getUsersInGroup,

    createGroup: createGroupMutation.mutateAsync,
    updateGroup: updateGroupMutation.mutateAsync,
    deleteGroup: deleteGroupMutation.mutateAsync,
    addUserToGroup: addUserToGroupMutation.mutateAsync,

    isCreating: createGroupMutation.isPending,
    isUpdating: updateGroupMutation.isPending,
    isDeleting: deleteGroupMutation.isPending,
    isAddingUser: addUserToGroupMutation.isPending,
  };
}
