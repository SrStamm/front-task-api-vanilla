// Container - organize the columns by status - use useTasks

import "./KanbanBoard.css";
import Column from "../Column";

const tasks = [
  {
    task_id: 1,
    project_id: 2,
    title: "probando",
    description: "probando",
    date_exp: "2025-12-12",
    state: "En progreso",
    task_labels_links: [],
    asigned: [
      {
        user_id: 1,
        username: "test",
      },
    ],
  },
];

function KanbanBoard() {
  return (
    <>
      <div className="task-container">
        <Column column_text="To Do" tasks={tasks} />
        <Column column_text="In Progress" tasks={tasks} />
        <Column column_text="Done" tasks={tasks} />
      </div>
    </>
  );
}

export default KanbanBoard;
