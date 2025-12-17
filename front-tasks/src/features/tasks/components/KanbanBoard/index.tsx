// Container - organize the columns by status - use useTasks

import "./KanbanBoard.css";
import Column from "../Column";
import TaskModal from "../../components/TaskModal/index.tsx";
import { useMemo, useState } from "react";
import type { ReadAllTaskFromProjectInterface } from "../../schemas/Tasks.ts";
import { useGroupProject } from "../../../../hooks/useGroupProject.ts";

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
  const { projectId } = useGroupProject();
  const [isShowModal, setShowModal] = useState(false);
  const [taskSelected, setTaskSelected] =
    useState<ReadAllTaskFromProjectInterface | null>(null);

  const { todoTasks, inProgressTasks, doneTasks } = useMemo(() => {
    if (!tasksInProject.length) {
      return { todoTasks: [], inProgressTasks: [], doneTasks: [] };
    }

    const todo = tasksInProject.filter((t) => t.state === "sin empezar");
    const inProgress = tasksInProject.filter((t) => t.state === "en proceso");
    const done = tasksInProject.filter((t) => t.state === "completado");

    return { todoTasks: todo, inProgressTasks: inProgress, doneTasks: done };
  }, [tasksInProject]);

  if (isLoading) return <p style={{ textAlign: "center" }}>Cargando...</p>;

  if (error)
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "red" }}>Error al cargar las tareas</p>
        <p style={{ color: "#666", fontSize: "0.9rem" }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{ marginTop: "1rem" }}
        >
          Reintentar
        </button>
      </div>
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

  if (tasksInProject.length === 0 && projectId) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <p style={{ color: "#666" }}>No hay tareas en este proyecto</p>
        <p style={{ color: "#999", fontSize: "0.9rem", marginTop: "0.5rem" }}>
          Crea tu primera tarea haciendo clic en el botón "+"
        </p>
      </div>
    );
  } else if (!projectId) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <p style={{ color: "#666" }}>No se ha seleccionado ningún proyecto</p>
        <p style={{ color: "#999", fontSize: "0.9rem", marginTop: "0.5rem" }}>
          Seleccione un proyecto en 'Proyecto actual'
        </p>
      </div>
    );
  }

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
