export function renderMessage(messageData) {
  // Formatear la fecha de creación
  const createDate = new Date(messageData.timestamp);
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  const formattedDate = createDate.toLocaleDateString("es-ES", options);

  const contentHtml = `
  <li class="message-card">
    <div class="message-details ">
      <div class="message-info">
        <h3 class="message-content">${messageData.message || messageData.content}</h3>
      </div>
      <div class="message-meta">
        <p class="message-date"> ${formattedDate}</p>
      </div>
    </div>
  </li>
`;

  return contentHtml;
}
