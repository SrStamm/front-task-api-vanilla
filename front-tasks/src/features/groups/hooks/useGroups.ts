import { useEffect, useState } from "react";
import {
  createGroupApi,
  deleteGroupApi,
  fetchGroupsMe,
  updateGroupApi,
} from "../api/GroupService";
import type {
  CreateGroupInterface,
  ReadGroup,
  UpdateGroup,
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
      setError("Failed to load groups");
      console.error(err);
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

  async function updateGroup(id: number, payload: UpdateGroup) {
    const updated = await updateGroupApi(id, payload);
    setGroups((prev) => prev.map((g) => (g.group_id === id ? updated : g)));
  }

  async function deleteGroup(id: number) {
    await deleteGroupApi(id);
    setGroups((prev) => prev.filter((g) => g.group_id !== id));
  }

  return {
    groups,
    loading,
    error,
    createGroup,
    updateGroup,
    deleteGroup,
  };
}
