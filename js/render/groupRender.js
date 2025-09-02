// Move renderGroup, renderUserInGroup, and renderUsers into this file
// Rendering group-related elements. This file would handle the creation of the HTML templates and their population data

import { getUsersInGroup } from "../api.js";
import { showModal, updateModalContent } from "../utils/modal.js";

// Función que renderiza los grupos
export function renderGroup(elementId, groupData) {
  // Obtiene el template
  const groupTemplate = document.getElementById(elementId);

  // Copia el template
  const clonTemplate = groupTemplate.content.cloneNode(true);

  // Accede a cada parte del template
  const groupName = clonTemplate.querySelector(".groupName");
  const groupDescription = clonTemplate.querySelector(".groupDescription");
  const userList = clonTemplate.querySelector(".listUser");
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

  // Si se tiene una seccion de lista, renderiza y agrega a los usuarios
  if (userList) {
    // Limpiar la lista anterior
    userList.innerHTML = "";

    // Agregar usuarios si existen
    if (groupData.users && groupData.users.length > 0) {
      groupData.users.forEach((user) => {
        renderUserInGroup(
          userList,
          groupData.group_id,
          user.user_id,
          user.username,
          user.role,
        );
      });
    } else {
      userList.innerHTML = "<li>No hay miembros en este grupo</li>";
    }
  }

  // Agrega los datos
  return clonTemplate;
}

// Muestra el modal de Group
export function showGroupDetailsModal(groupData) {
  console.log("Mostrando modal de grupo:", groupData);

  // Renderiza el modal con la información del grupo
  const content = newRenderGroupInModal(groupData);
  showModal("genericModal");
  updateModalContent(
    content.header,
    content.body,
    content.footer,
    content.addClass,
  );

  // Accede a los botones
  const modalContainer = document.getElementById("genericModal");
  modalContainer.dataset.groupData = JSON.stringify(groupData);

  return modalContainer;
}

// Renderiza el modal de detalles del grupo
export function newRenderGroupInModal(groupData) {
  console.log("Renderizando modal de grupo:", groupData);

  // Crea el contenido del modal
  const headerHtml = `<h3>${groupData.name}</h3>`;

  const bodyHtml = `
  <div>
    <h4>Descripción:</h4>
    <p> ${groupData.description} </p>
  </div>
  <div>
    <h4>Miembros</h4>
    <div>
      <ol class="listUser">
          ${groupData.users
            .map((user) =>
              newRenderUserInGroup(
                groupData.group_id,
                user.user_id,
                user.username,
                user.role,
              ),
            )
            .join("")}
      </ol>
    </div>
  </div>
`;

  const footerHtml = `
    <button type="button" class="btn btn-primary btn-sm" id="addUserGroup"
      data-group-id="${groupData.group_id}"
    > Agregar Usuario </button>
    <button type="button" class="btn btn-error btn-sm" id="deleteGroup"
      data-group-id="${groupData.group_id}"
    > Eliminar Grupo </button>
  `;

  return {
    header: headerHtml,
    body: bodyHtml,
    footer: footerHtml,
    addClass: "modal-large",
  };
}

// Función que renderiza usuarios que son miembros de un grupo
export function renderUserInGroup(
  userListElement,
  groupId,
  userId,
  username,
  role,
) {
  // Accede al template de users in group
  const userGroupTemplate = document.getElementById("userGroupTemplate");
  const clonTemplate = userGroupTemplate.content.cloneNode(true);

  // Obtiene cada parte del template
  const userNameTemplate = clonTemplate.querySelector(".userName");
  const userRoleTemplate = clonTemplate.querySelector(".userRole");
  const deleteBtn = clonTemplate.querySelector("#deleteUserGroup");
  const editBtn = clonTemplate.querySelector("#editRoleGroup");

  // Modifica cada parte
  userNameTemplate.textContent = username;
  userRoleTemplate.textContent = role;

  // Configurar los data-set para los botones
  deleteBtn.dataset.groupId = groupId;
  deleteBtn.dataset.userId = userId;
  editBtn.dataset.groupId = groupId;
  editBtn.dataset.userId = userId;

  // Configurar botones
  editBtn.onclick = () => console.log("Editado rol del usuario");

  userListElement.appendChild(clonTemplate);
}

export function newRenderUserInGroup(groupId, userId, username, role) {
  const contentHtml = `
  <li>
    <div class="info-template">
      <p> ${username}</p>
    </div>
    <div>
      <p> ${role}</p>
    </div>
    <div class="actionTemplate">
      <button type="button" class="btn btn-vsm btn-outline-error manage-btn" id="deleteUserGroup"
        data-group-id="${groupId}" data-user-id="${userId}"
      > Eliminar </button>
      <button type="button" class="btn btn-vsm btn-secondary" id="editRoleGroup"
        data-group-id="${groupId}" data-user-id="${userId}"
      > Editar </button>
    </div>
  </li>
`;

  // Obtiene cada parte del template
  // const editBtn = document.querySelector("#editRoleGroup");

  // Configurar botones
  // editBtn.onclick = () => console.log("Editado rol del usuario");

  return contentHtml;
}
