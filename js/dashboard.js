// Archivo como 'punto de entrada' despues del login
// Carga inicial de secciones y datos del panel
// Gestiona eventos del sidebar y los paneles

// UPDATE: This file should now act as the central orchestrator for the dashboard* functionality.
// It will import the rendering functions from render/ and the UI utilities from utils/ to build the page.

import {
  getUsersInGroup,
  getUsers,
  getProjectsFromGroup,
  getUsersFromProject,
  getTasksFromProject,
} from "./api.js";
import { showMessage } from "./utils/utils.js";
import {
  showSections,
  showModal,
  occultModal,
  updateModalContent,
} from "./utils/modal.js";
import { renderUsers, renderUsersFromGroup } from "./render/userRender.js";
import {
  newRenderGroupInModal,
  renderGroupToEdit,
  showGroupDetailsModal,
} from "./render/groupRender.js";
import { showLoginForm, showRegisterForm, loginSucces } from "./dom.js";
import { auth } from "./auth.js";
import {
  renderCreateProject,
  showProjectDetailsModal,
} from "./render/projectRender.js";
import {
  addUserToProjectAction,
  createProjectAction,
  deleteProjectAction,
  editPermissionAction,
  loadProjects,
  refreshCurrentProject,
  removeUserFromProjectAction,
} from "./actions/projectActions.js";
import { loadGroup } from "./actions/groupActions.js";
import {
  editGroupAction,
  createGroupEvent,
  addUserToGroupAction,
  deleteUserFromGroupAction,
  editRoleAction,
} from "./actions/groupActions.js";
import { renderCreateTask } from "./render/taskRender.js";
import { createTaskAction } from "./actions/taskActions.js";

// Botones
const createGroupBtn = document.getElementById("createGroupBtn");
const formLogContainer = document.getElementById("formLogContainer");
const sidebar = document.querySelector("#sidebar");

const loginBtn = document.querySelector('[data-action="login"]');
const logoutBtn = document.getElementById("logoutBtn");
const registerBtn = document.querySelector('[data-action="register"]');

// Prevenir que el clic en la card propague y cierre la card
document.addEventListener("DOMContentLoaded", async (event) => {
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

      if (response.message === "Closed all sessions") {
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
      } else {
        showMessage("Error al crear el grupo: " + response.detail, "error");
      }
      occultModal("modalGroup");
      await loadGroup();
    }
  });

  // Eventos para modal de mas información del grupo
  const groupModalInfoContainer = document.getElementById("genericModal");
  groupModalInfoContainer.addEventListener("click", async (event) => {
    const target = event.target;

    //
    // GRUPOS
    //

    if (target.id === "addUserGroup") {
      showModal("allUsersList");
      const modal = document.getElementById("allUsersList");
      const userList = modal.querySelector(".allUsersList");
      const groupId = target.dataset.groupId;
      userList.innerHTML = "";
      const allUsers = await getUsers();
      allUsers.forEach((user) => {
        const renderizedUser = renderUsers(
          "group",
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
      await editGroupAction(groupId);
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

    //
    //
    //
    // PROYECTOS
    //
    //
    //

    if (target.id === "showListUserToAdd") {
      showModal("allUsersList");

      const modal = document.getElementById("allUsersList");
      const userList = modal.querySelector(".allUsersList");
      const groupId = target.dataset.groupId;
      const projectId = target.dataset.projectId;

      userList.innerHTML = "";
      const allUsers = await getUsersInGroup(groupId);

      allUsers.forEach((user) => {
        const renderizedUser = renderUsersFromGroup(
          "project",
          user.username,
          groupId,
          projectId,
          user.user_id,
        );
        userList.appendChild(renderizedUser);
      });
    }

    if (target.id === "deleteUserProject") {
      const groupId = target.dataset.groupId;
      const projectId = target.dataset.projectId;
      const userId = target.dataset.userId;
      const title = target.dataset.title;
      const description = target.dataset.description;

      target.textContent = "Eliminando...";
      target.disabled = true;

      // Llama a la función para eliminar el usuario del proyecto
      const response = await removeUserFromProjectAction(
        groupId,
        projectId,
        userId,
      );

      if (response && response.success) {
        await refreshCurrentProject(groupId, projectId, title, description);
        showMessage("Usuario eliminado del proyecto", "success");
        return;
      } else {
        showMessage(
          "Error al eliminar el usuario: " + response.detail,
          "error",
        );
        return;
      }
    }

    if (target.id === "deleteProject") {
      const response = await deleteProjectAction(
        target.dataset.groupId,
        target.dataset.projectId,
      );

      if (response && response.success) {
        showMessage("Proyecto eliminado exitosamente", "success");
        occultModal("genericModal");
        await loadProjects();
      } else {
        showMessage(
          "Error al eliminar el proyecto: " + response.detail,
          "error",
        );
      }
    }

    if (target.id == "editPermissionProject") {
      const userId = target.dataset.userId;
      const projectId = target.dataset.projectId;
      const groupId = target.dataset.groupId;
      const select = document.querySelector(
        `.permission-select[data-user-id="${userId}"]`,
      );

      const selectPermission = select.value;
      const currentPermission = select.dataset.permission;

      // Si el permiso ha cambiado, llama a la API para actualizarlo

      if (currentPermission !== selectPermission) {
        let response = await editPermissionAction(
          groupId,
          projectId,
          userId,
          selectPermission,
        );

        if (response && response.success) {
          showMessage("Rol cambiado exitosamente", "success");
          await refreshCurrentProject(groupId, projectId);
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

    if (target.id === "showFormTaskToProject") {
      const projectId = target.dataset.projectId;
      const groupId = target.dataset.groupId;
      const userList = await getUsersFromProject(groupId, projectId);
      const content = renderCreateTask(projectId, userList);
      updateModalContent(
        content.header,
        content.body,
        content.footer,
        content.addClass,
        content.removeClass,
      );
    }

    if (target.id === "confirCreateTask") {
      const projectId = target.dataset.projectId;
      const modalContainer = document.getElementById("genericModal");
      const description = modalContainer.querySelector("#taskDescription");
      const dueDate = modalContainer.querySelector("#taskDueDate");
      const usersSelected = modalContainer.querySelectorAll(
        ".form-input-checkbox",
      );

      const taskData = {
        description: description.value,
        date_exp: dueDate.value,
        user_ids: usersSelected.value
          ? Array.from(usersSelected)
              .filter((checkbox) => checkbox.checked)
              .map((checkbox) => checkbox.value)
          : [],
      };

      const response = await createTaskAction(taskData, projectId);

      if (response.success) {
        showMessage("Tarea creada exitosamente", "success");
        occultModal("genericModal");
        await loadProjects();
      } else {
        showMessage("Error al crear la tarea: " + response.detail, "error");
      }
    }

    if (target.id === "cancelCreateTask") {
      occultModal("genericModal");
      await loadProjects();
    }
  });

  // Eventos para agregar el usuario al grupo
  const allUsersListModal = document.getElementById("allUsersList");
  allUsersListModal.addEventListener("click", async (event) => {
    const target = event.target;

    if (target.id === "addUser" && target.dataset.target == "group") {
      const groupId = target.dataset.groupId;
      const userId = target.dataset.userId;

      await addUserToGroupAction(groupId, userId);
    } else if (target.id === "addUser" && target.dataset.target == "project") {
      target.textContent = "Agregando...";
      target.disabled = true;

      const groupId = target.dataset.groupId;
      const projectId = target.dataset.projectId;
      const userId = target.dataset.userId;
      let response = await addUserToProjectAction(groupId, projectId, userId);

      if (response && response.success) {
        showMessage("Usuario agregado al proyecto", "success");
        target.textContent = "Agregado";
        await refreshCurrentProject(groupId, projectId);
      } else {
        showMessage("Error al agregar el usuario: " + response.detail, "error");
        target.textContent = "Error";
        target.disabled = false;
      }
    } else if (target.id === "closeUserList") {
      occultModal("allUsersList");
    }
  });

  const projectContainer = document.getElementById("projectList");
  projectContainer.addEventListener("click", async (event) => {
    if (
      event.target.classList.contains("btn-manage") &&
      event.target.classList.contains("view-project-btn")
    ) {
      const groupId = event.target.dataset.groupId;
      const projectId = event.target.dataset.projectId;
      const title = event.target.dataset.title;
      const description = event.target.dataset.description;
      const listUser = await getUsersFromProject(groupId, projectId);
      const taskList = await getTasksFromProject(projectId);

      const projecData = {
        group_id: groupId,
        project_id: projectId,
        title: title,
        description: description,
        users: listUser,
        tasks: taskList,
      };

      // Muestra el modal con los detalles del grupo
      showProjectDetailsModal(projecData);
    }
  });
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

// Botones en dashboard

createGroupBtn.addEventListener("click", () => {
  showModal("modalGroup");
});
