// Task Card - contain data for task - click open task modal

import type { ReadAllTaskFromProjectInterface } from "../../schemas/Tasks";
import "./TaskCard.css";

interface TaskCardProps {
  task: ReadAllTaskFromProjectInterface;
}

function TaskCard({ task }: TaskCardProps) {
  return (
    <li className="task-card">
      <div className="task-card-details">
        <div className="task-info">
          <h3 className="task-title">{task.title}</h3>
        </div>
        <div className="task-description">
          {task.description && task.description}
        </div>
        <div className="task-card-meta">
          <div>
            <p className="task-date"> {task.date_exp}</p>
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
