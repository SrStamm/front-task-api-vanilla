// Manipulación del DOM y renderizado
// Contiene funciones para mostrar/ocultar secciones, modals, y renderizar datos

import { addUserToGroup, deleteUserFromGroup } from "./api.js";

export function showSections(sectionId) {
  // Oculta todas las secciones de contenido
  document.querySelectorAll("section").forEach((section) => {
    section.style.display = "none";
  });

  // Muestra la seccion que corresponde al ID
  document.getElementById(sectionId).style.display = "grid";
}

export function unauthorized() {
  // No autorizado, se oculta todo
  document.querySelector(".principal-layout").style.display = "none";

  // Muestra el formulario de login
  document.getElementById("formLogContainer").style.display = "flex";
}

export function loginSucces() {
  document.querySelector(".principal-layout").style.display = "flex";
  showSections("inicioSection");

  document.getElementById("formLogContainer").style.display = "none";
}

export function showLoginForm() {
  document.getElementById("loginSection").style.display = "block";
  document.getElementById("registerSection").style.display = "none";
}

export function showRegisterForm() {
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("registerSection").style.display = "block";
}

// Mostrar modal de group
export function showModal(modalId) {
  const modalGroupContainer = document.getElementById(modalId);

  modalGroupContainer.style.display = "flex";
}

export function occultModal(modalId) {
  const modalGroupContainer = document.getElementById(modalId);
  modalGroupContainer.style.display = "none";
}

// Muestra el modal de Group
export function showGroupDetailsModal(groupData) {
  showModal("modalInfoGroup");
  renderGroupInModal("modalInfoGroup", groupData);

  // Accede a los botones
  const modal = document.getElementById("modalInfoGroup");
  return modal;
}

function renderGroupInModal(elementId, groupData) {
  // Obtiene el contenedor principal del modal
  const modalContainer = document.getElementById(elementId);

  // Accede a cada parte del modal
  const groupName = modalContainer.querySelector(".groupName");
  const groupDescription = modalContainer.querySelector(".groupDescription");
  const userList = modalContainer.querySelector(".listUser");

  // VERIFICAR que los elementos existen antes de usarlos
  if (!groupName || !groupDescription) {
    console.error(
      "Error: No se encontraron todos los elementos en: ",
      elementId,
    );
    return;
  }

  // Actualiza con los datos obtenidos
  groupName.textContent = groupData.name;
  groupDescription.textContent = groupData.description || "Sin descripción";

  // Si se tiene una seccion de lista, renderiza y agrega a los usuarios
  if (userList) {
    // Limpiar la lista anterior
    userList.innerHTML = "";

    // Agregar usuarios si existen
    if (groupData.users && groupData.users.length > 0) {
      groupData.users.forEach((user) => {
        // Usa `renderUserInGroup` para agregar cada usuario a la lista
        renderUserInGroup(
          groupData.group_id,
          user.user_id,
          user.username,
          null,
        );
      });
    } else {
      userList.innerHTML = "<li>No hay miembros en este grupo</li>";
    }
  }
}

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

  // VERIFICAR que los elementos existen antes de usarlos
  if (!groupName || !groupDescription) {
    console.error(
      "Error: No se encontraron todos los elementos en: ",
      elementId,
    );
    return;
  }

  // Actualiza con los datos obtenidos
  groupName.textContent = groupData.name;
  groupDescription.textContent = groupData.description || "Sin descripción";

  // Si se tiene una seccion de lista, renderiza y agrega a los usuarios
  if (userList) {
    // Limpiar la lista anterior
    userList.innerHTML = "";

    // Agregar usuarios si existen
    if (groupData.users && groupData.users.length > 0) {
      groupData.users.forEach((user) => {
        renderUserInGroup(user.username, null);
      });
    } else {
      userList.innerHTML = "<li>No hay miembros en este grupo</li>";
    }
  }

  // Agrega los datos
  return clonTemplate;
}

// Render
function renderUserInGroup(groupId, userId, username, role) {
  // Accede al modal
  const modal = document.getElementById("modalInfoGroup");
  const userList = modal.querySelector(".listUser");

  // Accede al template de users in group
  const userGroupTemplate = document.getElementById("userGroupTemplate");
  const clonTemplate = userGroupTemplate.content.cloneNode(true);

  // Obtiene cada parte del template
  const userNameTemplate = clonTemplate.querySelector(".userName");
  const userRoleTemplate = clonTemplate.querySelector(".userRole");

  // Modifica cada parte
  userNameTemplate.textContent = username;
  userRoleTemplate.textContent = role || "Sin rol";

  // Configurar botones
  const deleteBtn = clonTemplate.querySelector("#deleteUserGroup");
  deleteBtn.onclick = () => deleteUserFromGroup(groupId, userId);

  const editBtn = clonTemplate.querySelector("#editRoleGroup");
  editBtn.onclick = () =>
    console.log("Editar rol del usuario en el grupo:", groupId);

  userList.appendChild(clonTemplate);
}

// Renderiza una lista de usuarios
export function renderUsers(userId, username) {
  // Accede al template de users
  const userGroupTemplate = document.getElementById("userList");
  const clonTemplate = userGroupTemplate.content.cloneNode(true);

  // Obtiene cada parte del template
  const userNameTemplate = clonTemplate.querySelector(".userName");
  const userIdTemplate = clonTemplate.querySelector(".userId");

  // Modifica cada parte
  userNameTemplate.textContent = username;
  userIdTemplate.textContent = userId;

  return clonTemplate;
}
