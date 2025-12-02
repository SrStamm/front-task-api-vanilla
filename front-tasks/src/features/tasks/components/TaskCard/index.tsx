// Task Card - contain data for task - click open task modal

import type { ReadAllTaskFromProjectInterface } from "../../schemas/Tasks";
import "./TaskCard.css";

interface TaskCardProps {
  task: ReadAllTaskFromProjectInterface;
}

function TaskCard({ task }: TaskCardProps) {
  const dueDate = new Date(task.date_exp);
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formatedDate = dueDate.toLocaleDateString("es-ES", options);

  const state =
    task.state == "En progreso"
      ? "in-progress"
      : task.state == "Completado"
        ? "done"
        : "todo";
  return (
    <li className={`task-card ${state}`}>
      <div className="task-card-details">
        <div className="task-card-meta">
          <div className="task-info">
            <h3 className="task-title">{task.title}</h3>
          </div>
          <div className={`task-state ${state}`}>{task.state}</div>
        </div>

        <div className="task-description">
          {task.description && task.description}
          <div>
            <p className="task-date"> {formatedDate}</p>
          </div>
          <div>
            <p className="task-label">
              {task.task_labels_links && task.task_labels_links}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}

export default TaskCard;
