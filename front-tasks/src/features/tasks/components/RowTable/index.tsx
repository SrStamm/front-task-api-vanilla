import type { ReadTaskInterface } from "../../schemas/Tasks";
import "./RowTable.css";

interface RowTableProps {
  task: ReadTaskInterface;
}

function RowTable({ task }: RowTableProps) {
  const dueDate = new Date(task.date_exp);
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formatedDate = dueDate.toLocaleDateString("es-ES", options);

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
