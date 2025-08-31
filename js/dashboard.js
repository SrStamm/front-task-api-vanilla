// Archivo como 'punto de entrada' despues del login
// Carga inicial de secciones y datos del panel
// Gestiona eventos del sidebar y los paneles

import {
  showSections,
  showModal,
  occultModal,
  showGroupDetailsModal,
  renderGroup,
  renderUsers,
  unauthorized,
  showMessage,
  showSpinner,
  hideSpinner,
  renderGroupInModal,
} from "./dom.js";
import {
  addUserToGroup,
  createGroup,
  deleteGroup,
  getGroups,
  getUsersInGroup,
  getUsers,
  deleteUserFromGroup,
} from "./api.js";
import { logout } from "./auth.js";

// sidebar Secciones
const sidebar = document.getElementById("sidebar");
const startSection = document.getElementById("sidebarInicioSection");
const groupSection = document.getElementById("sidebarGroupSection");
const projectSection = document.getElementById("sidebarProjectSection");
const taskSection = document.getElementById("sidebarTaskSection");
const chatSection = document.getElementById("sidebarChatSection");

// Botones
const logoutBtn = document.getElementById("logoutBtn");
const createGroupBtn = document.getElementById("createGroupBtn");

startSection.addEventListener("click", function () {
  showSections("inicioSection");
});

groupSection.addEventListener("click", async function () {
  showSections("groupSection");
  await loadGroup();
});

projectSection.addEventListener("click", function () {
  showSections("projectSection");
});

taskSection.addEventListener("click", function () {
  showSections("taskSection");
});

chatSection.addEventListener("click", function () {
  showSections("chatSection");
});

// Prevenir que el clic en la card propague y cierre la card
document.addEventListener("DOMContentLoaded", function (event) {
  // Cerrar cards expandidas al hacer clic fuera de ellas
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

  document.addEventListener("click", function (event) {
    if (event.target.closest(".card")) {
      event.stopPropagation();
    }
  });

  // Logout
  logoutBtn.addEventListener("click", async () => {
    try {
      const response = await logout();
      if (response.detail === "Closed All Sessions") {
        unauthorized();
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  });

  // Event delegation para #groupList (cards, botones de grupo, usuarios)
  const groupContainer = document.getElementById("groupList");
  groupContainer.addEventListener("click", async (event) => {
    const target = event.target;
    const card = target.closest(".card");

    if (
      target.classList.contains("btn-manage") &&
      target.id === "moreDetailsGroup"
    ) {
      const groupId = target.dataset.groupId;
      const groupName = target.dataset.name;
      const groupDescription = target.dataset.description;
      const listUser = await getUsersInGroup(groupId);
      showGroupDetailsModal({
        group_id: groupId,
        name: groupName,
        description: groupDescription,
        users: listUser,
      });
    } else if (card && !target.classList.contains("btn-manage")) {
      // Lógica de expandir/contraer cards
      if (card.classList.contains("expanded")) {
        card.classList.remove("expanded");
        const placeholder = card.nextElementSibling;
        if (placeholder && placeholder.classList.contains("card-placeholder")) {
          placeholder.remove();
        }
      } else {
        document.querySelectorAll(".card.expanded").forEach((expandedCard) => {
          expandedCard.classList.remove("expanded");
          const placeholder = expandedCard.nextElementSibling;
          if (
            placeholder &&
            placeholder.classList.contains("card-placeholder")
          ) {
            placeholder.remove();
          }
        });
        card.classList.add("expanded");
        const placeholder = document.createElement("div");
        placeholder.classList.add("card-placeholder");
        placeholder.style.height = `${card.offsetHeight}px`;
        card.parentNode.insertBefore(placeholder, card.nextSibling);
      }
    }
  });

  // Eventos para form de crear grupo
  const groupModalContainer = document.getElementById("modalGroup");
  groupModalContainer.addEventListener("click", async (event) => {
    const target = event.target;

    if (target.id === "cancelGroup") {
      occultModal("modalGroup");
    } else if (target.id === "saveGroup") {
      let response = await createGroupEvent();

      if (response == "Se ha creado un nuevo grupo de forma exitosa") {
        console.log("Grupo creado exitosamente");
      } else {
        console.log("Error al crear el grupo: ", response.detail);
      }
      occultModal("modalGroup");
      await loadGroup();
    }
  });

  // Eventos para modal de mas información del grupo
  const groupModalInfoContainer = document.getElementById("modalInfoGroup");
  groupModalInfoContainer.addEventListener("click", async (event) => {
    const target = event.target;

    if (target.id === "addUserGroup") {
      showModal("allUsersList");
      const modal = document.getElementById("allUsersList");
      const userList = modal.querySelector(".listUser");
      const groupId = target.dataset.groupId;
      userList.innerHTML = "";
      const allUsers = await getUsers();
      allUsers.forEach((user) => {
        const renderizedUser = renderUsers(
          user.username,
          groupId,
          user.user_id,
        );
        userList.appendChild(renderizedUser);
      });
    } else if (target.id === "deleteGroup") {
      const groupId = target.dataset.groupId;
      await deleteGroupAction(groupId);
      occultModal("modalInfoGroup");
      await loadGroup();
    } else if (target.id === "deleteUserGroup") {
      const groupId = target.dataset.groupId;
      const userId = target.dataset.userId;
      await deleteUserFromGroupAction(groupId, userId);
    }
  });

  // Eventos para agregar el usuario al grupo
  const allUsersListModal = document.getElementById("allUsersList");
  allUsersListModal.addEventListener("click", async (event) => {
    const target = event.target;

    if (target.id === "addUserToGroup") {
      const groupId = target.dataset.groupId;
      const userId = target.dataset.userId;

      await addUserToGroupAction(groupId, userId);
    }
  });

  // Event delegation para modales (cierre por backdrop)
  document.addEventListener("click", (event) => {
    const modalBackdrop = event.target.closest(".modal-backdrop");
    const modalContent = event.target.closest(".modal");
    if (
      modalBackdrop &&
      !modalContent &&
      modalBackdrop.classList.contains("show")
    ) {
      occultModal(modalBackdrop.id);
    }
  });
});

export async function loadGroup() {
  try {
    // Llama a la funcion que obtendra los grupos
    const groups = await getGroups();

    showSpinner();

    const groupContainer = document.getElementById("groupList");
    groupContainer.innerHTML = "";

    hideSpinner();
    if (groups.length <= 0) {
      groupContainer.textContent = "No eres parte de ningun grupo.";
    } else {
      groups.forEach((group) => {
        let clone = renderGroup("groupTemplate", group);
        groupContainer.appendChild(clone);
      });
    }
  } catch (error) {
    hideSpinner();
    console.error("No se pudo cargar la lista de grupos: ", error.message);
  }
}

// Botones en dashboard

createGroupBtn.addEventListener("click", () => {
  showModal("modalGroup");
});

// Funciones completas
async function createGroupEvent() {
  try {
    // Obtiene los datos
    const newGroupName = document.getElementById("newGroupName").value;
    const newGroupDescription = document.getElementById(
      "newGroupDescription",
    ).value;

    let data = {
      name: newGroupName,
      description: newGroupDescription || null,
    };

    let response = await createGroup(data);

    return response.detail;
  } catch (error) {
    console.log("Error en crear un grupo: ", error);
  }
}

async function deleteGroupAction(groupId) {
  try {
    let result = await deleteGroup(groupId);

    if (result.detail !== "Se ha eliminado el grupo") {
      throw new Error(result.detail);
    }
  } catch (error) {
    console.log(`Error al eliminar el grupo ${groupId}: `, error);
  }
}

async function addUserToGroupAction(groupId, userId) {
  try {
    let response = await addUserToGroup(groupId, userId);

    console.log("Response para agregar usaurio al grupo: ", response);

    if (response.detail !== "El usuario ha sido agregado al grupo") {
      throw new Error(response.detail);
    }

    showMessage("Usuario agregado exitosamente", "success");
    occultModal("allUsersList");

    // Actualizar la lista de usuarios en el modal de grupo
    const groupData = {
      group_id: groupId,
      name: document.querySelector("#modalInfoGroup .groupName").textContent,
      description: document.querySelector("#modalInfoGroup .groupDescription")
        .textContent,
    };
    const listUser = await getUsersInGroup(groupId);
    groupData.users = listUser;

    // Volver a renderizar la información del grupo
    await renderGroupInModal("modalInfoGroup", groupData);
  } catch (error) {
    console.log("Error al agregar usaurio al grupo: ", error);
    showMessage("Error al añadir el usuario: ", error.message);
    occultModal("allUsersList");
  }
}

async function deleteUserFromGroupAction(groupId, userId) {
  try {
    let response = await deleteUserFromGroup(groupId, userId);

    console.log("Response para eliminar un usuario al grupo: ", response);

    if (response.detail !== "El usuario ha sido eliminado del grupo") {
      throw new Error(response.detail);
    }

    showMessage("Usuario eliminado exitosamente", "success");

    // Actualizar la lista de usuarios en el modal de grupo
    const groupData = {
      group_id: groupId,
      name: document.querySelector("#modalInfoGroup .groupName").textContent,
      description: document.querySelector("#modalInfoGroup .groupDescription")
        .textContent,
    };
    const listUser = await getUsersInGroup(groupId);
    groupData.users = listUser;

    // Volver a renderizar la información del grupo
    await renderGroupInModal("modalInfoGroup", groupData);
  } catch (error) {
    console.log("Error al eliminar usaurio al grupo: ", error);
    showMessage("Error al eliminar el usuario: ", error.message);
  }
}
