// Move renderGroup, renderUserInGroup, and renderUsers into this file
// Rendering group-related elements. This file would handle the creation of the HTML templates and their population data

import { getUsersInGroup } from "../api.js";
import { showModal } from "../utils/modal.js";

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
  renderGroupInModal("modalInfoGroup", groupData).then(() => {
    showModal("modalInfoGroup");
  });

  // Accede a los botones
  const modal = document.getElementById("modalInfoGroup");

  return modal;
}

// Renderiza el modal de detalles del grupo
export async function renderGroupInModal(elementId, groupData) {
  // Obtiene el contenedor principal del modal
  const modalContainer = document.getElementById(elementId);

  // Accede a cada parte del modal
  const modalContent = modalContainer.querySelector(".modal");
  const groupName = modalContent.querySelector(".groupName");
  const groupDescription = modalContent.querySelector(".groupDescription");
  const userList = modalContent.querySelector(".listUser");

  // Accede a botones para almacenar información
  const addUserBtn = modalContainer.querySelector("#addUserGroup");
  const deleteGroupBtn = modalContainer.querySelector("#deleteGroup");

  // Almacena la información necesaria
  addUserBtn.dataset.groupId = groupData.group_id;
  deleteGroupBtn.dataset.groupId = groupData.group_id;

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

  // Si se tiene una seccion de lista, renderiza y agrega a los usuarios
  if (userList) {
    // Limpiar la lista anterior
    userList.innerHTML = "";

    // Obtiene los usuarios del grupo
    let users = await getUsersInGroup(groupData.group_id);

    // Agregar usuarios si existen
    if (users.length > 0) {
      users.forEach((user) => {
        // Usa `renderUserInGroup` para agregar cada usuario a la lista
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
