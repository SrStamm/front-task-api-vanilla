// Kanban column (Todo, In Progress, Done) - show TaskCards
import { useDroppable } from "@dnd-kit/core";
import type { ReadAllTaskFromProjectInterface } from "../../schemas/Tasks";
import TaskCard from "../TaskCard";
import "./Column.css";

interface ColumnProps {
  column_text: string;
  tasks: ReadAllTaskFromProjectInterface[];
  onShowModal: (taskId: number) => void;
  /** Tarea que se está arrastrando y el estado desde el que salió. */
  draggedTaskId?: number | null;
  draggedTaskOriginState?: string | null;
}

function Column({
  column_text,
  tasks,
  onShowModal,
  draggedTaskId,
  draggedTaskOriginState,
}: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column_text,
  });

  return (
    <div className="task-column" ref={setNodeRef}>
      <div className="column-header">
        <h4>{column_text}</h4>
        <p className={"task-quantity"}>{tasks.length}</p>
      </div>
      <ol className="list-task">
        {tasks.map((t) => {
          // La tarjeta arrastrada se oculta en su columna original, pero se muestra
          // como fantasma en la columna a la que se está moviendo.
          const dragRole =
            draggedTaskId != null && t.task_id === draggedTaskId
              ? t.state === draggedTaskOriginState
                ? "source"
                : "ghost"
              : undefined;

          return (
            <TaskCard
              key={t.task_id}
              task={t}
              onShowTaskModal={onShowModal}
              dragRole={dragRole}
            />
          );
        })}
      </ol>
    </div>
  );
}

export default Column;
