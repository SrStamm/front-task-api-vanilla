import type { ReadTaskInterface } from "../../schemas/Tasks";
import formatDate from "../../../../utils/formatedDate";
import "./RowTable.css";
import TaskStateBadge from "../TaskStateBadge";

interface RowTableProps {
  task: ReadTaskInterface;
}

function RowTable({ task }: RowTableProps) {
  const formatedDate = formatDate(task.date_exp);

  return (
    <tr>
      <td>{task.title}</td>
      <td>{formatedDate}</td>
      <td>
        <TaskStateBadge state={task.state} />
      </td>
    </tr>
  );
}

export default RowTable;
