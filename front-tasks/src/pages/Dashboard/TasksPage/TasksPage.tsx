import KanbanBoard from "../../../features/tasks/components/KanbanBoard";
import "./TasksPage.css";

function TaskPage() {
  return (
    <section className="dashboard-section ">
      <header className="headerPartSection">
        <h3 className="dashboard-layout-h3">Tareas</h3>
      </header>

      <KanbanBoard />
    </section>
  );
}

export default TaskPage;
