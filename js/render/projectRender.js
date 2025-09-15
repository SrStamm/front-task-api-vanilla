import { showModal, updateModalContent } from "../utils/modal.js";
import { showTab } from "../utils/utils.js";
import { renderTaskInProject } from "./taskRender.js";
import { renderUserInProject } from "./userRender.js";

// Función que renderiza los proyectos
export function renderProject(elementId, projectData) {
  // Obtiene el template
  const projectTemplate = document.getElementById(elementId);

  // Copia el template
  const clonTemplate = projectTemplate.content.cloneNode(true);

  // Accede a cada parte del template
  const projectTitle = clonTemplate.querySelector(".projectTitle");
  const projectDescription = clonTemplate.querySelector(".projectDescription");
  const viewBtn = clonTemplate.querySelector(".view-project-btn");

  // VERIFICAR que los elementos existen antes de usarlos
  if (!projectTitle || !projectDescription) {
    console.error(
      "Error: No se encontraron todos los elementos en: ",
      elementId,
    );
    return;
  }

  if (projectData.description === null) {
    projectData.description = "Sin descripción";
  }

  // Actualiza con los datos obtenidos
  projectTitle.textContent = projectData.title;
  projectDescription.textContent = projectData.description;

  //
  viewBtn.dataset.groupId = projectData.group_id;
  viewBtn.dataset.projectId = projectData.project_id;
  viewBtn.dataset.title = projectData.title;
  viewBtn.dataset.description = projectData.description;

  // Agrega los datos
  return clonTemplate;
}

export function renderProjectInModal(projectData) {
  // Crea el contenido del modal
  const headerHtml = `<h3 class="modal-title">${projectData.title}</h3>`;

  console.log(projectData);

  const bodyHtml = `
  <div class="modal-section">
    <p class="modal-description">${projectData.description}</p>
  </div>

  <div class="modal-tabs">
    <button class="tab-btn active" data-tab="members">Miembros</button>
    <button class="tab-btn " data-tab="tasks">Tareas</button>
  </div>

  <div class="modal-section tab-content active" id="members-tab">
    <div class="modal-section-header">
      <h4 class="modal-subtitle"> Miembros del proyecto </h4>
      <button type="button" class="btn btn-accent btn-vsm" id="showListUserToAdd"
        data-project-id="${projectData.project_id}"
        data-project-title="${projectData.title}"
        data-project-description="${projectData.description}"
        data-group-id="${projectData.group_id}"> Añadir usuario</button>
    </div>

    <ul id="projectUsersList" class="listUser">
      ${
        projectData.users.length === 0
          ? "<li>No hay usuarios en el proyecto</li>"
          : projectData.users
              .map((user) =>
                renderUserInProject(
                  projectData.group_id,
                  projectData.project_id,
                  user.user_id,
                  user.username,
                  user.permission,
                ),
              )
              .join("")
      }
    </ul>
  </div>

  <div class="modal-section tab-content" id="tasks-tab">
    <div class="modal-section-header">
      <h4 class="modal-subtitle">  Tareas </h4>

      <div class="modal-section-action ">
        <button type="button" class="btn btn-accent btn-vsm" id="showFormTaskToProject"
          data-project-id="${projectData.project_id}"
          data-group-id="${projectData.group_id}"> Crear tarea</button>
      </div>
    </div>


    <ul id="projectTaskList" class="task-project-list">
      ${
        projectData.tasks.length === 0
          ? "<li>No hay tareas en el proyecto</li>"
          : projectData.tasks.map((task) => renderTaskInProject(task)).join("")
      }
    </ul>

  </div>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-secondary btn-sm" id="editProject" >
    <img src="./assets/pencil.png" alt=""> Editar
    </button>
    <button type="button" class="btn btn-error btn-sm" id="deleteProject"
     data-group-id="${projectData.group_id}" data-project-id="${projectData.project_id}" >
    <img src="./assets/trash.png" alt=""> Eliminar </button>
  `;

  return {
    header: headerHtml,
    body: bodyHtml,
    footer: footerHtml,
    addClass: "modal-med",
    removeClass: "modal-large",
  };
}

export function showProjectDetailsModal(projectData) {
  const content = renderProjectInModal(projectData);
  showModal("genericModal");
  updateModalContent(
    content.header,
    content.body,
    content.footer,
    content.addClass,
    content.removeClass,
  );

  // Accede a los botones
  const modalContainer = document.getElementById("genericModal");
  modalContainer.dataset.projectData = JSON.stringify(projectData);

  const tabsContainer = document.querySelector(".modal-tabs");

  tabsContainer.addEventListener("click", (event) => {
    const target = event.target;

    // Maneja el cambio de pestañas
    if (target.classList.contains("tab-btn")) {
      // Muestra la sección correspondiente
      showTab(target.dataset.tab + "-tab");
    }
  });

  return modalContainer;
}

// Para renderizar modal de creación de proyecto

export function renderCreateProject(groupData) {
  // Crea el contenido del modal
  const headerHtml = `<h4>Crear proyecto</h4>`;

  const bodyHtml = `
    <form>
      <label for="createProjectName">Nombre del proyecto:</label>
      <input type="text" id="createProjectNameName"/>
      <label for="createProjectDescription">Descripción:</label>
      <textarea rows="3" cols="3" id="createProjectName" ></textarea>
    </form>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-primary btn-sm" id="confirCreateProject"
      data-group-id="${groupData.group_id}"
      data-group-name="${groupData.name}"
      data-group-description="${groupData.description}"
    > Confirmar </button>
    <button type="button" class="btn btn-error btn-sm" id="cancelCreateProject"
    data-group-id="${groupData.group_id}"
    data-group-name="${groupData.name}"
    data-group-description="${groupData.description}"
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

// Para renderizar lista de proyectos en modal de grupo
export function renderProjectInGroup(projectTitle) {
  const contentHtml = `
  <li class="project-item">
      <p> ${projectTitle}</p>
  </li>
`;
  return contentHtml;
}

// Renderiza lista de proyectos para acceder a las tareas
export function renderMinimalProject(projectData) {
  // Obtiene el template
  const projectTemplate = document.getElementById("minimalistProjectTemplate");
  const clon = projectTemplate.content.cloneNode(true);

  // Accede al elemento principal y al titulo
  const projectCard = clon.querySelector(".project-item");
  const projectTitle = clon.querySelector(".projectTitle");

  // VERIFICAR que los elementos existen antes de usarlos
  if (!projectTitle) {
    console.error(
      "Error: No se encontraron todos los elementos en projectTemplate",
    );
    return;
  }

  // Actualiza con los datos obtenidos
  projectTitle.textContent = projectData.title;

  //
  projectCard.dataset.groupId = projectData.group_id;
  projectCard.dataset.projectId = projectData.project_id;
  projectCard.dataset.title = projectData.title;

  // Agrega los datos
  return clon;
}
