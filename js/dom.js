// Manipulación del DOM y renderizado
// Contiene funciones para mostrar/ocultar secciones, modals, y renderizar datos

import { addUserToGroup, deleteGroup, deleteUserFromGroup } from "./api.js";
import { loadGroup } from "./dashboard.js";

export function showMessage(message, type = "error") {
  // Vacia por si habia un mensaje antes
  messageContainer.style.display = "none";
  messageContainer.textContent = "";

  // Actualiza el mensaje y lo muestra
  messageContainer.textContent = message;
  messageContainer.className = `alert alert-${type}`;
  messageContainer.style.display = "block";

  setTimeout(() => {
    messageContainer.style.display = "none";
    messageContainer.textContent = "";
  }, 4000);
}

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
  document.querySelector(".principal-layout").style.display = "grid";
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

// Mostrar modal
export function showModal(modalId) {
  const modalContainer = document.getElementById(modalId);
  modalContainer.classList.remove("hidden"); // Asegura que sea visible
  setTimeout(() => {
    modalContainer.classList.add("show"); // Activa la animación
  }, 10); // Pequeño retraso para que la transición ocurra
}

export function occultModal(modalId) {
  const modalGroupContainer = document.getElementById(modalId);
  modalGroupContainer.classList.remove("show"); // Quita la clase para fade-out
  setTimeout(() => {
    modalGroupContainer.classList.add("hidden"); // Oculta después de la animación
  }, 300); // Espera la duración de la transición (0.3s)
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

  // Accede a botones para almacenar información
  const addUserBtn = modalContainer.querySelector("#addUserGroup");
  const deleteGroupBtn = modalContainer.querySelector("#deleteGroup");

  // Almacena la información necesaria
  deleteGroupBtn.dataset.groupId = groupData.group_id;

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
          user.role,
        );
        addUserBtn.dataset.groupId = groupData.group_id;
        addUserBtn.dataset.userId = user.user_id;
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
  const manageBtn = clonTemplate.querySelector(".btn-manage");

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
  userRoleTemplate.textContent = role;

  // Configurar botones

  const editBtn = clonTemplate.querySelector("#editRoleGroup");
  editBtn.onclick = () => console.log("Editado rol del usuario");

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
