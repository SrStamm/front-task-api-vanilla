import { useCallback, useEffect, useState } from "react";
import {
  FetchCreateTask,
  FetchDeleteTask,
  FetchTaskToProject,
  FetchUpdateTask,
} from "../api/TaskService";
import { useGroupProject } from "../../../hooks/useGroupProject";
import type { ReadAllTaskFromProjectInterface } from "../schemas/Tasks";
import type { CreateTask, UpdateTask } from "../../../types/Task";

export function useTasks() {
  const { projectId } = useGroupProject();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tasksInProject, setTasksInProject] = useState<
    ReadAllTaskFromProjectInterface[]
  >([]);

  const loadTasksFromProject = useCallback(async () => {
    setLoading(true);
    try {
      if (projectId == null) return setError("Project not selected");
      const projects = await FetchTaskToProject(projectId);
      setTasksInProject(projects);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadTasksFromProject();
  }, [loadTasksFromProject]);

  const create = async (payload: CreateTask) => {
    try {
      const t = await FetchCreateTask(payload.project_id, payload);
      setTasksInProject((prev) => [...prev, t]);
    } catch (err) {
      setError(err);
    }
  };

  const update = async (
    projectId: number,
    taskId: number,
    payload: UpdateTask,
  ) => {
    try {
      const t = await FetchUpdateTask(projectId, taskId, payload);
      setTasksInProject((prev) =>
        prev.map((p) => (p.task_id === taskId ? t : p)),
      );
    } catch (err) {
      setError(err);
    }
  };

  const remove = async (projectId: number, taskId: number) => {
    try {
      await FetchDeleteTask(projectId, taskId);
      setTasksInProject((prev) => prev.filter((p) => p.task_id !== taskId));
    } catch (err) {
      setError(err);
    }
  };

  return {
    loadTasksFromProject,
    isLoading,
    error,
    tasksInProject,
    create,
    update,
    remove,
  };
}
