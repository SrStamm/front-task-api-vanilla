// Task Card - contain data for task - click open task modal

import type { ReadAllTaskFromProjectInterface } from "../../schemas/Tasks";
import formatDate from "../../../../utils/formatedDate";
import "./TaskCard.css";
import { useDraggable } from "@dnd-kit/core";
import Skeleton from "../../../../components/common/Skeleton";
import { TASK_STATE_DEFINITIONS } from "../../constants/states";
import TaskStateBadge from "../TaskStateBadge";

interface TaskCardProps {
  task?: ReadAllTaskFromProjectInterface;
  onShowTaskModal?: (taskId: number) => void;
  loading?: boolean;
  /**
   * Rol de la tarjeta que se está arrastrando:
   * - "source": sigue en su columna original, se oculta porque el DragOverlay ya la
   *   representa siguiendo al cursor.
   * - "ghost": ya se movió a otra columna, se muestra como marcador para que se vea
   *   dónde va a caer antes de soltar.
   */
  dragRole?: "source" | "ghost";
}

function TaskCard({ task, onShowTaskModal, loading, dragRole }: TaskCardProps) {
  const formatedDate = task ? formatDate(task.date_exp) : "";

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task?.task_id ?? 0,
  });
  const style = {
    // El fantasma ya vive en la columna destino: no debe seguir al cursor.
    transform:
      dragRole === "ghost"
        ? undefined
        : transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
    opacity: dragRole === "source" ? 0 : 1,
  };

  // El estado crudo del API se traduce a la variante visual desde el mapa
  // compartido; el texto lo pone el badge.
  const variant = task
    ? (TASK_STATE_DEFINITIONS[task.state]?.variant ?? "unknown")
    : "todo";

  if (loading) {
    return (
      <li className="task-card todo">
        <div className="task-card-details">
          <div className="task-card-meta">
            <div className="task-info">
              <Skeleton width="80%" height="1.2rem" />
            </div>
            <Skeleton
              width="4rem"
              height="1.5rem"
              borderRadius="var(--radius)"
            />
          </div>
          <div className="task-description">
            <Skeleton width="100%" height="0.875rem" />
            <Skeleton width="60%" height="0.875rem" />
            <div>
              <Skeleton width="5rem" height="0.75rem" />
            </div>
            <div>
              <Skeleton width="3rem" height="0.75rem" />
            </div>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li
      className={`task-card ${variant}${dragRole === "ghost" ? " is-ghost" : ""}`}
      onClick={() => onShowTaskModal?.(task.task_id)}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <div className="task-card-details">
        <div className="task-card-meta">
          <div className="task-info">
            <h3 className="task-title">{task.title}</h3>
          </div>
          <TaskStateBadge state={task.state} />
        </div>

        <div className="task-description">
          {task.description}
          <div>
            <p className="task-date"> {formatedDate}</p>
          </div>
          <div>
            <p className="task-label">
              {task.task_label_links?.map((l) => l.label).join(", ")}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}

export default TaskCard;
