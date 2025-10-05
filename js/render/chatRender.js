export function renderMessage(messageData, userId) {
  let createDate;

  if (messageData.timestamp === null) {
    createDate = new Date();
  } else {
    createDate = new Date(messageData.timestamp);
  }
  const currentDate = new Date();

  let formattedDate = "";
  let options = {};

  if (createDate.getFullYear() !== currentDate.getFullYear()) {
    options = { year: "numeric", month: "numeric", day: "numeric" };
    formattedDate = createDate.toLocaleDateString("es-ES", options);
  } else if (createDate.getMonth() !== currentDate.getMonth()) {
    options = { month: "numeric", day: "numeric" };
    formattedDate = createDate.toLocaleDateString("es-ES", options);
  } else {
    options = { hour: "2-digit", minute: "2-digit" };
    formattedDate = createDate.toLocaleTimeString("es-ES", options);
  }

  const contentHtml = `
  <li class="${userId === messageData.user_id || userId === messageData.sender_id ? "message-card active" : "message-card"}">
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
