import { useCallback, useState } from "react";
import { useTasks } from "../../../features/tasks/hooks/useTasks";
import KanbanBoard from "../../../features/tasks/components/KanbanBoard";
import TaskFormModal from "../../../features/tasks/components/TaskFormModal";
import Button from "../../../components/common/Button";
import type { ReadAllTaskFromProjectInterface } from "../../../features/tasks/schemas/Tasks";
import "./TasksPage.css";

function TaskPage() {
  const [showFormModal, setShowFormModal] = useState(false);
  const [typeFormModal, setTypeFormModal] = useState<"create" | "edit">("edit");
  const [selectedTask, setSelectedTask] =
    useState<ReadAllTaskFromProjectInterface | null>(null);
  const {
    loadTasksFromProject,
    tasksInProject,
    isLoading,
    error,
    create,
    update,
  } = useTasks();

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
        <h3 className="dashboard-layout-h3">Tareas</h3>
        <Button
          className="btn-primary"
          text="+"
          onClick={handleOpenCreateModal}
        />
      </header>

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
        onSubmit={typeFormModal === "create" ? create : update}
        onSuccess={loadTasksFromProject}
      />
    </section>
  );
}

export default TaskPage;
