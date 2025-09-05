import { showModal, updateModalContent } from "../utils/modal.js";
import { showTab } from "../utils/utils.js";

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
  console.log("Renderizando modal de proyecto:", projectData);
  // Crea el contenido del modal
  const headerHtml = `<h4>${projectData.title}</h4>`;

  const bodyHtml = `
  <div class="modal-section">
    <p class="modal-description">${projectData.description}</p>
  </div>

  <div class="modal-tabs">
    <button class="tab-btn active" data-tab="members">Miembros</button>
    <button class="tab-btn " data-tab="tasks">Tareas</button>
    <button class="tab-btn" data-tab="settings">Configuración</button>
  </div>

  <div class="modal-section tab-content active" id="members-tab">
    <div class="modal-section-header">
      <h4 class="modal-subtitle"> Miembros del proyecto </h4>
      <button type="button" class="btn btn-accent btn-vsm" id="addUserToProject"
        data-project-id="${projectData.project_id}"
        data-project-title="${projectData.title}"
        data-project-description="${projectData.description}"
        data-group-id="${projectData.group_id}"> Añadir usuario</button>
    </div>
      <ul id="projectUsersList" class="listUser">
        ${projectData.users
          .map((user) =>
            renderUserInProject(
              projectData.group_id,
              projectData.project_id,
              user.user_id,
              user.username,
              user.permission,
            ),
          )
          .join("")}
      </ul>
    </div>
  </div>

  <div class="modal-section tab-content" id="tasks-tab">
    <div class="modal-section-header">
      <h4 class="modal-subtitle">  Tareas </h4>
      <button type="button" class="btn btn-accent btn-vsm" id="createTaskToProject"
        data-project-id="${projectData.project_id}"
        data-group-id="${projectData.group_id}"> Crear tarea</button>
    </div>
    <ul id="projectTaskList" class="list-template">
    <!-- Aquí se agregarán las tareas del proyecto -->
      <li> No hay tareas </li>
    </ul>
  </div>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-primary btn-sm" id="closeProjectDetails"> Cerrar </button>
    <button type="button" class="btn btn-secondary btn-sm" id="editProject" > Editar Proyecto </button>
  `;

  return {
    header: headerHtml,
    body: bodyHtml,
    footer: footerHtml,
    addClass: "modal-large",
    removeClass: "modal-small",
  };
}

export function renderUserInProject(
  groupId,
  projectId,
  userId,
  username,
  permission,
) {
  const contentHtml = `
  <li class="user-item">
    <div class="user-info">
      <div class="user-details">
        <p class="user-name">${username}</p>
        <p class="currentPermission user-role"> ${permission}</p>
      </div>
    <div class="user-actions">
      <button type="button" class="btn btn-vsm btn-outline-error manage-btn" id="deleteUserProject"
        data-group-id="${groupId}" data-project-id="${projectId}" data-user-id="${userId}" > Eliminar </button>
      <button type="button" class="btn btn-vsm btn-secondary" id="editPermissionProject"
        data-group-id="${groupId}" data-project-id="${projectId}" data-user-id="${userId}" > Editar </button>
    </div>
  </li>
`;

  return contentHtml;
}

export function showProjectDetailsModal(projectData) {
  console.log("Mostrando detalles del proyecto en modal:", projectData);
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
  console.log("Contenedor de pestañas:", tabsContainer);
  tabsContainer.addEventListener("click", (event) => {
    const target = event.target;

    // Maneja el cambio de pestañas
    if (target.classList.contains("tab-btn")) {
      console.log("Cambiando a la pestaña:", target.dataset.tab);
      // Muestra la sección correspondiente
      showTab(target.dataset.tab + "-tab");
    }
  });

  return modalContainer;
}

// Para renderizar modal de creación de proyecto

export function renderCreateProject(groupData) {
  console.log("Renderizando modal de creación de proyecto:", groupData);
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
  <li>
    <div class="body-template">
      <div class="info-template">
        <p> ${projectTitle}</p>
      </div>
    </div>
  </li>
`;
  return contentHtml;
}
