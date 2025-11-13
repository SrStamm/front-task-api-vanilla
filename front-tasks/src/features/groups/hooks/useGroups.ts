import { useEffect, useState } from "react";
import { fetchGroupsMe } from "../api/GroupService";
import type { ReadGroup } from "../schemas/Group";

export function useGroups() {
  const [groups, setGroups] = useState<ReadGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchGroupsMe();
        setGroups(data);
      } catch (err) {
        setError("Failed to load groups");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { groups, loading, error };
}
