import "./TasksPage.css";
import { useCallback, useRef, useState } from "react";
import { useTasks } from "../../../features/tasks/hooks/useTasks";
import Button from "../../../components/common/Button";
import KanbanBoard from "../../../features/tasks/components/KanbanBoard";
import TaskFormModal from "../../../features/tasks/components/TaskFormModal";
import TaskFilters from "../../../features/tasks/components/TaskFilters";
import TaskTable from "../../../features/tasks/components/TaskTable";
import type { ReadAllTaskFromProjectInterface } from "../../../features/tasks/schemas/Tasks";
import { CreateTask, UpdateTask } from "../../../types/Task";
import { getApiErrorMessage } from "../../../utils/errors";

function TaskPage() {
  const [showFormModal, setShowFormModal] = useState(false);
  const [typeFormModal, setTypeFormModal] = useState<"create" | "edit">("edit");
  const [selectedTask, setSelectedTask] =
    useState<ReadAllTaskFromProjectInterface | null>(null);
  const [filters, setFilters] = useState({ state: "", label: "" });
  const [tabSelected, setTabSelected] = useState<"project" | "all">("project");
  const projectTabRef = useRef<HTMLButtonElement>(null);
  const allTabRef = useRef<HTMLButtonElement>(null);

  const {
    tasksInProject,
    isLoading,
    error,
    errorUser,
    create,
    update,
    isCreating,
    isUpdating,
    taskForUser,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    remove,
    loadAllTaskFromUser,
    loadTasksFromProject,
  } = useTasks(filters);

  const handleOpenCreateModal = useCallback(() => {
    setTypeFormModal("create");
    setShowFormModal(true);
  }, [setShowFormModal]);

  const handleOpenEditModal = useCallback(
    (t: ReadAllTaskFromProjectInterface) => {
      setTypeFormModal("edit");
      setSelectedTask(t);
      setShowFormModal(true);
    },
    [setSelectedTask, setShowFormModal],
  );

  const handleCloseCreateModal = useCallback(() => {
    setShowFormModal(false);
  }, [setShowFormModal]);

  const handleCreate = async (data: CreateTask) => {
    await create(data);
  };

  const handleUpdate = async (data: UpdateTask) => {
    await update(data);
  };

  const handleDelete = async (t: ReadAllTaskFromProjectInterface) => {
    await remove({ projectId: t.project_id, taskId: t.task_id });
  };

  return (
    <section className="dashboard-section ">
      <header className="headerPartSection task-header">
        <div className="tab" role="tablist" aria-label="Vistas de tareas">
          <button
            type="button"
            role="tab"
            id="tasks-tab-project"
            ref={projectTabRef}
            className={`tab-element ${tabSelected == "project" ? "active" : ""}`}
            aria-selected={tabSelected == "project"}
            aria-controls="tasks-panel-project"
            tabIndex={tabSelected == "project" ? 0 : -1}
            onClick={() => setTabSelected("project")}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                setTabSelected("all");
                allTabRef.current?.focus();
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                setTabSelected("all");
                allTabRef.current?.focus();
              } else if (e.key === "Home") {
                e.preventDefault();
                setTabSelected("project");
                projectTabRef.current?.focus();
              } else if (e.key === "End") {
                e.preventDefault();
                setTabSelected("all");
                allTabRef.current?.focus();
              }
            }}
          >
            Tareas del proyecto
          </button>
          <button
            type="button"
            role="tab"
            id="tasks-tab-all"
            ref={allTabRef}
            className={`tab-element ${tabSelected == "all" ? "active" : ""}`}
            aria-selected={tabSelected == "all"}
            aria-controls="tasks-panel-all"
            tabIndex={tabSelected == "all" ? 0 : -1}
            onClick={() => setTabSelected("all")}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                setTabSelected("project");
                projectTabRef.current?.focus();
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                setTabSelected("project");
                projectTabRef.current?.focus();
              } else if (e.key === "Home") {
                e.preventDefault();
                setTabSelected("project");
                projectTabRef.current?.focus();
              } else if (e.key === "End") {
                e.preventDefault();
                setTabSelected("all");
                allTabRef.current?.focus();
              }
            }}
          >
            Mis tareas
          </button>
        </div>

        {tabSelected == "project" ? (
          <Button
            className="btn-primary"
            text="+"
            onClick={handleOpenCreateModal}
          />
        ) : (
          ""
        )}
      </header>

      <TaskFilters filters={filters} onChange={setFilters} />
      {tabSelected == "project" ? (
        <div role="tabpanel" id="tasks-panel-project" aria-labelledby="tasks-tab-project" tabIndex={0}>
          <KanbanBoard
            childModal={showFormModal}
            tasksInProject={tasksInProject}
            isLoading={isLoading}
            error={error ? getApiErrorMessage(error) : null}
            onEdit={handleOpenEditModal}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onRetry={loadTasksFromProject}
          />

          <TaskFormModal
            showModal={showFormModal}
            mode={typeFormModal}
            initialData={selectedTask || undefined}
            onClose={handleCloseCreateModal}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            isCreating={isCreating}
            isUpdating={isUpdating}
          />
        </div>
      ) : (
        <div role="tabpanel" id="tasks-panel-all" aria-labelledby="tasks-tab-all" tabIndex={0}>
          <TaskTable
            tasks={taskForUser}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            error={errorUser ? getApiErrorMessage(errorUser) : null}
            onRetry={loadAllTaskFromUser}
          />
        </div>
      )}
    </section>
  );
}

export default TaskPage;
