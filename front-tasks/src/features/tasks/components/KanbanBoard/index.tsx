// Container - organize the columns by status - use useTasks

import "./KanbanBoard.css";
import Column from "../Column";
import { useTasks } from "../../hooks/useTasks";
import TaskModal from "../../components/TaskModal/index.tsx";
import { useState } from "react";
import type { ReadAllTaskFromProjectInterface } from "../../schemas/Tasks.ts";

function KanbanBoard() {
  const { tasksInProject, isLoading, error } = useTasks();
  const [isShowModal, setShowModal] = useState(false);
  const [taskSelected, setTaskSelected] =
    useState<ReadAllTaskFromProjectInterface | null>(null);

  const handleShowModal = (taskId: number) => {
    const selected = tasksInProject.find((t) => t.task_id === taskId);

    if (selected) {
      setTaskSelected(selected);
      setShowModal(true);
    } else {
      console.error(`Tarea ${taskId} no encontrada.`);
    }
  };

  const handleHideModal = () => {
    setShowModal(false);
    setTaskSelected(null);
  };

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
    <>
      <div className="task-container">
        <Column
          column_text="To Do"
          tasks={todoTasks}
          onShowModal={handleShowModal}
        />
        <Column
          column_text="In Progress"
          tasks={inProgressTasks}
          onShowModal={handleShowModal}
        />
        <Column
          column_text="Done"
          tasks={doneTasks}
          onShowModal={handleShowModal}
        />
      </div>

      {taskSelected && (
        <TaskModal
          isShow={isShowModal}
          task={taskSelected}
          onClose={handleHideModal}
        />
      )}
    </>
  );
}

export default KanbanBoard;
