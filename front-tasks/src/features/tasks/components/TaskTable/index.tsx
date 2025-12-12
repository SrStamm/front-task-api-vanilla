import type { ReadTaskInterface } from "../../schemas/Tasks";
import HeaderTable from "../HeaderTable";
import RowTable from "../RowTable";
import "./TaskTable.css";

interface TaskTableProps {
  tasks: ReadTaskInterface[];
}

function TaskTable({ tasks }: TaskTableProps) {
  return (
    <table className="task-table">
      <HeaderTable />
      <tbody>
        {tasks.map((t) => (
          <RowTable task={t} key={t.task_id} />
        ))}
      </tbody>
    </table>
  );
}

export default TaskTable;
