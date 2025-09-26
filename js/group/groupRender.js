// Move renderGroup, renderUserInGroup, and renderUsers into this file
// Rendering group-related elements. This file would handle the creation of the HTML templates and their population data

import { showModal, updateModalContent } from "../utils/modal.js";
import { showTab } from "../utils/utils.js";
import { renderProjectInGroup } from "../project/projectRender.js";

// Función que renderiza los grupos
export function renderGroup(elementId, groupData) {
  // Obtiene el template
  const groupTemplate = document.getElementById(elementId);

  // Copia el template
  const clonTemplate = groupTemplate.content.cloneNode(true);

  // Accede a cada parte del template
  const groupName = clonTemplate.querySelector(".groupName");
  const groupDescription = clonTemplate.querySelector(".groupDescription");
  const manageBtn = clonTemplate.querySelector(".btn-manage");

  // VERIFICAR que los elementos existen antes de usarlos
  if (!groupName || !groupDescription) {
    console.error(
      "Error: No se encontraron todos los elementos en: ",
      elementId,
    );
    return;
  }

  if (groupData.description === null) {
    groupData.description = "Sin descripción";
  }

  // Actualiza con los datos obtenidos
  groupName.textContent = groupData.name;
  groupDescription.textContent = groupData.description;

  //
  manageBtn.dataset.groupId = groupData.group_id;
  manageBtn.dataset.name = groupData.name;
  manageBtn.dataset.description = groupData.description;

  // Agrega los datos
  return clonTemplate;
}

// Muestra el modal de Group
export function showGroupDetailsModal(groupData) {
  // Renderiza el modal con la información del grupo
  const content = newRenderGroupInModal(groupData);
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
  modalContainer.dataset.groupData = JSON.stringify(groupData);

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

// Renderiza el modal de detalles del grupo
export function newRenderGroupInModal(groupData) {
  console.log("Renderizando modal de grupo:", groupData);

  // Crea el contenido del modal
  const headerHtml = `<h3 class="modal-title">${groupData.name}</h3>`;

  const bodyHtml = `
  <div class="modal-section">
    <p class="modal-description"> ${groupData.description} </p>
  </div>
 
  <div class="modal-tabs">
    <button class="tab-btn active" data-tab="projects">Proyectos</button>
    <button class="tab-btn" data-tab="members">Miembros</button>
  </div>

  <div class="modal-section tab-content active" id="projects-tab">
    <div class="modal-section-header">
      <h4 class="modal-subtitle" >Proyectos</h4>
      <button type="button" class="btn btn-primary btn-vsm" id="createProject"
        data-group-id="${groupData.group_id}"> Crear proyecto </button>
    </div>
    <ol class="listProject">
      ${
        groupData.projects.length <= 0 || groupData.projects === null
          ? "<li>No hay proyectos en este grupo</li>"
          : groupData.projects
              .map((project) => renderProjectInGroup(project.title))
              .join("")
      }
    </ol>
  </div>

  <div class="modal-section tab-content" id="members-tab">
    <div class="modal-section-header ">
      <h4 class="modal-subtitle">Miembros</h4>
      <button type="button" class="btn btn-primary btn-vsm" id="addUserGroup"
        data-group-id="${groupData.group_id}"
      > Agregar Usuario </button>
    </div>
    <ol class="listUser">
        ${
          groupData.users.length <= 0 || groupData.users === null
            ? "<li>No hay usuarios en este grupo</li>;"
            : groupData.users
                .map((user) =>
                  newRenderUserInGroup(
                    groupData.group_id,
                    user.user_id,
                    user.username,
                    user.role,
                  ),
                )
                .join("")
        }
    </ol>
  </div>
`;

  const footerHtml = `
      <button type="button" class="btn btn-secondary btn-sm" id="editGroup"
        data-group-id="${groupData.group_id}"
      > Editar Grupo </button>
      <button type="button" class="btn btn-error btn-sm" id="deleteGroup"
        data-group-id="${groupData.group_id}"
      > Eliminar Grupo </button>
  `;

  return {
    header: headerHtml,
    body: bodyHtml,
    footer: footerHtml,
    addClass: "modal-med",
    removeClass: "modal-small",
  };
}

export function newRenderUserInGroup(groupId, userId, username, role) {
  const contentHtml = `
  <li class="user-item">
    <div class="user-info">
      <div class="user-details">
        <p class="user-name"> ${username}</p>
        <p class="currentRole user-role"> ${role}</p>
      </div>
    </div>
    <div class="user-actions">
      <select class="role-select" data-user-id="${userId}" data-role="${role}"  style="display: none" disabled>
        <option value="member" ${role === "member" ? "selected" : ""}>Miembro</option>
        <option value="editor" ${role === "editor" ? "selected" : ""}>Editor</option>
        <option value="admin" ${role === "admin" ? "selected" : ""}>Administrador</option>
      </select>
      <button type="button" class="btn btn-vsm btn-secondary" id="editRoleGroup"
        data-group-id="${groupId}" data-user-id="${userId}" > Editar </button>
      <button type="button" class="btn btn-vsm btn-outline-error manage-btn" id="deleteUserGroup"
        data-group-id="${groupId}" data-user-id="${userId}" > Eliminar </button>
    </div>
  </li>
`;

  return contentHtml;
}

//
export function renderGroupToEdit(groupData) {
  console.log("Renderizando modal de edición de grupo:", groupData);
  // Crea el contenido del modal
  const headerHtml = `<h4>Editar el grupo</h4>`;

  const bodyHtml = `
    <form>
      <div>
        <label for="editGroupName">Nombre del grupo:</label>
        <input type="text" class="input-base" id="editGroupName" value="${groupData.name}"/>
      </div>
      <div>
        <label for="editGroupDescription">Descripción:</label>
        <textarea rows="3" cols="3" class="input-base"  id="editGroupDescription"> ${groupData.description} </textarea>
      </div>
    </form>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-primary btn-sm" id="confirmEditGroup"
      data-group-id="${groupData.group_id}"
    > Confirmar </button>
    <button type="button" class="btn btn-error btn-sm" id="cancelEditGroup"
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
  };
}
