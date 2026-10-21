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
  DeleteProject,
  type AddRemoveUserToProject,
  type CreateProject,
  type ReadProject,
  type UpdateProject,
} from "../schemas/Project";
import { useGroupProject } from "../../../hooks/useGroupProject";
import { useMutation } from "@tanstack/react-query";

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

  const createProjectMutation = useMutation({
    mutationFn: (payload: CreateProject) => createProjectApi(payload),
    meta: { errorMode: "inline" },
    onSuccess: (newProject) => {
      setProjects((prev) => (prev ? [...prev, newProject] : [newProject]));
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: (payload: UpdateProject) => updateProjectApi(payload),
    meta: { errorMode: "inline" },
    // El PATCH devuelve solo {detail}, no el proyecto: hay que aplicar lo que
    // se envió y conservar el resto (users, group_id) para no corromper la lista.
    onSuccess: (_data, { project_id, title, description }) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.project_id === project_id
            ? {
                ...p,
                title: title ?? p.title,
                description: description ?? p.description,
              }
            : p,
        ),
      );
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (data: DeleteProject) => deleteProjectApi(data),
    onSuccess: (_, { project_id }) => {
      setProjects((prev) => prev.filter((g) => g.project_id !== project_id));
    },
  });

  const removeUserFromProjectMutation = useMutation({
    mutationFn: (data: AddRemoveUserToProject) => removeUserToProject(data),
    onSuccess: (_, { project_id, user_id }) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.project_id === project_id
            ? {
                ...p,
                users: p.users.filter((user) => user.user_id !== user_id),
              }
            : p,
        ),
      );
    },
  });

  const addUserToProjectMutation = useMutation({
    mutationFn: (data: AddRemoveUserToProject) => addUserToProjectApi(data),
    meta: { errorMode: "inline" },
    onSuccess: (data, { project_id }) =>
      setProjects((prev) =>
        prev.map((p) =>
          p.project_id === project_id ? { ...p, users: [...p.users, data] } : p,
        ),
      ),
  });

  return {
    projects,
    loadProjects,
    loading,
    error,

    createProject: createProjectMutation.mutateAsync,
    updateProject: updateProjectMutation.mutateAsync,
    deleteProject: deleteProjectMutation.mutateAsync,
    removeUserFromProject: removeUserFromProjectMutation.mutateAsync,
    addUserToProject: addUserToProjectMutation.mutateAsync,

    isCreating: createProjectMutation.isPending,
    isUpdating: updateProjectMutation.isPending,
    isDeleting: deleteProjectMutation.isPending,
    isRemovingUser: removeUserFromProjectMutation.isPending,
    isAddingUser: addUserToProjectMutation.isPending,
  };
}
