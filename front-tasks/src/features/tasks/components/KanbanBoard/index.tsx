// Container - organize the columns by status - use useTasks

import "./KanbanBoard.css";
import Column from "../Column";
import { useTasks } from "../../hooks/useTasks";

function KanbanBoard() {
  const { tasksInProject, isLoading, error } = useTasks();

  if (isLoading) return <p style={{ textAlign: "center" }}>Cargando...</p>;
  if (error)
    return (
      <p
        style={{ textAlign: "center", color: "red" }}
      >{`Error al cargar las tareas: ${error}`}</p>
    );

  const todoTasks = tasksInProject.filter((t) => t.state === "sin empezar");
  const inProgressTasks = tasksInProject.filter(
    (t) => t.state === "en proceso",
  );
  const doneTasks = tasksInProject.filter((t) => t.state === "completado");

  console.log(todoTasks);

  return (
    <div className="task-container">
      <Column column_text="To Do" tasks={todoTasks} />
      <Column column_text="In Progress" tasks={inProgressTasks} />
      <Column column_text="Done" tasks={doneTasks} />
    </div>
  );
}

export default KanbanBoard;
