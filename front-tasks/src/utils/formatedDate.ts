function formatDate(dateString: string | number | Date) {
  if (!dateString) return "Sin fecha límite";

  const date = new Date(dateString);
  const now = new Date();

  // Normalizar a medianoche para comparar solo fechas
  const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Si es hoy → mostrar hora
  if (dateDay.getTime() === nowDay.getTime()) {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Si es de este año → día y mes
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
    });
  }

  // Otros años → día, mes y año
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default formatDate;
