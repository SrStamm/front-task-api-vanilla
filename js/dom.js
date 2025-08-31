// Manipulación del DOM y renderizado
// Contiene funciones para mostrar/ocultar secciones, modals, y renderizar datos

import { getUsersInGroup } from "./api.js";

// Obtener referencias a los elementos
const spinnerContainer = document.getElementById("spinner-container");
const spinnerElement = document.querySelector(".spinner"); // Para manejar la clase del spinner

// Función para mostrar el spinner
export function showSpinner() {
  spinnerContainer.style.display = "block"; // Muestra el contenedor
  spinnerElement.classList.remove("spinner-hidden"); // Asegura que el spinner no esté oculto por estilos internos
}

// Función para ocultar el spinner
export function hideSpinner() {
  spinnerContainer.style.display = "none"; // Oculta el contenedor
  spinnerElement.classList.add("spinner-hidden"); // Añade la clase de oculto para asegurar
}

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
  document.querySelectorAll(".dashboard-section").forEach((section) => {
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
  renderGroupInModal("modalInfoGroup", groupData).then(() => {
    showModal("modalInfoGroup");
  });

  // Accede a los botones
  const modal = document.getElementById("modalInfoGroup");

  return modal;
}

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

// Render
function renderUserInGroup(userListElement, groupId, userId, username, role) {
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

// Renderiza una lista de usuarios
export function renderUsers(username, groupId, userId) {
  // Accede al template de users
  const userTemplate = document.getElementById("userList");
  const clonTemplate = userTemplate.content.cloneNode(true);

  // Obtiene cada parte del template
  const userNameTemplate = clonTemplate.querySelector(".userName");
  const addBtn = clonTemplate.getElementById("addUserToGroup");

  // Modifica cada parte
  userNameTemplate.textContent = username;

  // Setea los datos
  addBtn.dataset.userId = userId;
  addBtn.dataset.groupId = groupId;

  return clonTemplate;
}
