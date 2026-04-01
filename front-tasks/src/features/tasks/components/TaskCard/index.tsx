// Task Card - contain data for task - click open task modal

import type { ReadAllTaskFromProjectInterface } from "../../schemas/Tasks";
import formatDate from "../../../../utils/formatedDate";
import "./TaskCard.css";
import { useDraggable } from "@dnd-kit/core";
import Skeleton from "../../../../components/common/Skeleton";

interface TaskCardProps {
  task?: ReadAllTaskFromProjectInterface;
  onShowTaskModal?: (taskId: number) => void;
  loading?: boolean;
}

function TaskCard({ task, onShowTaskModal, loading }: TaskCardProps) {
  const formatedDate = task ? formatDate(task.date_exp) : "";

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task?.task_id ?? 0,
    });
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0 : 1,
  };

  const state = task
    ? task.state == "en proceso"
      ? "in-progress"
      : task.state == "completado"
        ? "done"
        : "todo"
    : "todo";

  if (loading) {
    return (
      <li className="task-card todo">
        <div className="task-card-details">
          <div className="task-card-meta">
            <div className="task-info">
              <Skeleton width="80%" height="1.2rem" />
            </div>
            <Skeleton width="4rem" height="1.5rem" borderRadius="var(--radius)" />
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
      className={`task-card ${state}`}
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
          <div className={`task-state ${state}`}>{task.state}</div>
        </div>

        <div className="task-description">
          {task.description}
          <div>
            <p className="task-date"> {formatedDate}</p>
          </div>
          <div>
            <p className="task-label">{task.task_labels_links}</p>
          </div>
        </div>
      </div>
    </li>
  );
}

export default TaskCard;
