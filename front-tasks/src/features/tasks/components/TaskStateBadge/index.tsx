import {
  TASK_STATE_DEFINITIONS,
  type TaskStateVariant,
} from "../../constants/states";
import "./TaskStateBadge.css";

interface TaskStateBadgeProps {
  /** Estado crudo que devuelve la API ("sin empezar", "en proceso", ...). */
  state: string;
  className?: string;
}

/**
 * Píldora de estado compartida: la usan la tarjeta del tablero, la fila de la
 * tabla y el modal de detalle, para que el mismo estado se lea igual en todas
 * partes.
 */
function TaskStateBadge({ state, className }: TaskStateBadgeProps) {
  const definition = TASK_STATE_DEFINITIONS[state];
  const variant: TaskStateVariant = definition?.variant ?? "unknown";
  // Un estado desconocido se muestra tal cual: no se inventa un color.
  const label = definition?.label ?? state;
  const classNames = ["task-state-badge", variant, className]
    .filter(Boolean)
    .join(" ");

  return <span className={classNames}>{label}</span>;
}

export default TaskStateBadge;
