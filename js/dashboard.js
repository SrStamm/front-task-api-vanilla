// Archivo como 'punto de entrada' despues del login
// Carga inicial de secciones y datos del panel
// Gestiona eventos del sidebar y los paneles

// UPDATE: This file should now act as the central orchestrator for the dashboard* functionality.
// It will import the rendering functions from render/ and the UI utilities from utils/ to build the page.

import {
  addUserToGroup,
  createGroup,
  deleteGroup,
  getGroups,
  getUsersInGroup,
  getUsers,
  deleteUserFromGroup,
  editGroup,
  editRole,
  getProjects,
  createProject,
  getProjectsFromGroup,
} from "./api.js";
import { showSpinner, hideSpinner, showMessage } from "./utils/utils.js";
import {
  showSections,
  showModal,
  occultModal,
  updateModalContent,
} from "./utils/modal.js";
import { renderUsers } from "./render/userRender.js";
import {
  newRenderGroupInModal,
  renderGroup,
  renderGroupToEdit,
  showGroupDetailsModal,
} from "./render/groupRender.js";
import { showLoginForm, showRegisterForm, loginSucces } from "./dom.js";
import { auth } from "./auth.js";
import { renderCreateProject, renderProject } from "./render/projectRender.js";

// Botones
const createGroupBtn = document.getElementById("createGroupBtn");
const formLogContainer = document.getElementById("formLogContainer");
const sidebar = document.querySelector("#sidebar");

const loginBtn = document.querySelector('[data-action="login"]');
const logoutBtn = document.getElementById("logoutBtn");
const registerBtn = document.querySelector('[data-action="register"]');

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

  formLogContainer.addEventListener("click", (event) => {
    const target = event.target;

    if (target.id === "registerLink") {
      event.preventDefault();
      showRegisterForm();
    } else if (target.id === "loginLink") {
      event.preventDefault();
      showLoginForm();
    }
  });

  loginBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    let response = await auth.login();

    if (response.success) {
      // Obtiene los token de iniciar sesión
      localStorage.setItem("authToken", response.accessToken);
      localStorage.setItem("refrToken", response.refreshToken);
      showMessage("Sesión iniciada con suceso", "success");
      loginSucces();
    } else {
      showMessage(response.message, "error");
    }
  });

  logoutBtn.addEventListener("click", async () => {
    try {
      let response = await auth.logout();
      console.log("Response al cerrar sesión: ", response);

      if (response.message === "Sesión cerrada") {
        showMessage("Sesión cerrada", "info");
        unauthorized();
      } else {
        showMessage(error.message, "error");
      }
    } catch (error) {
      showMessage("Ocurrió un error inesperado al cerrar sesión.", "error");
    }
  });

  registerBtn.addEventListener("click", async () => {
    let response = await auth.register();

    if (response.success) {
      showMessage(response.message, "success");
      showLoginForm();
    } else {
      console.log("Error en el registro: ", response.message);
      showMessage(response.message, "error");
    }
  });

  sidebar.addEventListener("click", async (event) => {
    const targetLi = event.target.closest("li");

    // Si el clic no fue en un 'li' o no tiene un data-target, salimos
    if (!targetLi || !targetLi.dataset.target) {
      return;
    }

    const sectionId = targetLi.dataset.target;
    showSections(sectionId);

    if (sectionId === "groupSection") {
      await loadGroup();
    }
    if (sectionId === "projectSection") {
      await loadProjects();
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
      console.log("Usuarios del grupo: ", listUser);
      const listProject = await getProjectsFromGroup(groupId);

      // Muestra el modal con los detalles del grupo
      showGroupDetailsModal({
        group_id: groupId,
        name: groupName,
        description: groupDescription,
        users: listUser,
        projects: listProject,
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
    }
    if (target.id === "saveGroup") {
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
  const groupModalInfoContainer = document.getElementById("genericModal");
  groupModalInfoContainer.addEventListener("click", async (event) => {
    const target = event.target;

    if (target.id === "addUserGroup") {
      showModal("allUsersList");
      const modal = document.getElementById("allUsersList");
      const userList = modal.querySelector(".allUsersList");
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
    }

    if (target.id === "editGroup") {
      const modalContainer = document.getElementById("genericModal");
      const groupData = JSON.parse(modalContainer.dataset.groupData || "{}");
      const content = renderGroupToEdit(groupData);
      updateModalContent(
        content.header,
        content.body,
        content.footer,
        content.addClass,
        content.removeClass,
      );
    }

    if (target.id === "confirmEditGroup") {
      const modalContainer = document.getElementById("genericModal");
      const groupName = modalContainer.querySelector("#editGroupName");
      const groupDescription = modalContainer.querySelector(
        "#editGroupDescription",
      );
      const groupId = target.dataset.groupId;

      await editGroupAction(groupId, groupName.value, groupDescription.value);
    }

    if (target.id === "cancelEditGroup") {
      // Obtener los datos del grupo desde el dataset del modal
      const modalContainer = document.getElementById("genericModal");
      const CancelBtn = modalContainer.querySelector("#cancelEditGroup");
      const groupId = CancelBtn.dataset.groupId;
      const groupName = CancelBtn.dataset.groupName;
      const groupDescription = CancelBtn.dataset.groupDescription;

      // Actualizar la lista de usuarios en el modal de grupo
      const listUser = await getUsersInGroup(groupId);
      const listProject = await getProjectsFromGroup(groupId);

      console.log("Lista de proyectos: ", listProject);
      const groupData = {
        name: groupName,
        description: groupDescription,
        group_id: groupId,
        users: listUser,
        projects: listProject,
      };

      // Volver a renderizar la información del grupo
      const content = newRenderGroupInModal(groupData);
      updateModalContent(
        content.header,
        content.body,
        content.footer,
        content.addClass,
        "modal-small",
      );

      // Actualizar el dataset con los nuevos datos
      modalContainer.dataset.groupData = JSON.stringify(groupData);
    }

    if (target.id === "deleteGroup") {
      const groupId = target.dataset.groupId;
      await deleteGroupAction(groupId);
      occultModal("genericModal");
      await loadGroup();
    }

    if (target.id === "deleteUserGroup") {
      const groupId = target.dataset.groupId;
      const userId = target.dataset.userId;
      await deleteUserFromGroupAction(groupId, userId);
    }

    if (target.id == "editRoleGroup") {
      const userId = target.dataset.userId;
      const groupId = target.dataset.groupId;
      const select = document.querySelector(
        `.role-select[data-user-id="${userId}"]`,
      );

      // Obtiene el rol actual y el del select
      const selectRole = select.value;
      const currentRole = select.dataset.role;

      // Si el rol ha cambiado, llama a la API para actualizarlo

      if (currentRole !== selectRole) {
        let response = await editRoleAction(groupId, userId, selectRole);

        if (response && response.success) {
          showMessage("Rol cambiado exitosamente", "success");
        } else {
          showMessage("Error al cambiar el rol: " + response.detail, "error");
          return; // Sale de la función si hubo un error
        }
      }

      select.disabled = !select.disabled; // activa/desactiva edición

      if (select.style.display === "none") {
        select.style.display = "inline-block"; // muestra el select
      } else {
        select.style.display = "none"; // muestra el botón
      }
    }

    if (target.id === "createProject") {
      const modalContainer = document.getElementById("genericModal");
      const groupData = JSON.parse(modalContainer.dataset.groupData || "{}");
      const content = renderCreateProject(groupData);
      updateModalContent(
        content.header,
        content.body,
        content.footer,
        content.addClass,
        content.removeClass,
      );
    }

    if (target.id === "confirCreateProject") {
      const modalContainer = document.getElementById("genericModal");
      const projectTitle = modalContainer.querySelector(
        "#createProjectNameName",
      ).value;
      const projectDescription =
        modalContainer.querySelector("#createProjectName").value;

      const projectData = {
        title: projectTitle,
        description: projectDescription || null,
      };

      const groupId = target.dataset.groupId;

      let response = await createProjectAction(projectData, groupId);

      if (response && response.success) {
        showMessage("Proyecto creado exitosamente", "success");
        occultModal("genericModal");
        await loadProjects();

        // Actualizar la lista de usuarios en el modal de grupo
        const listUser = await getUsersInGroup(target.dataset.groupId);
        const listProject = await getProjectsFromGroup(groupId);
        console.log("Lista de proyectos: ", listProject);

        const groupData = {
          name: target.dataset.groupName,
          description: target.dataset.groupDescription,
          group_id: target.dataset.groupId,
          users: listUser,
          projects: listProject,
        };

        // Volver a renderizar la información del grupo
        const content = newRenderGroupInModal(groupData);
        updateModalContent(
          content.header,
          content.body,
          content.footer,
          content.addClass,
          "modal-small",
        );

        // Actualizar el dataset con los nuevos datos
        modalContainer.dataset.groupData = JSON.stringify(groupData);
      } else {
        showMessage("Error al crear el proyecto: " + response.detail, "error");
      }
    }

    if (target.id === "cancelCreateProject") {
      // Obtener los datos del grupo desde el dataset del modal
      const modalContainer = document.getElementById("genericModal");
      const CancelBtn = modalContainer.querySelector("#cancelCreateProject");
      const groupId = CancelBtn.dataset.groupId;
      const groupName = CancelBtn.dataset.groupName;
      const groupDescription = CancelBtn.dataset.groupDescription;

      // Actualizar la lista de usuarios en el modal de grupo
      const listUser = await getUsersInGroup(groupId);
      const listProject = await getProjectsFromGroup(groupId);
      console.log("Lista de proyectos: ", listProject);

      const groupData = {
        name: groupName,
        description: groupDescription,
        group_id: groupId,
        users: listUser,
        projects: listProject,
      };

      // Volver a renderizar la información del grupo
      const content = newRenderGroupInModal(groupData);
      updateModalContent(
        content.header,
        content.body,
        content.footer,
        content.addClass,
        "modal-small",
      );

      // Actualizar el dataset con los nuevos datos
      modalContainer.dataset.groupData = JSON.stringify(groupData);
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
    console.error("No se pudo cargar la lista de grupos: ", error);
  }
}

export async function loadProjects() {
  try {
    // Llama a la funcion que obtendra los proyectos
    const projects = await getProjects();

    showSpinner();

    const projectContainer = document.getElementById("projectList");
    projectContainer.innerHTML = "";

    hideSpinner();
    if (projects.length <= 0) {
      projectContainer.textContent = "No eres parte de ningun grupo.";
    } else {
      projects.forEach((project) => {
        let clone = renderProject("projectTemplate", project);
        projectContainer.appendChild(clone);
      });
    }
  } catch (error) {
    hideSpinner();
    console.error("No se pudo cargar la lista de proyectos: ", error);
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

    if (!newGroupName) {
      showMessage("El nombre del grupo es obligatorio", "error");
      return;
    }

    // Crea el grupo)

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

    // Obtener los datos del grupo desde el dataset del modal
    const modalContainer = document.getElementById("genericModal");
    const groupData = JSON.parse(modalContainer.dataset.groupData || "{}");

    // Actualizar la lista de usuarios en el modal de grupo
    const listUser = await getUsersInGroup(groupId);
    groupData.users = listUser;

    const listProject = await getProjectsFromGroup(groupId);
    groupData.projects = listProject;
    console.log("Lista de proyectos: ", listProject);

    // Volver a renderizar la información del grupo
    const content = newRenderGroupInModal(groupData);
    updateModalContent(
      content.header,
      content.body,
      content.footer,
      content.addClass,
    );

    // Actualizar el dataset con los nuevos datos
    modalContainer.dataset.groupData = JSON.stringify(groupData);
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

    // Obtener los datos del grupo desde el dataset del modal
    const modalContainer = document.getElementById("genericModal");
    const groupData = JSON.parse(modalContainer.dataset.groupData || "{}");

    // Actualizar la lista de usuarios en el modal de grupo
    const listUser = await getUsersInGroup(groupId);
    groupData.users = listUser;

    const listProject = await getProjectsFromGroup(groupId);
    groupData.projects = listProject;
    console.log("Lista de proyectos: ", listProject);

    // Volver a renderizar la información del grupo
    const content = newRenderGroupInModal(groupData);
    updateModalContent(
      content.header,
      content.body,
      content.footer,
      content.addClass,
    );

    // Actualizar el dataset con los nuevos datos
    modalContainer.dataset.groupData = JSON.stringify(groupData);
  } catch (error) {
    console.log("Error al eliminar usaurio al grupo: ", error);
    showMessage("Error al eliminar el usuario: ", error.message);
  }
}

async function editGroupAction(groupId, groupName, groupDescription) {
  try {
    let groupEditData = {
      name: groupName,
    };

    if (groupDescription || groupDescription !== null) {
      groupEditData.description = groupDescription;
    }
    let response = await editGroup(groupId, groupEditData);

    console.log("Response para editar el grupo: ", response);

    if (response.detail !== "Se ha actualizado la informacion del grupo") {
      throw new Error(response.detail);
    }

    showMessage("Grupo editado exitosamente", "success");

    // Obtener los datos del grupo desde el dataset del modal
    const modalContainer = document.getElementById("genericModal");
    const groupData = JSON.parse(modalContainer.dataset.groupData || "{}");

    // Actualizar la lista de usuarios en el modal de grupo
    const listUser = await getUsersInGroup(groupId);
    groupData.users = listUser;

    const listProject = await getProjectsFromGroup(groupId);
    groupData.projects = listProject;

    console.log("Lista de proyectos: ", listProject);

    // Volver a renderizar la información del grupo
    const content = newRenderGroupInModal(groupData);
    updateModalContent(
      content.header,
      content.body,
      content.footer,
      content.addClass,
    );

    // Actualizar el dataset con los nuevos datos
    modalContainer.dataset.groupData = JSON.stringify(groupData);
  } catch (error) {
    console.log("Error al eliminar usaurio al grupo: ", error);
    showMessage("Error al eliminar el usuario: ", error.message);
  }
}

async function editRoleAction(groupId, userId, role) {
  try {
    if (!groupId || !userId || !role) {
      showMessage("Faltan datos para editar el rol", "error");
      return;
    }

    const response = await editRole(groupId, userId, role);

    if (
      response.detail !== "Se ha cambiado los permisos del usuario en el grupo"
    ) {
      throw new Error(response.detail);
    } else {
      // Obtener los datos del grupo desde el dataset del modal
      const modalContainer = document.getElementById("genericModal");
      const groupData = JSON.parse(modalContainer.dataset.groupData || "{}");

      // Actualizar la lista de usuarios en el modal de grupo
      const listUser = await getUsersInGroup(groupId);
      groupData.users = listUser;

      const listProject = await getProjectsFromGroup(groupId);
      groupData.projects = listProject;
      console.lign("Lista de proyectos: ", listProject);

      // Volver a renderizar la información del grupo
      const content = newRenderGroupInModal(groupData);
      updateModalContent(
        content.header,
        content.body,
        content.footer,
        content.addClass,
      );

      // Actualizar el dataset con los nuevos datos
      modalContainer.dataset.groupData = JSON.stringify(groupData);
      return { success: true, detail: response.detail };
    }
  } catch (error) {
    return { sucess: false, detail: error.message };
  }
}

async function createProjectAction(projectData, groupId) {
  try {
    if (!projectData.title || projectData.title.trim() === "") {
      alert("El nombre del proyecto no puede estar vacío.");
      return;
    }

    const response = await createProject(projectData, groupId);

    if (response.detail === "Se ha creado un nuevo proyecto de forma exitosa") {
      return { success: true, detail: response.detail };
    } else {
      return { success: false, detail: response.detail };
    }
  } catch (error) {
    return { success: false, detail: response.detail };
  }
}
