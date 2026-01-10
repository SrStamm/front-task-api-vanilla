import { useCallback, useState } from "react";
import { useTasks } from "../../../features/tasks/hooks/useTasks";
import Button from "../../../components/common/Button";
import KanbanBoard from "../../../features/tasks/components/KanbanBoard";
import TaskFormModal from "../../../features/tasks/components/TaskFormModal";
import TaskFilters from "../../../features/tasks/components/TaskFilters";
import TaskTable from "../../../features/tasks/components/TaskTable";
import type { ReadAllTaskFromProjectInterface } from "../../../features/tasks/schemas/Tasks";
import "./TasksPage.css";
import { CreateTask, UpdateTask } from "../../../types/Task";

function TaskPage() {
  const [showFormModal, setShowFormModal] = useState(false);
  const [typeFormModal, setTypeFormModal] = useState<"create" | "edit">("edit");
  const [selectedTask, setSelectedTask] =
    useState<ReadAllTaskFromProjectInterface | null>(null);
  const [filters, setFilters] = useState({ state: "", label: "" });
  const [tabSelected, setTabSelected] = useState<"project" | "all">("project");
  const {
    loadTasksFromProject,
    tasksInProject,
    isLoading,
    error,
    create,
    update,
    isCreating,
    isUpdating,
    taskForUser,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
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
    create(data);
  };

  const handleUpdate = async (data: UpdateTask) => {
    update(data);
  };

  return (
    <section className="dashboard-section ">
      <header className="headerPartSection">
        <div className="tab">
          <h3
            className={`dashboard-layout-h3 tab-element ${tabSelected == "project" ? "active" : ""}`}
            onClick={() => setTabSelected("project")}
          >
            Tareas del proyecto
          </h3>
          <h3
            className={`dashboard-layout-h3 tab-element ${tabSelected == "all" ? "active" : ""}`}
            onClick={() => setTabSelected("all")}
          >
            Mis tareas
          </h3>
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
        <>
          <KanbanBoard
            childModal={showFormModal}
            tasksInProject={tasksInProject}
            isLoading={isLoading}
            error={error?.message ?? null}
            onEdit={handleOpenEditModal}
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
            onSuccess={loadTasksFromProject}
          />
        </>
      ) : (
        <>
          <TaskTable
            tasks={taskForUser}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </>
      )}
    </section>
  );
}

export default TaskPage;
