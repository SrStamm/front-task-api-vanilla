function formatDate(dateString: any) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  return dateString.toLocaleDateString("es-ES", options);
}

export default formatDate;
