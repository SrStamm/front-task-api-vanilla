import { TYPE_OF_LABELS } from "../../constants/labels";
import {
  FILTERABLE_TASK_STATES,
  TASK_STATE_DEFINITIONS,
} from "../../constants/states";
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
          {FILTERABLE_TASK_STATES.map((state) => (
            <option key={state} value={state}>
              {TASK_STATE_DEFINITIONS[state]?.label ?? state}
            </option>
          ))}
        </select>
      </div>
      <div className="task-filters">
        <label>Labels:</label>
        <select
          className="input-base select-filter"
          value={filters.label}
          onChange={(e) => onChangeLabel(e.target.value)}
        >
          <option value=""></option>

          {TYPE_OF_LABELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default TaskFilters;
