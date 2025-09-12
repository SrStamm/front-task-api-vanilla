export function renderTaskInProject(TaskData) {
  const dueDate = new Date(TaskData.date_exp);
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  const formattedDate = dueDate.toLocaleDateString("es-ES", options);

  const contentHtml = `
  <li class="task-item task-card-project">
    <div class="task-details">
      <div class="task-meta">
        <p class="task-state"> ${TaskData.state}</p>
        <p class="task-due"> ${formattedDate}</p>
      </div>
      <div class="task-info">
        <p class="task-title">${TaskData.title}</p>
      </div>
    </div>
  </li>
`;

  return contentHtml;
}

export function renderCreateTask(projectId, projectUsers) {
  // Crea el contenido del modal
  const headerHtml = `<h4>Crear tarea</h4>`;

  const userListHtml = projectUsers
    .map(
      (user) =>
        `
      <div class="user-checkbox">
        <input type=checkbox id="user-${user.user_id}" class="form-input-checkbox" name="assignedUsers" value="${user.user_id}">
        <label for="user-${user.user_id}"> Usuario ${user.username} </label>
      </div>
      `,
    )
    .join("");

  const bodyHtml = `
    <form class="">
      <label for="taskTitle">Titulo:</label>
      <input type="text" id="taskTitle" required />
      <label for="taskDescription">Descripción:</label>
      <textarea rows="3" cols="3" id="taskDescription" ></textarea>
      <label for="taskDueDate">Fecha de vencimiento:</label>
      <input type="date" id="taskDueDate" required />
      <div class="user-selection-container">
        <h5>Asignar a usuarios:</h5>
        ${userListHtml}
      </div>
    </form>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-primary btn-sm" id="confirmCreateTask"
      data-project-id="${projectId}"
    > Confirmar </button>
    <button type="button" class="btn btn-error btn-sm" id="cancelCreateTask"
    data-project-id="${projectId}"
    > Cancelar </button>
  `;

  return {
    header: headerHtml,
    body: bodyHtml,
    footer: footerHtml,
    addClass: "modal-small",
    removeClass: "modal-large",
  };
}

export function renderTask(taskData) {
  const dueDate = new Date(taskData.date_exp);
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  const formattedDate = dueDate.toLocaleDateString("es-ES", options);

  taskData.state = modifyState(taskData.state);

  const contentHtml = `
  <li class="task-card">
    <div class="task-card-details ">
      <div class="task-card-meta">
        <div>
          <p class="task-state"> ${taskData.state}</p>
        </div>
        <div>
          <p class=""> ${formattedDate}</p>
        </div>
        <div>
          <p class="task-label"> ${taskData.task_label_links}</p>
        </div>
      </div>
      <div class="task-info">
        <p class="task-title">${taskData.title}</p>
      </div>
    </div>
  </li>
`;

  return contentHtml;
}

function modifyState(state) {
  if (state === "completado") {
    return "Done";
  } else if (state === "en proceso") {
    return "In Progress";
  } else if (state === "sin empezar") {
    return "To Do";
  } else {
    return "Canceled";
  }
}
