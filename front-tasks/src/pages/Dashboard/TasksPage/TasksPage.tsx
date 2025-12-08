import { useState } from "react";
import CreateTaskModal from "../../../features/tasks/components/CreateTaskModal";
import KanbanBoard from "../../../features/tasks/components/KanbanBoard";
import "./TasksPage.css";
import Button from "../../../components/common/Button";

function TaskPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

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

      <KanbanBoard />
      <CreateTaskModal
        showModal={showCreateModal}
        onClose={handleCloseCreateModal}
      />
    </section>
  );
}

export default TaskPage;
