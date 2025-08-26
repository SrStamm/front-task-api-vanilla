// Centralizar la lógica de manipulación del DOM y el manejo de eventos de la interfaz de usuario
// Funciones para mostrar u ocultar secciones
// Eventos de los enlaces para cambiar entre el formulario de login y registro
// Eventos para los botones de sidebar

import {
  addUserToGroup,
  deleteGroup,
  deleteUserFromGroup,
  getUsers,
} from "./api.js";
import { logout } from "./auth.js";
import { loadGroup } from "./dashboard.js";

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

// Cerrar cards expandidas al hacer clic fuera de ellas
document.addEventListener("click", function (event) {
  const expandedCards = document.querySelectorAll(".card.expanded");
  if (expandedCards.length > 0) {
    const isClickInsideCard = Array.from(expandedCards).some((card) =>
      card.contains(event.target),
    );

    if (!isClickInsideCard) {
      expandedCards.forEach((card) => {
        card.classList.remove("expanded");
        const placeholder = card.nextElementSibling;
        if (placeholder && placeholder.classList.contains("card-placeholder")) {
          placeholder.remove();
        }
      });
    }
  }
});

// Función que renderiza los grupos
export function showGroups(groups) {
  const groupTemplate = document.getElementById("groupTemplate");
  const groupContainer = document.getElementById("groupList");

  groupContainer.innerHTML = "";

  if (groups <= 0) {
    groupContainer.textContent = "No eres parte de ningun grupo.";
  } else {
    groups.forEach((group) => {
      // Copia el template
      const clonTemplate = groupTemplate.content.cloneNode(true);

      // Accede a cada parte del template
      const groupName = clonTemplate.querySelector(".groupName");
      const groupDescription = clonTemplate.querySelector(".groupDescription");
      const card = clonTemplate.querySelector(".card");

      // Actualiza con los datos obtenidos
      groupName.textContent = group.name;
      groupDescription.textContent = group.description || "Sin descripción";

      // Añadir evento de clic para mostrar/ocultar descripción
      card.addEventListener("click", function (event) {
        if (event.target.classList.contains("btn-manage")) {
          event.stopPropagation(); // Evita que se dispare la expansión
          // Función que muestra el modal
          showModal("modalInfoGroup");
          showGroupDetailsModal(group);
          return;
        }

        // Si ya está expandida, contraer
        if (this.classList.contains("expanded")) {
          this.classList.remove("expanded");
          // Eliminar el placeholder
          const placeholder = this.nextElementSibling;
          if (
            placeholder &&
            placeholder.classList.contains("card-placeholder")
          ) {
            placeholder.remove();
          }
        } else {
          // Contrae cualquier otra card expandida
          document
            .querySelectorAll(".card.expanded")
            .forEach((expandedCard) => {
              expandedCard.classList.remove("expanded");
              const placeholder = expandedCard.nextElementSibling;
              if (
                placeholder &&
                placeholder.classList.contains("card-placeholder")
              ) {
                placeholder.remove();
              }
            });

          // Expande esta card
          this.classList.add("expanded");

          // Crear un placeholder para mantener el espacio en el grid
          const placeholder = document.createElement("div");
          placeholder.classList.add("card-placeholder");
          placeholder.style.height = `${this.offsetHeight}px`;
          this.parentNode.insertBefore(placeholder, this.nextSibling);
        }
      });

      // Agrega los datos
      groupContainer.appendChild(clonTemplate);
    });
  }
}

// Prevenir que el clic en la card propague y cierre la card
document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (event) {
    if (event.target.closest(".card")) {
      event.stopPropagation();
    }
  });
});

//
async function showGroupDetailsModal(groupData) {
  console.log("El grupo que se quiere mas informacion es: ", groupData);

  // Accede al modal
  const modal = document.getElementById("modalInfoGroup");
  const groupName = modal.querySelector(".groupName");
  const groupDescription = modal.querySelector(".description");
  const userList = modal.querySelector(".listUser");
  const deleteBtn = modal.querySelector("#deleteGroup");
  const addUserBtn = modal.querySelector("#addUserGroup");

  // VERIFICAR que los elementos existen antes de usarlos
  if (
    !groupName ||
    !groupDescription ||
    !userList ||
    !deleteBtn ||
    !addUserBtn
  ) {
    console.error("Error: No se encontraron todos los elementos del modal");
    return;
  }

  // Llenar los datos
  groupName.textContent = groupData.name;
  groupDescription.textContent = groupData.description;

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

  // Agregar acciones a los botones
  deleteBtn.onclick = () => deleteGroupAction(groupData.group_id);
  addUserBtn.onclick = async () => {
    showModal("allUsersList");
    let allUsers = await getUsers();
    allUsers.forEach((user) => {
      renderUsers(user.user_id, user.username, groupData.group_id);
    });
  };
  modal.style.display = "flex";
}

async function deleteGroupAction(groupId) {
  try {
    let result = await deleteGroup(groupId);
    console.log("Grupo eliminado:", result);
    // Cerrar modal y recargar grupos
    occultModal("modalInfoGroup");
    loadGroup();
  } catch (error) {
    console.log(`Error al eliminar el grupo ${groupId}: `, error);
  }
}

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
function renderUsers(userId, username, groupId) {
  // Accede al modal
  const modal = document.getElementById("allUsersList");
  const userList = modal.querySelector(".listUser");

  // Accede al template de users
  const userGroupTemplate = document.getElementById("userList");
  const clonTemplate = userGroupTemplate.content.cloneNode(true);

  // Obtiene cada parte del template
  const userNameTemplate = clonTemplate.querySelector(".userName");
  const userIdTemplate = clonTemplate.querySelector(".userId");

  // Modifica cada parte
  userNameTemplate.textContent = username;
  userIdTemplate.textContent = userId;

  // Configurar botones
  const addBtn = clonTemplate.querySelector("#addUserToGroup");
  addBtn.onclick = () => addUserToGroup(groupId, userId);

  userList.appendChild(clonTemplate);
}

// Evento de logout
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async () => {
  try {
    let response = await logout();

    console.log("logout-response: ", response);

    if (response.detail == "Closed all sessions") {
      unauthorized();
    }
  } catch (error) {
    console.log("Error: ", error);
  }
});
