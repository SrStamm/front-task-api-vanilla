// Kanban column (Todo, In Progress, Done) - show TaskCards
import { useDroppable } from "@dnd-kit/core";
import type { ReadAllTaskFromProjectInterface } from "../../schemas/Tasks";
import TaskCard from "../TaskCard";
import "./Column.css";

interface ColumnProps {
  column_text: string;
  tasks: ReadAllTaskFromProjectInterface[];
  onShowModal: (taskId: number) => void;
}

function Column({ column_text, tasks, onShowModal }: ColumnProps) {
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
          return (
            <TaskCard key={t.task_id} task={t} onShowTaskModal={onShowModal} />
          );
        })}
      </ol>
    </div>
  );
}

export default Column;
