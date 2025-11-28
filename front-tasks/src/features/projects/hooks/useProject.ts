import { useCallback, useEffect, useState } from "react";
import {
  createProjectApi,
  deleteProjectApi,
  fetchProjects,
  updateProjectApi,
} from "../api/ProjectService";
import type {
  CreateProject,
  ReadProject,
  UpdateProject,
} from "../schemas/Project";
import { useGroupProject } from "../../../hooks/useGroupProject";

export function useProjects() {
  const [projects, setProjects] = useState<ReadProject[] | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { groupId } = useGroupProject();

  const loadProjects = useCallback(async () => {
    try {
      setError(null);

      if (groupId === undefined) {
        setProjects(undefined);
      } else {
        setLoading(true);
        const data = await fetchProjects(groupId);
        setProjects(data);
      }
    } catch (err) {
      setError("Failed to load projects");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    if (groupId !== undefined) {
      loadProjects();
    }
  }, [groupId, loadProjects]);

  async function createProject(payload: CreateProject) {
    const newProject = await createProjectApi(payload);
    setProjects((prev) => [...prev, newProject]);
  }

  async function updateProject(payload: UpdateProject) {
    const updated = await updateProjectApi(payload);
    setProjects((prev) =>
      prev.map((g) => (g.project_id === updated.project_id ? updated : g)),
    );
  }

  async function deleteProject(group_id: number, project_id: number) {
    await deleteProjectApi({ group_id, project_id });
    setProjects((prev) => prev.filter((g) => g.project_id !== project_id));
  }

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
  };
}
