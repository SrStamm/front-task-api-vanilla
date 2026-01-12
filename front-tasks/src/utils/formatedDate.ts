function formatDate(dateString: any) {
  const date = new Date(dateString);

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const mes = currentDate.getMonth(); // Enero es 0
  const dia = currentDate.getDate();

  let options: Intl.DateTimeFormatOptions = {};

  if (date.getFullYear() == year) {
    if (date.getMonth() == mes && date.getDate() == dia) {
      options = {
        hour: "2-digit",
        minute: "2-digit",
      };
    } else {
      options = {
        month: "2-digit",
        day: "2-digit",
      };
    }
  } else {
    options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
  }

  return date.toLocaleTimeString("es-ES", options);
}

export default formatDate;
