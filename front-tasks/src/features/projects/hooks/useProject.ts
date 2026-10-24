import {
  addUserToProjectApi,
  createProjectApi,
  deleteProjectApi,
  fetchProjectMeInGroup,
  fetchProjects,
  removeUserToProject,
  updateProjectApi,
} from "../api/ProjectService";
import {
  type AddRemoveUserToProject,
  type CreateProject,
  DeleteProject,
  type ReadProject,
  type UpdateProject,
} from "../schemas/Project";
import { useGroupProject } from "../../../hooks/useGroupProject";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useProjects() {
  const queryClient = useQueryClient();
  const { groupId, role } = useGroupProject();

  const projectsQuery = useQuery({
    queryKey: ["projects", groupId, role],
    queryFn: async () => {
      if (!groupId) {
        return undefined;
      }
      if (role === "admin") {
        return fetchProjects(groupId);
      }
      return fetchProjectMeInGroup(groupId);
    },
    enabled: !!groupId,
  });

  const projects: ReadProject[] | undefined = projectsQuery.data;

  const invalidateProjects = () => {
    queryClient.invalidateQueries({ queryKey: ["projects"] });
  };

  const createProjectMutation = useMutation({
    mutationFn: (payload: CreateProject) => createProjectApi(payload),
    meta: { errorMode: "inline" },
    onSuccess: () => {
      invalidateProjects();
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: (payload: UpdateProject) => updateProjectApi(payload),
    meta: { errorMode: "inline" },
    onSuccess: () => {
      invalidateProjects();
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (data: DeleteProject) => deleteProjectApi(data),
    onSuccess: () => {
      invalidateProjects();
    },
  });

  const removeUserFromProjectMutation = useMutation({
    mutationFn: (data: AddRemoveUserToProject) => removeUserToProject(data),
    onSuccess: () => {
      invalidateProjects();
    },
  });

  const addUserToProjectMutation = useMutation({
    mutationFn: (data: AddRemoveUserToProject) => addUserToProjectApi(data),
    meta: { errorMode: "inline" },
    onSuccess: () => {
      invalidateProjects();
    },
  });

  return {
    projects,
    loadProjects: projectsQuery.refetch,
    loading: projectsQuery.isLoading,
    error: projectsQuery.error,

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
