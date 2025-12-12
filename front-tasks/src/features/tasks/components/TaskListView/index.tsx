import type { ReadTaskInterface } from "../../schemas/Tasks";
import RowTable from "../RowTable";
import "./TaskListView.css";

interface TaskListViewProps {
  tasks: ReadTaskInterface[];
}

function TaskListView({ tasks }: TaskListViewProps) {
  return (
    <div>
      {tasks.map((t) => (
        <RowTable task={t} key={t.task_id} />
      ))}
    </div>
  );
}

export default TaskListView;
