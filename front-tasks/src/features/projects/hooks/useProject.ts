import { useCallback, useEffect, useState } from "react";
import {
  createProjectApi,
  deleteProjectApi,
  fetchProjects,
  updateProjectApi,
  removeUserToProject,
  addUserToProjectApi,
  fetchProjectMeInGroup,
} from "../api/ProjectService";
import {
  type AddRemoveUserToProject,
  type CreateProject,
  type ReadProject,
  type UpdateProject,
} from "../schemas/Project";
import { useGroupProject } from "../../../hooks/useGroupProject";

export function useProjects() {
  const [projects, setProjects] = useState<ReadProject[] | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { groupId, role } = useGroupProject();

  const loadProjects = useCallback(async () => {
    try {
      setError(null);

      if (!groupId || groupId === undefined) {
        setProjects(undefined);
      } else {
        setLoading(true);

        const data =
          role == "admin"
            ? await fetchProjects(groupId)
            : await fetchProjectMeInGroup(groupId);

        setProjects(data);
      }
    } catch {
      if (!groupId) {
        setError("Group not selected");
      } else {
        setError("Failed to load projects");
      }
    } finally {
      setLoading(false);
    }
  }, [groupId, role]);

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

  async function removeUserFromProject(
    groupId: number,
    projectId: number,
    userId: number,
  ) {
    const data: AddRemoveUserToProject = {
      group_id: groupId,
      project_id: projectId,
      user_id: userId,
    };

    await removeUserToProject(data);

    setProjects((prevProjects) => {
      if (!prevProjects) return undefined;

      return prevProjects.map((project) => {
        if (project.project_id === projectId) {
          return {
            ...project,
            users: project.users.filter((user) => user.user_id !== userId),
          };
        }
        return project;
      });
    });
  }

  async function addUserToProject(
    groupId: number,
    projectId: number,
    userId: number,
  ) {
    const data: AddRemoveUserToProject = {
      group_id: groupId,
      project_id: projectId,
      user_id: userId,
    };

    await addUserToProjectApi(data);
    await loadProjects();
  }

  return {
    projects,
    loadProjects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    removeUserFromProject,
    addUserToProject,
  };
}
