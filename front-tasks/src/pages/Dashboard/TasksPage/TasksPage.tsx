import { useState } from "react";
import KanbanBoard from "../../../features/tasks/components/KanbanBoard";
import TaskFormModal from "../../../features/tasks/components/TaskFormModal";
import "./TasksPage.css";
import Button from "../../../components/common/Button";
import { useTasks } from "../../../features/tasks/hooks/useTasks";

function TaskPage() {
  const [showFormModal, setShowFormModal] = useState(false);
  const [typeFormModal, setTypeFormModal] = useState<"create" | "edit">("edit");
  const { loadTasksFromProject, tasksInProject, isLoading, error, create } =
    useTasks();

  const handleOpenCreateModal = () => {
    setTypeFormModal("create");
    setShowFormModal(true);
  };

  const handleOpenEditModal = () => {
    setTypeFormModal("edit");
    setShowFormModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowFormModal(false);
  };

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
        onClose={handleCloseCreateModal}
        onSubmit={create}
        onSuccess={loadTasksFromProject}
      />
    </section>
  );
}

export default TaskPage;
