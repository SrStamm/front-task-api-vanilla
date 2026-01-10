// Task Card - contain data for task - click open task modal

import type { ReadAllTaskFromProjectInterface } from "../../schemas/Tasks";
import formatDate from "../../../../utils/formatedDate";
import "./TaskCard.css";

interface TaskCardProps {
  task: ReadAllTaskFromProjectInterface;
  onShowTaskModal: (taskId: number) => void;
}

function TaskCard({ task, onShowTaskModal }: TaskCardProps) {
  const dueDate = new Date(task.date_exp);
  const formatedDate = formatDate(dueDate);

  const state =
    task.state == "en proceso"
      ? "in-progress"
      : task.state == "completado"
        ? "done"
        : "todo";

  return (
    <li
      className={`task-card ${state}`}
      onClick={() => onShowTaskModal(task.task_id)}
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
