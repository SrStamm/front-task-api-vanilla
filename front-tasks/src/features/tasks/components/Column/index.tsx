// Kanban column (Todo, In Progress, Done) - show TaskCards
import type { ReadAllTaskFromProjectInterface } from "../../schemas/Tasks";
import TaskCard from "../TaskCard";
import "./Column.css";

interface ColumnProps {
  column_text: string;
  tasks: ReadAllTaskFromProjectInterface[];
  onShowModal: (taskId: number) => void;
}

function Column({ column_text, tasks, onShowModal }: ColumnProps) {
  return (
    <div className="task-column">
      <div className="column-header">
        <h4>{column_text}</h4>
        <p className={"task-quantity"}>{tasks.length}</p>
      </div>
      <ol className="list-task">
        {tasks.map((t) => {
          return (
            <TaskCard key={t.task_id} task={t} onShowTaskModal={onShowModal} />
          );
        })}
      </ol>
    </div>
  );
}

export default Column;
