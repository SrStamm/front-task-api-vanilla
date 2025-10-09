// Central orchestrator for dashboard ( panels and sidebar )

import {
  getUsersInGroup,
  getUsers,
  getProjectsFromGroup,
  getUsersFromProject,
  getTasksFromProject,
  getUsersAssignedToTask,
  getComments,
  getCurrentUser,
} from "./api.js";

// Funciones para DOM
import { utils } from "./utils/utils.js";
import { modal } from "./utils/modal.js";
import { domFunctions } from "./dom.js";

// Render
import { groupRender } from "./render/groupRender.js";
import { renderProject } from "./render/projectRender.js";
import { taskRender } from "./render/taskRender.js";
import { renderUser } from "./render/userRender.js";

// Actions
import { auth } from "./auth.js";
import { projectAction } from "./action/projectActions.js";
import { groupAction } from "./action/groupActions.js";
import { taskAction } from "./action/taskActions.js";
import { commentAction } from "./action/commentActions.js";
import { chatAction } from "./action/chatActions.js";

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
      domFunctions.showRegisterForm();
    } else if (target.id === "loginLink") {
      event.preventDefault();
      domFunctions.showLoginForm();
    }
  });

  loginBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    utils.setButtonState(loginBtn, true, "Iniciando...");

    // Obtiene los datos ingresados
    const username = document.getElementById("usernameLogin").value;
    const password = document.getElementById("passwordLogin").value;

    let response = await auth.login(username, password);

    if (response.success) {
      // Obtiene los token de iniciar sesión
      localStorage.setItem("authToken", response.accessToken);
      localStorage.setItem("refrToken", response.refreshToken);
      utils.showMessage("Sesión iniciada con suceso", "success");

      utils.setButtonState(loginBtn, false, "Iniciar sesión");
      domFunctions.loginSucces();

      const user = await getCurrentUser();

      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      utils.showMessage(response.message, "error");

      utils.setButtonState(loginBtn, false, "Iniciar sesión");
    }
  });

  logoutBtn.addEventListener("click", async () => {
    try {
      utils.setButtonState(logoutBtn, true, "Cerrando...");

      let response = await auth.logout();

      if (response.success || response.message === "Sesión cerrada") {
        utils.showMessage("Sesión cerrada", "info");
        domFunctions.unauthorized();
      } else {
        throw new Error(response.detail);
      }
    } catch (error) {
      utils.showMessage(
        "Ocurrió un error inesperado al cerrar sesión.",
        "error",
      );
      utils.setButtonState(logoutBtn, false, "Cerrar sesión");
    }
  });

  registerBtn.addEventListener("click", async () => {
    try {
      utils.setButtonState(registerBtn, true, "Registrando...");

      let response = await auth.register();

      if (response.success) {
        utils.showMessage(response.detail, "success");
        domFunctions.showLoginForm();

        utils.setButtonState(registerBtn, false, "Registrarse");
      } else {
        throw new Error(response.detail);
      }
    } catch (error) {
      utils.setButtonState(registerBtn, false, "Registrarse");
      utils.showMessage(response.message, "error");
    }
  });

  sidebar.addEventListener("click", async (event) => {
    const targetLi = event.target.closest("li");

    // Si el clic no fue en un 'li' o no tiene un data-target, salimos
    if (!targetLi || !targetLi.dataset.target) {
      return;
    }

    const sectionId = targetLi.dataset.target;
    modal.showSections(sectionId);

    if (sectionId === "groupSection") {
      await groupAction.loadGroup();
    }
    if (sectionId === "projectSection") {
      projectAction.resetProjects();
      await projectAction.loadProjects(true);
    }
    if (sectionId === "taskSection") {
      await projectAction.loadMinimalProjects(sectionId, true);
    }
    if (sectionId === "chatSection") {
      await projectAction.loadMinimalProjects(sectionId, true);
    }
  });

  //
  //
  // Eventos de TaskSection
  //
  //

  const taskContainer = document.getElementById("taskSection");
  taskContainer.addEventListener("click", async (event) => {
    const target = event.target;
    const projectItem = target.closest(".project-item");
    const taskCard = target.closest(".task-card");

    // Al seleccionar un proyecto, muestra sus tareas
    if (projectItem) {
      await taskAction.showTasksFromProjectAction(
        projectItem.dataset.projectId,
        ".list-task",
      );

      const allProjectItem = taskContainer.querySelectorAll(".project-item");
      allProjectItem.forEach((item) => {
        if (item !== projectItem) {
          item.classList.remove("active");
        }
      });

      if (projectItem) {
        projectItem.classList.add("active");
      }
    }

    if (taskCard) {
      const taskData = JSON.parse(taskCard.dataset.taskData || "{}");
      const assignedUsers = await getUsersAssignedToTask(taskData.task_id);
      const comments = await getComments(taskData.task_id);

      taskData.asigned = assignedUsers;

      taskData.comments = comments;

      // Muestra el modal con los detalles de la tarea)
      taskRender.showTaskDetailsModal(taskData);
    }
  });

  //
  //
  // Chat Section
  //
  //

  const chatContainer = document.getElementById("chatSection");
  chatContainer.addEventListener("click", async (event) => {
    const target = event.target;
    const projectItem = target.closest(".project-item");

    // Al seleccionar un proyecto, muestra su chat
    if (projectItem) {
      chatAction.resetChat();
      // Action para obtener y renderizar los mensajes
      await chatAction.showChatAction(
        projectItem.dataset.projectId,
        ".list-message",
        true,
      );

      const allProjectItem = chatContainer.querySelectorAll(".project-item");

      allProjectItem.forEach((item) => {
        if (item !== projectItem) {
          item.classList.remove("active");
        }
      });

      if (projectItem) {
        projectItem.classList.add("active");
      }
    }

    if (target.id === "sendNewMessage") {
      utils.setButtonState(target, true, "Enviando...");

      const principalContainer = document.querySelector(".message-container");
      const projectId = principalContainer.dataset.projectId;
      const contentInput = chatContainer.querySelector("#newMessage");

      await chatAction.sendMessageToChatAction(
        contentInput.value,
        projectId,
        contentInput,
        target,
      );
    }
  });

  //
  //
  // Group Section
  //
  //

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
      groupRender.showGroupDetailsModal({
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
      modal.occultModal("modalGroup");
    }
    if (target.id === "saveGroup") {
      utils.setButtonState(target, true, "Creando...");

      let response = await groupAction.createGroupEvent();

      if (response.success) {
        utils.showMessage(response.detail, "success");

        utils.setButtonState(target, false, "Crear");
        modal.occultModal("modalGroup");

        await groupAction.loadGroup();
      } else {
        utils.showMessage(
          "Error al crear el grupo: " + response.detail,
          "error",
        );
        utils.setButtonState(target, false, "Crear");
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
      modal.showModal("allUsersList");

      const modalContainer = document.getElementById("allUsersList");
      const userList = modalContainer.querySelector(".allUsersList");
      const groupId = target.dataset.groupId;

      userList.innerHTML = "";

      const allUsers = await getUsers();
      allUsers.forEach((user) => {
        const renderizedUser = renderUser.renderUsers(
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
      const content = groupRender.renderGroupToEdit(groupData);
      modal.updateModalContent(
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

      utils.setButtonState(target, true, "Editando...");

      await groupAction.editGroupAction(
        groupId,
        groupName.value,
        groupDescription.value,
      );
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
      const content = groupRender.newRenderGroupInModal(groupData);
      modal.updateModalContent(
        content.header,
        content.body,
        content.footer,
        content.addClass,
        content.removeClass,
      );

      utils.initializeTabListeners();

      utils.showTab("projects-tab");

      // Actualizar el dataset con los nuevos datos
      modalContainer.dataset.groupData = JSON.stringify(groupData);
    }

    if (target.id === "deleteGroup") {
      utils.setButtonState(target, true, "Eliminando...");

      const groupId = target.dataset.groupId;
      const response = await groupAction.deleteGroupAction(groupId);

      if (response.success) {
        modal.occultModal("genericModal");
        await groupAction.loadGroup();
      } else {
        utils.showMessage(
          "Error al eliminar el grupo: " + response.detail,
          "error",
        );
        utils.setButtonState(target, false, "Eliminar");
      }
    }

    if (target.id === "deleteUserGroup") {
      utils.setButtonState(target, true, "Eliminando...");

      const groupId = target.dataset.groupId;
      const userId = target.dataset.userId;
      let response = await groupAction.deleteUserFromGroupAction(
        groupId,
        userId,
      );

      if (response.success) {
        utils.setButtonState(target, true, "Eliminado");
      } else {
        utils.setButtonState(target, false, "Eliminar");
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
        let response = await groupAction.editRoleAction(
          groupId,
          userId,
          selectRole,
        );

        if (response && response.success) {
          utils.showMessage("Rol cambiado exitosamente", "success");
        } else {
          utils.showMessage(
            "Error al cambiar el rol: " + response.detail,
            "error",
          );
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
      const content = renderProject.renderCreateProject(groupData);
      modal.updateModalContent(
        content.header,
        content.body,
        content.footer,
        content.addClass,
        content.removeClass,
      );
    }

    if (target.id === "confirCreateProject") {
      utils.setButtonState(target, true, "Creando...");

      const modalContainer = document.getElementById("genericModal");
      const projectTitle =
        modalContainer.querySelector("#createProjectName").value;
      const projectDescription =
        modalContainer.querySelector("#createProjectName").value;

      const projectData = {
        title: projectTitle,
        description: projectDescription || null,
      };

      const groupId = target.dataset.groupId;

      let response = await projectAction.createProjectAction(
        projectData,
        groupId,
      );

      if (response && response.success) {
        utils.showMessage("Proyecto creado exitosamente", "success");

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
        const content = groupRender.newRenderGroupInModal(groupData);
        modal.updateModalContent(
          content.header,
          content.body,
          content.footer,
          content.addClass,
          content.removeClass,
        );

        utils.initializeTabListeners();

        utils.showTab("projects-tab");

        // Actualizar el dataset con los nuevos datos
        modalContainer.dataset.groupData = JSON.stringify(groupData);
      } else {
        utils.showMessage(
          "Error al crear el proyecto: " + response.detail,
          "error",
        );
        utils.setButtonState(target, false, "Crear");
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
      const content = groupRender.newRenderGroupInModal(groupData);
      modal.updateModalContent(
        content.header,
        content.body,
        content.footer,
        content.addClass,
        content.removeClass,
      );

      utils.initializeTabListeners();

      utils.showTab("projects-tab");

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
      modal.showModal("allUsersList");

      const modalContainer = document.getElementById("allUsersList");
      const userList = modalContainer.querySelector(".allUsersList");
      const groupId = target.dataset.groupId;
      const projectId = target.dataset.projectId;

      userList.innerHTML = "";
      const allUsers = await getUsersInGroup(groupId);

      allUsers.forEach((user) => {
        const renderizedUser = renderUser.renderUsersFromGroup(
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

      utils.setButtonState(target, true, "Eliminando...");

      // Llama a la función para eliminar el usuario del proyecto
      const response = await projectAction.removeUserFromProjectAction(
        groupId,
        projectId,
        userId,
      );

      if (response && response.success) {
        await projectAction.refreshCurrentProject(
          groupId,
          projectId,
          title,
          description,
        );
        utils.showMessage("Usuario eliminado del proyecto", "success");
        return;
      } else {
        utils.showMessage(
          "Error al eliminar el usuario: " + response.detail,
          "error",
        );
        utils.setButtonState(target, false, "Eliminar");
        return;
      }
    }

    if (target.id === "deleteProject") {
      utils.setButtonState(target, true, "Eliminando...");

      const response = await projectAction.deleteProjectAction(
        target.dataset.groupId,
        target.dataset.projectId,
      );

      if (response.success) {
        utils.showMessage("Proyecto eliminado exitosamente", "success");
        modal.occultModal("genericModal");
        await projectAction.loadProjects(true);
      } else {
        utils.showMessage(
          "Error al eliminar el proyecto: " + response.detail,
          "error",
        );
        utils.setButtonState(target, true, "Eliminar");
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
        let response = await projectAction.editPermissionAction(
          groupId,
          projectId,
          userId,
          selectPermission,
        );

        if (response && response.success) {
          utils.showMessage("Rol cambiado exitosamente", "success");

          const modalContainer = document.getElementById("genericModal");
          const projectData = JSON.parse(
            modalContainer.dataset.projectData || "{}",
          );
          await projectAction.refreshCurrentProject(
            groupId,
            projectId,
            projectData.title,
            projectData.description,
          );
        } else {
          utils.showMessage(
            "Error al cambiar el rol: " + response.detail,
            "error",
          );
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

    if (target.id === "editProject") {
      const modalContainer = document.getElementById("genericModal");
      const projectData = JSON.parse(
        modalContainer.dataset.projectData || "{}",
      );

      const content = renderProject.renderProjectToEdit(projectData);

      modal.updateModalContent(
        content.header,
        content.body,
        content.footer,
        content.addClass,
      );
    }

    if (target.id === "confirmEditProject") {
      // Accede al contenedor
      const modalContainer = document.getElementById("genericModal");

      // Accede a los campos del formulario dentro del contenedor
      const projectTitle = modalContainer.querySelector("#editProjectTitle");
      const projectDescription = modalContainer.querySelector(
        "#editProjectDescription",
      );

      // Accede a los datos del proyecto desde el dataset del modal
      const projectData = JSON.parse(modalContainer.dataset.projectData || {});
      const groupId = projectData.group_id;
      const projectId = projectData.project_id;

      utils.setButtonState(target, true, "Editando...");

      await projectAction.editProjectAction(
        groupId,
        projectId,
        projectTitle.value,
        projectDescription.value,
      );
    }

    if (target.id === "cancelEditProject") {
      const modalContainer = document.getElementById("genericModal");
      const projectData = JSON.parse(
        modalContainer.dataset.projectData || "{}",
      );

      // Refresca el modal
      await projectAction.refreshCurrentProject(
        projectData.group_id,
        projectData.project_id,
        projectData.title,
        projectData.description,
      );

      // Actualizar el dataset con los nuevos datos
      modalContainer.dataset.projectData = JSON.stringify(projectData);
    }

    if (target.id === "showFormTaskToProject") {
      const projectId = target.dataset.projectId;
      const groupId = target.dataset.groupId;
      const userList = await getUsersFromProject(groupId, projectId);
      const content = taskRender.renderCreateTask(projectId, userList);
      modal.updateModalContent(
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

      utils.setButtonState(target, true, "Creando...");

      if (!title.value) {
        utils.showMessage("Faltan campos obligatorios: Titulo", "error");
        utils.setButtonState(target, false, "Crear");
        return;
      } else if (!dueDate.value) {
        utils.showMessage(
          "Faltan campos obligatorios: Fecha de vencimiento",
          "error",
        );
        utils.setButtonState(target, false, "Crear");
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

      const response = await taskAction.createTaskAction(taskData, projectId);

      if (response.success) {
        utils.showMessage("Tarea creada exitosamente", "success");
        modal.occultModal("genericModal");
        await projectAction.loadProjects();
      } else {
        utils.showMessage(
          "Error al crear la tarea: " + response.detail,
          "error",
        );
        utils.setButtonState(target, false, "Crear");
      }
    }

    if (target.id === "cancelCreateTask") {
      modal.occultModal("genericModal");
      await projectAction.loadProjects();
    }

    //
    //
    //
    // TASK
    //
    //

    if (target.id === "editTask") {
      const modalContainer = document.getElementById("genericModal");
      const taskData = JSON.parse(modalContainer.dataset.taskData || "{}");
      const content = taskRender.renderTaskToEdit(taskData);
      modal.updateModalContent(
        content.header,
        content.body,
        content.footer,
        content.addClass,
      );
    }

    if (target.id === "confirmEditTask") {
      utils.setButtonState(target, true, "Editando...");

      const modalContainer = document.getElementById("genericModal");

      const taskTitle = modalContainer.querySelector("#editTaskTitle");
      const taskDescription = modalContainer.querySelector(
        "#editTaskDescription",
      );
      const taskDateExp = modalContainer.querySelector("#editTaskDateExp");

      // Obtiene los Ids
      const projectId = target.dataset.projectId;
      const taskId = target.dataset.taskId;

      const editTaskData = {};

      const taskData = JSON.parse(modalContainer.dataset.taskData || "{}");

      if (taskData.title !== taskTitle.value) {
        editTaskData.title = taskTitle.value;
      }

      if (taskData.description !== taskDescription.value) {
        editTaskData.description = taskDescription.value.trim();
      }

      if (taskData.date_exp !== taskDateExp.value && taskDateExp.value !== "") {
        editTaskData.date_exp = taskDateExp.value;
      }

      const response = await taskAction.editTaskAction(
        projectId,
        taskId,
        editTaskData,
      );

      if (response.success) {
        taskRender.showTaskDetailsModal(response.taskData);
        utils.setButtonState(target, false, "Editar");
      }
    }

    if (target.id === "editStateTask") {
      const modalContainer = document.getElementById("genericModal");
      const taskData = JSON.parse(modalContainer.dataset.taskData || "{}");
      const { project_id, task_id } = taskData;

      const stateSelected = modalContainer.querySelectorAll(".state-cbox");

      const stateValue = Array.from(stateSelected)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.id);

      if (!stateValue || stateValue.length === 0) {
        const listState = modalContainer.querySelector(".detail-value");
        listState.innerHTML = `
        <div class="check-task-state" style="display: flex; flex-direction: row; gap: 8px; ">
          <label>
            <input type="checkbox" id="sin empezar" class="state-cbox" value="todo_cbox" /> To Do
          </label>
          <label>
            <input type="checkbox" id=d="en proceso" class="state-cbox"  value="in_progress_cbox" /> En progreso
          </label>
          <label>
            <input type="checkbox" id=d="completado" class="state-cbox"  value="completed_cbox" /> Completada
          </label>
        </div>
        `;
        return;
      }

      if (stateValue.length === 1) {
        try {
          let response = await taskAction.editTaskStateAction(
            project_id,
            task_id,
            stateValue[0],
          );

          if (response.success) {
            utils.showMessage("Tarea actualizada", "success");
            modal.occultModal("genericModal");
            await taskAction.showTasksFromProjectAction(
              project_id,
              ".list-task",
            );
          } else {
            utils.showMessage("Error al actualizar la tarea", "error");
          }
        } catch (error) {
          utils.showMessage("Error al actualizar la tarea: " + error, "error");
        }
      } else if (stateValue.length > 1) {
        utils.showMessage("Debe seleccionar una sola opción", "error");
        return;
      }
    }

    if (target.id === "cancelEditTask") {
      const modalContainer = document.getElementById("genericModal");
      const taskData = JSON.parse(modalContainer.dataset.taskData || "{}");

      taskRender.showTaskDetailsModal(taskData);

      // Actualizar el dataset con los nuevos datos
      modalContainer.dataset.taskData = JSON.stringify(taskData);
    }

    //
    //
    // Comments
    //
    //

    if (target.id === "addComment") {
      const modalContainer = document.getElementById("genericModal");
      const taskData = JSON.parse(modalContainer.dataset.taskData || "{}");

      const content = modalContainer.querySelector("#newComment");

      if (!content.value.trim()) {
        utils.showMessage("Falta escribir el contenido", "error");
        return;
      }

      const response = await commentAction.createCommentAction(
        taskData.task_id,
        content.value,
      );

      if (response.success) {
        utils.showMessage("Comentario agregado", "success");
      } else {
        utils.showMessage(
          "Error al agregar el comentario: " + response.detail,
          "error",
        );
      }
    }
  });

  // Eventos para agregar el usuario al grupo
  const allUsersListModal = document.getElementById("allUsersList");
  allUsersListModal.addEventListener("click", async (event) => {
    const target = event.target;

    if (target.id === "addUser" && target.dataset.target == "group") {
      utils.setButtonState(target, true, "Agregando...");

      const groupId = target.dataset.groupId;
      const userId = target.dataset.userId;

      let response = await groupAction.addUserToGroupAction(groupId, userId);

      if (response.success) {
        utils.setButtonState(target, true, "Agregado");
      } else {
        utils.setButtonState(target, false, "Agregar");
      }
    } else if (target.id === "addUser" && target.dataset.target == "project") {
      utils.setButtonState(target, true, "Agregando...");

      const groupId = target.dataset.groupId;
      const projectId = target.dataset.projectId;
      const userId = target.dataset.userId;
      let response = await projectAction.addUserToProjectAction(
        groupId,
        projectId,
        userId,
      );

      if (response && response.success) {
        utils.showMessage("Usuario agregado al proyecto", "success");
        utils.setButtonState(target, true, "Agregado");

        const modalContainer = document.getElementById("genericModal");
        const projectData = JSON.parse(
          modalContainer.dataset.projectData || "{}",
        );
        await projectAction.refreshCurrentProject(
          groupId,
          projectId,
          projectData.title,
          projectData.description,
        );
      } else {
        utils.showMessage(
          "Error al agregar el usuario: " + response.detail || response,
          "error",
        );
        utils.setButtonState(target, false, "Agregar");
      }
    } else if (target.id === "closeUserList") {
      modal.occultModal("allUsersList");
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
      renderProject.showProjectDetailsModal(projecData);
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
    modal.occultModal(modalBackdrop.id);
  }
});

// Evento para mostrar modal de crear grupo
createGroupBtn.addEventListener("click", () => {
  modal.showModal("modalGroup");
});
