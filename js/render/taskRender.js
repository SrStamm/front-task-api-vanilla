import { showModal, updateModalContent } from "../utils/modal.js";

export function renderTaskInProject(TaskData) {
  const dueDate = new Date(TaskData.date_exp);
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = dueDate.toLocaleDateString("es-ES", options);

  const contentHtml = `
  <li class="task-item task-card-project">
    <div class="task-details">
      <div class="task-meta">
        <p class="task-state"> ${TaskData.state}</p>
        <p class="task-due"> <img src="../assets/calendar-alt.png">${formattedDate}</p>
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
  // Formatear la fecha de vencimiento
  const dueDate = new Date(taskData.date_exp);
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = dueDate.toLocaleDateString("es-ES", options);

  // Modificar el estado al formato en inglés
  taskData.state = modifyState(taskData.state);

  // Convertir el objeto taskData a una cadena JSON
  const taskDataString = JSON.stringify(taskData);

  const contentHtml = `
  <li class="task-card" data-task-data='${taskDataString}' >
    <div class="task-card-details ">
      <div class="task-info">
        <h3 class="task-title">${taskData.title}</h3>
      </div>
      <div class="task-description">
        <p>${taskData.description === null || taskData.description === "" ? "No hay descripción" : taskData.description}</p>
      </div>
      <div class="task-card-meta">
        <div class="">
          <p class="task-date"> <img src="../assets/calendar-alt.png"> ${formattedDate}</p>
        </div>
        <div>
          <p class="task-label"> ${taskData.task_label_links}</p>
        </div>
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

function renderModalTask(taskData) {
  const dueDate = new Date(taskData.date_exp);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = dueDate.toLocaleDateString("es-ES", options);

  const headerHtml = `<h3 class="modal-title">${taskData.title}</h3>`;

  const bodyHtml = `
    <div class="task-details">
      <div class="task-details-row">
        <div class="detail-label"> Estado: </div>
        <div class="detail-value">
          <span class="task-state">
            ${taskData.state}
          </span>
        </div>
      </div>
      <div class="task-details-row">
        <div class="detail-label"> Fecha limite: </div>
        <div class="detail-value">${formattedDate}</div>
      </div>
      <div class="task-details-row">
        <div class="detail-label"> Asignado a: </div>
        <div class="detail-value">${taskData.asigned}</div>
      </div>
    </div>
    <div class="task-description-full">
      <h4 class="modal-subtitle ">Descripción</h4>
      <p>${taskData.description === null || taskData.description === "" ? "No hay descripción" : taskData.description}</p>
    </div>

    <div class="modal-tabs">
      <button class="tab-btn active" data-tab="comments">Comentarios</button>
    </div>

    <div class="modal-section tab-content active"></div>
    <ol class="listComments">
      ${
        taskData.comments.length <= 0 || taskData.comments === null
          ? "<li>No hay comentarios</li>"
          : "<li>Sin funcion para renderizar</li>"
      }
    </ol>

  `;

  /*
    taskData.comments.map((comment) => renderComment(comment)).join("")
  */

  const footerHtml = `
  <button type="button" class="btn btn-primary btn-sm" id="editTask"
    data-task-id="${taskData.task_id}"
  > Editar </button>
  <button type="button" class="btn btn-secondary btn-sm" id="editStateTask"
    data-task-id="${taskData.task_id}"
  > Cambiar estado </button>
`;

  return {
    header: headerHtml,
    body: bodyHtml,
    footer: footerHtml,
    addClass: "modal-med",
  };
}

export function showTaskDetailsModal(taskData) {
  const content = renderModalTask(taskData);

  // Muestra el modal
  showModal("genericModal");

  updateModalContent(
    content.header,
    content.body,
    content.footer,
    content.addClass,
  );

  // Accede a los botones
  const modalContainer = document.getElementById("genericModal");
  modalContainer.dataset.taskData = JSON.stringify(taskData);

  const spanState = modalContainer.querySelector(".task-state");

  // Modifica el estado que se muestra dentro del modal
  if (taskData.state === "Done") {
    spanState.classList.add("done");
  } else if (taskData.state === "In Progress") {
    spanState.classList.add("in-progress");
  } else if (taskData.state === "To Do") {
    spanState.classList.add("todo");
  }

  return modalContainer;
}
