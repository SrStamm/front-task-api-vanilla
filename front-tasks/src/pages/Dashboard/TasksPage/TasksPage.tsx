import { useState } from "react";
import CreateTaskModal from "../../../features/tasks/components/CreateTaskModal";
import KanbanBoard from "../../../features/tasks/components/KanbanBoard";
import "./TasksPage.css";
import Button from "../../../components/common/Button";
import { useTasks } from "../../../features/tasks/hooks/useTasks";

function TaskPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { loadTasksFromProject, tasksInProject, isLoading, error, create } =
    useTasks();

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
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
      />

      <CreateTaskModal
        showModal={showCreateModal}
        onClose={handleCloseCreateModal}
        onCreate={create}
        onSuccess={loadTasksFromProject}
      />
    </section>
  );
}

export default TaskPage;
