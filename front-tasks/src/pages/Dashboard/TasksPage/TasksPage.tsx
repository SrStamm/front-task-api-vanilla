import { useCallback, useState } from "react";
import { useTasks } from "../../../features/tasks/hooks/useTasks";
import KanbanBoard from "../../../features/tasks/components/KanbanBoard";
import TaskFormModal from "../../../features/tasks/components/TaskFormModal";
import Button from "../../../components/common/Button";
import type { ReadAllTaskFromProjectInterface } from "../../../features/tasks/schemas/Tasks";
import "./TasksPage.css";
import TaskFilters from "../../../features/tasks/components/TaskFilters";

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
            className={`tab-title tab-element ${tabSelected == "all" ? "active" : ""}`}
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

      {tabSelected == "project" ? (
        <>
          <TaskFilters filters={filters} onChange={setFilters} />

          <KanbanBoard
            tasksInProject={tasksInProject}
            isLoading={isLoading}
            error={error}
            onEdit={handleOpenEditModal}
          />

          <TaskFormModal
            showModal={showFormModal}
            mode={typeFormModal}
            initialData={selectedTask || undefined}
            onClose={handleCloseCreateModal}
            onCreate={create}
            onUpdate={update}
            isCreating={isCreating}
            isUpdating={isUpdating}
            onSuccess={loadTasksFromProject}
          />
        </>
      ) : (
        <p>Lista de todas las tareas, no implementada todavía</p>
      )}
    </section>
  );
}

export default TaskPage;
