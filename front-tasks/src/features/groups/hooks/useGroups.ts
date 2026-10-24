import {
  addUserToGroupApi,
  createGroupApi,
  deleteGroupApi,
  fetchGroupsMe,
  fetchUsersGroup,
  updateGroupApi,
} from "../api/GroupService";
import {
  type AddRemoveUserToGroupInterface,
  type CreateGroupInterface,
  type ReadGroup,
  type UpdateGroupInterface,
} from "../schemas/Group";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGroups() {
  const queryClient = useQueryClient();

  const groupsQuery = useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroupsMe,
  });

  const groups: ReadGroup[] = groupsQuery.data ?? [];

  const createGroupMutation = useMutation({
    mutationFn: (payload: CreateGroupInterface) => createGroupApi(payload),
    meta: { errorMode: "inline" },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });

  const updateGroupMutation = useMutation({
    mutationFn: (payload: UpdateGroupInterface) => updateGroupApi(payload),
    meta: { errorMode: "inline" },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });

  const deleteGroupMutation = useMutation({
    mutationFn: (id: number) => deleteGroupApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  async function getUsersInGroup(id: number) {
    return fetchUsersGroup(id);
  }

  const addUserToGroupMutation = useMutation({
    mutationFn: (data: AddRemoveUserToGroupInterface) =>
      addUserToGroupApi(data),
    meta: { errorMode: "inline" },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });

  return {
    groups,
    loading: groupsQuery.isLoading,
    error: groupsQuery.error,
    getUsersInGroup,
    loadGroups: groupsQuery.refetch,

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
