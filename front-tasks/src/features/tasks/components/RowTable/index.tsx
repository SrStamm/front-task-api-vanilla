import type { ReadTaskInterface } from "../../schemas/Tasks";

interface RowTableProps {
  task: ReadTaskInterface;
}

function RowTable({ task }: RowTableProps) {
  return (
    <div>
      <p>{task.title}</p>
    </div>
  );
}

export default RowTable;
