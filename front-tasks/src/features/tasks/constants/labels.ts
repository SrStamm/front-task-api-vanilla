export const TYPE_OF_LABELS = [
  "bug",
  "feature",
  "refactor",
  "docs",
  "tests",
  "ui/ux",
  "urgent",
  "high_priority",
  "medium_priority",
  "low_priority",
  "blocker",
  "frontend",
  "backend",
  "database",
  "api",
  "infrastructure",
] as const;

export type TaskLabel = (typeof TYPE_OF_LABELS)[number];

/**
 * Los labels viajan a la API en minúsculas y con guiones bajos
 * ("high_priority"); la interfaz los muestra en sentence case
 * ("High priority"). El valor que se envía al backend no cambia.
 */
const LABEL_DISPLAY_OVERRIDES: Partial<Record<TaskLabel, string>> = {
  "ui/ux": "UI/UX",
  api: "API",
};

export function getLabelDisplayName(label: string): string {
  const override = LABEL_DISPLAY_OVERRIDES[label as TaskLabel];

  if (override) {
    return override;
  }

  const readable = label.replace(/_/g, " ");

  return readable.charAt(0).toUpperCase() + readable.slice(1);
}
