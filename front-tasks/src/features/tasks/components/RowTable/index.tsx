import type { ReadTaskInterface } from "../../schemas/Tasks";
import formatDate from "../../../../utils/formatedDate";
import "./RowTable.css";

interface RowTableProps {
  task: ReadTaskInterface;
}

function RowTable({ task }: RowTableProps) {
  const formatedDate = formatDate(task.date_exp);

  const stateClass =
    task.state === "sin empezar"
      ? "status-todo"
      : task.state === "en proceso"
        ? "statis-in-progress"
        : "status-done";

  return (
    <tr>
      <td>{task.title}</td>
      <td>{formatedDate}</td>
      <td className={`status-pill ${stateClass}`}>{task.state}</td>
    </tr>
  );
}

export default RowTable;
