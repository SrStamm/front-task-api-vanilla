/* Debe tener nombre, fecha de creación y el contenido */
export function renderComment(comment) {
  const createDate = new Date(comment.created_at);
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
  <li class="comment-card">
    <div class="comment-details ">
      <div class="comment-info">
        <h3 class="comment-content">${comment.content}</h3>
      </div>
      <div class="comment-meta">
        <p class="comment-date"> ${formattedDate}</p>
      </div>
    </div>
  </li>
`;

  return contentHtml;
}
