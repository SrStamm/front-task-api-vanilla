export function getApiErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) return "Algo salió mal";

  // fetch() rechaza con TypeError antes de siquiera haber HTTP
  if (error instanceof TypeError) {
    return "Sin conexión. Revisá tu red e intentá de nuevo.";
  }

  const match = error.message.match(/^HTTP (\d+): ([\s\S]*)$/);
  if (!match) return "Algo salió mal.";

  const status = Number(match[1]);
  let detail = "";

  try {
    const parsed = JSON.parse(match[2]);
    // FastAPI: 400/403/404 mandan detail como string;
    // 422 (validación) lo manda como ARRAY de objetos
    if (typeof parsed.detail === "string") detail = parsed.detail;
    else if (Array.isArray(parsed.detail))
      detail = "Revisá los datos ingresados.";
  } catch {
    // el body vino truncado o no-JSON: caemos al map por status
  }

  if (status === 401) return "Sesión expirada. Volvé a iniciar sesión.";
  if (status === 403) return detail || "No tenés permisos para esta acción.";
  if (status === 404) return detail || "No se encontró lo que buscás.";
  if (status === 400 || status === 422)
    return detail || "Revisá los datos ingresados.";
  if (status >= 500) return "Algo salió mal del lado del servidor.";
  return detail || "No se pudo completar la acción.";
}
