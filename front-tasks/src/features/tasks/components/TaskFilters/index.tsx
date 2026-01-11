import "./TaskFilters.css";

interface TaskFiltersProps {
  filters: { state: string; label: string };
  onChange: (newFilters: { state: string; label: string }) => void;
}

function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  const onChangeState = (newState: string) => {
    onChange({ ...filters, state: newState });
  };

  const onChangeLabel = (newLabel: string) => {
    onChange({ ...filters, label: newLabel });
  };

  return (
    <div className="task-filters-container">
      <div className="task-filters">
        <label>Estado:</label>
        <select
          className="input-base select-filter"
          value={filters.state}
          onChange={(e) => onChangeState(e.target.value)}
        >
          <option value=""></option>
          <option value="sin empezar">To Do</option>
          <option value="en proceso">In progress</option>
          <option value="completado">Done</option>
        </select>
      </div>
      <div className="task-filters">
        <label>Labels:</label>
        <select
          className="input-base select-filter"
          value={filters.label}
          onChange={(e) => onChangeLabel(e.target.value)}
        ></select>
      </div>
    </div>
  );
}

export default TaskFilters;
