// Container - organize the columns by status - use useTasks

import "./KanbanBoard.css";
import Column from "../Column";
import TaskModal from "../../components/TaskModal/index.tsx";
import { useEffect, useState } from "react";
import type { ReadAllTaskFromProjectInterface } from "../../schemas/Tasks.ts";

interface KanbanBoardProps {
  tasksInProject: ReadAllTaskFromProjectInterface[];
  isLoading: boolean;
  error: string | null;
  onEdit: (t: ReadAllTaskFromProjectInterface) => void;
}

function KanbanBoard({
  tasksInProject,
  isLoading,
  error,
  onEdit,
}: KanbanBoardProps) {
  const [isShowModal, setShowModal] = useState(false);
  const [taskSelected, setTaskSelected] =
    useState<ReadAllTaskFromProjectInterface | null>(null);

  const [todoTasks, setTodoTasks] = useState<ReadAllTaskFromProjectInterface[]>(
    [],
  );
  const [inProgressTasks, setInProgressTasks] = useState<
    ReadAllTaskFromProjectInterface[]
  >([]);
  const [doneTasks, setDoneTasks] = useState<ReadAllTaskFromProjectInterface[]>(
    [],
  );

  useEffect(() => {
    if (tasksInProject.length > 0) {
      const todo = tasksInProject.filter((t) => t.state === "sin empezar");
      setTodoTasks(todo);

      const inProgress = tasksInProject.filter((t) => t.state === "en proceso");
      setInProgressTasks(inProgress);

      const done = tasksInProject.filter((t) => t.state === "completado");
      setDoneTasks(done);
    }
  }, [tasksInProject]);

  if (isLoading) return <p style={{ textAlign: "center" }}>Cargando...</p>;

  if (error)
    return (
      <p
        style={{ textAlign: "center", color: "red" }}
      >{`Error al cargar las tareas: ${error}`}</p>
    );

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
          onEdit={onEdit}
        />
      )}
    </>
  );
}

export default KanbanBoard;
