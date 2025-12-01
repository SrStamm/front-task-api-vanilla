// Kanban column (Todo, In Progress, Done) - show TaskCards
import type { ReadAllTaskFromProjectInterface } from "../../schemas/Tasks";
import TaskCard from "../TaskCard";
import "./Column.css";

interface ColumnProps {
  column_text: string;
  tasks: ReadAllTaskFromProjectInterface[];
}

function Column({ column_text, tasks }: ColumnProps) {
  return (
    <div className="task-column">
      <div className="column-header">
        <div>
          <h4>{column_text}</h4>
          <p className="task-quantity"></p>
        </div>
      </div>
      <ol className="list-task">
        {tasks.map((t) => {
          return <TaskCard task={t} />;
        })}
      </ol>
    </div>
  );
}

export default Column;
