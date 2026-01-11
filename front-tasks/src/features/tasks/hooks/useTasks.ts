import {
  FetchCreateTask,
  FetchDeleteTask,
  FetchTaskAssignedToUser,
  FetchTaskToProject,
  FetchUpdateTask,
} from "../api/TaskService";
import { useGroupProject } from "../../../hooks/useGroupProject";
import type { ReadAllTaskFromProjectInterface } from "../schemas/Tasks";
import type { CreateTask, UpdateTask } from "../../../types/Task";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

interface useTasksFilters {
  label: string;
  state: string;
}

const ITEMS_PER_PAGE: number = 30;

export function useTasks({ state, label }: useTasksFilters) {
  const { projectId } = useGroupProject();
  const queryClient = useQueryClient();

  // --- GET ---
  const {
    data: tasksInProject = [],
    isLoading,
    error,
    refetch: loadTasksFromProject,
  } = useQuery({
    queryKey: ["tasks", projectId, state, label],
    queryFn: () => {
      if (!projectId) throw new Error("Project not selected");
      return FetchTaskToProject({
        projectId,
        filters: {
          state: state,
          label: label,
        },
      });
    },
    enabled: !!projectId,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });

  const {
    data: taskForUser,
    refetch: loadAllTaskFromUser,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["tasks-user", state, label],
    queryFn: ({ pageParam = 0 }) => {
      return FetchTaskAssignedToUser(pageParam, ITEMS_PER_PAGE, {
        state: state,
        label: label,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < ITEMS_PER_PAGE) {
        return undefined;
      }

      const nextSkip = allPages.length * ITEMS_PER_PAGE;

      return nextSkip;
    },

    initialPageParam: 0,
  });

  const taskForUserFlat = taskForUser?.pages?.flatMap((page) => page) || [];

  // --- POST ---
  const create = useMutation({
    mutationFn: (payload: CreateTask) =>
      FetchCreateTask(payload.project_id, payload),
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", newTask.projectId],
      });
    },
  });

  // --- PATCH ---
  const update = useMutation({
    mutationFn: (payload: UpdateTask) =>
      FetchUpdateTask(payload.project_id, payload.task_id, payload),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(
        ["tasks", projectId, state, label],
        (oldTasks: ReadAllTaskFromProjectInterface[] = []) =>
          oldTasks.map((task) =>
            task.task_id === updatedTask.task_id ? updatedTask : task,
          ),
      );
    },
  });

  // --- DELETE ---
  const remove = useMutation({
    mutationFn: ({
      projectId,
      taskId,
    }: {
      projectId: number;
      taskId: number;
    }) => FetchDeleteTask(projectId, taskId),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        ["tasks", projectId, state, label],
        (oldTasks: ReadAllTaskFromProjectInterface[] = []) =>
          oldTasks.filter((t) => t.task_id !== variables.taskId),
      );
    },
  });

  return {
    // Datos y estados
    tasksInProject,
    isLoading,
    error,

    taskForUser: taskForUserFlat,
    loadAllTaskFromUser,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,

    // Acciones
    loadTasksFromProject,
    create: create.mutate,
    update: update.mutate,
    remove: remove.mutate,

    // Estados de mutaciones
    isCreating: create.isPending,
    isUpdating: update.isPending,
    isDeleting: remove.isPending,
  };
}
