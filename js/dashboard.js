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
import {
  initializeTabListeners,
  setButtonState,
  showMessage,
  showTab,
} from "./utils/utils.js";
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
import {
  showLoginForm,
  showRegisterForm,
  loginSucces,
  unauthorized,
} from "./dom.js";
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
  loadMinimalProjects,
  loadProjects,
  refreshCurrentProject,
  removeUserFromProjectAction,
} from "./actions/projectActions.js";
import { deleteGroupAction, loadGroup } from "./actions/groupActions.js";
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

    setButtonState(loginBtn, true, "Iniciando...");

    // Obtiene los datos ingresados
    const username = document.getElementById("usernameLogin").value;
    const password = document.getElementById("passwordLogin").value;

    let response = await auth.login(username, password);

    if (response.success) {
      // Obtiene los token de iniciar sesión
      localStorage.setItem("authToken", response.accessToken);
      localStorage.setItem("refrToken", response.refreshToken);
      showMessage("Sesión iniciada con suceso", "success");
      loginSucces();
    } else {
      showMessage(response.message, "error");

      setButtonState(loginBtn, false, "Iniciar sesión");
    }
  });

  logoutBtn.addEventListener("click", async () => {
    try {
      setButtonState(logoutBtn, true, "Cerrando...");

      let response = await auth.logout();

      if (response.success || response.message === "Sesión cerrada") {
        showMessage("Sesión cerrada", "info");
        unauthorized();
      } else {
        throw new Error(response.detail);
      }
    } catch (error) {
      showMessage("Ocurrió un error inesperado al cerrar sesión.", "error");
      setButtonState(logoutBtn, false, "Cerrar sesión");
    }
  });

  registerBtn.addEventListener("click", async () => {
    try {
      setButtonState(registerBtn, true, "Registrando...");

      let response = await auth.register();

      if (response.success) {
        showMessage(response.detail, "success");
        showLoginForm();

        setButtonState(registerBtn, false, "Registrarse");
      } else {
        throw new Error(response.detail);
      }
    } catch (error) {
      setButtonState(registerBtn, false, "Registrarse");
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
    if (sectionId === "taskSection") {
      await loadMinimalProjects(sectionId);
    }
    if (sectionId === "chatSection") {
      await loadMinimalProjects(sectionId);
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
      setButtonState(target, true, "Creando...");

      let response = await createGroupEvent();

      if (response.success) {
        showMessage(response.detail, "success");

        setButtonState(target, false, "Crear");
        occultModal("modalGroup");

        await loadGroup();
      } else {
        showMessage("Error al crear el grupo: " + response.detail, "error");
        setButtonState(target, false, "Crear");
      }
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

      setButtonState(target, true, "Editando...");

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
        content.removeClass,
      );

      initializeTabListeners();

      showTab("projects-tab");

      // Actualizar el dataset con los nuevos datos
      modalContainer.dataset.groupData = JSON.stringify(groupData);
    }

    if (target.id === "deleteGroup") {
      setButtonState(target, true, "Eliminando...");

      const groupId = target.dataset.groupId;
      const response = await deleteGroupAction(groupId);

      if (response.success) {
        occultModal("genericModal");
        await loadGroup();
      } else {
        showMessage("Error al eliminar el grupo: " + response.detail, "error");
        setButtonState(target, false, "Eliminar");
      }
    }

    if (target.id === "deleteUserGroup") {
      setButtonState(target, true, "Eliminando...");

      const groupId = target.dataset.groupId;
      const userId = target.dataset.userId;
      let response = await deleteUserFromGroupAction(groupId, userId);

      if (response.success) {
        setButtonState(target, true, "Eliminado");
      } else {
        setButtonState(target, false, "Eliminar");
      }
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
      setButtonState(target, true, "Creando...");

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
          content.removeClass,
        );

        initializeTabListeners();

        showTab("projects-tab");

        // Actualizar el dataset con los nuevos datos
        modalContainer.dataset.groupData = JSON.stringify(groupData);
      } else {
        showMessage("Error al crear el proyecto: " + response.detail, "error");
        setButtonState(target, false, "Crear");
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
        content.removeClass,
      );

      initializeTabListeners();

      showTab("projects-tab");

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

      setButtonState(target, true, "Eliminando...");

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
        setButtonState(target, false, "Eliminar");
        return;
      }
    }

    if (target.id === "deleteProject") {
      setButtonState(target, true, "Eliminando...");
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
        setButtonState(target, true, "Eliminar");
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

    if (target.id === "confirmCreateTask") {
      const projectId = target.dataset.projectId;
      const modalContainer = document.getElementById("genericModal");
      const title = modalContainer.querySelector("#taskTitle");
      const description = modalContainer.querySelector("#taskDescription");
      const dueDate = modalContainer.querySelector("#taskDueDate");
      const usersSelected = modalContainer.querySelectorAll(
        ".form-input-checkbox",
      );

      setButtonState(target, true, "Creando...");

      if (!title.value) {
        showMessage("Faltan campos obligatorios: Titulo", "error");
        setButtonState(target, false, "Crear");
        return;
      } else if (!dueDate.value) {
        showMessage(
          "Faltan campos obligatorios: Fecha de vencimiento",
          "error",
        );
        setButtonState(target, false, "Crear");
        return;
      }

      const taskData = {
        title: title.value,
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
        setButtonState(target, false, "Crear");
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
      setButtonState(target, true, "Agregando...");

      const groupId = target.dataset.groupId;
      const userId = target.dataset.userId;

      let response = await addUserToGroupAction(groupId, userId);

      if (response.success) {
        setButtonState(target, true, "Agregado");
      } else {
        setButtonState(target, false, "Agregar");
      }
    } else if (target.id === "addUser" && target.dataset.target == "project") {
      setButtonState(target, true, "Agregando...");

      const groupId = target.dataset.groupId;
      const projectId = target.dataset.projectId;
      const userId = target.dataset.userId;
      let response = await addUserToProjectAction(groupId, projectId, userId);

      if (response && response.success) {
        showMessage("Usuario agregado al proyecto", "success");
        setButtonState(target, true, "Agregado");
        await refreshCurrentProject(groupId, projectId);
      } else {
        showMessage("Error al agregar el usuario: " + response.detail, "error");
        setButtonState(target, false, "Agregar");
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
