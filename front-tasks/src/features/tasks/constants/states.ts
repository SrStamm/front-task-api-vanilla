export type TaskStateVariant =
  | "todo"
  | "in-progress"
  | "done"
  | "cancelled"
  | "unknown";

export interface TaskStateDefinition {
  /** Texto que ve el usuario. */
  label: string;
  /** Variante visual: decide el color del badge y del borde de la tarjeta. */
  variant: TaskStateVariant;
}

/**
 * Estados que devuelve la API y su representación visual. Única fuente de
 * verdad: el badge, la tabla, el modal y los desplegables leen de aquí.
 */
export const TASK_STATE_DEFINITIONS: Record<string, TaskStateDefinition> = {
  "sin empezar": { label: "To Do", variant: "todo" },
  "en proceso": { label: "In Progress", variant: "in-progress" },
  completado: { label: "Done", variant: "done" },
  cancelado: { label: "Cancelled", variant: "cancelled" },
};

/**
 * Estados que tienen columna en el tablero: son los que ofrecen los
 * desplegables de estado (el filtro y el formulario).
 */
export const FILTERABLE_TASK_STATES = [
  "sin empezar",
  "en proceso",
  "completado",
] as const;
