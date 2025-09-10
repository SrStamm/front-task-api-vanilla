import {
  addUserToProject,
  createProject,
  deleteProject,
  editPermissionInProject,
  getProjects,
  getTasksFromProject,
  getUsersFromProject,
  removeUserToProject,
} from "../api.js";
import {
  renderMinimalProject,
  renderProject,
  renderProjectInModal,
} from "../render/projectRender.js";
import { updateModalContent } from "../utils/modal.js";
import {
  hideSpinner,
  initializeTabListeners,
  showMessage,
  showSpinner,
  showTab,
} from "../utils/utils.js";

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

    // Agregar el event listener después de renderizar los proyectos
    projectContainer.addEventListener("click", handleProjectCardClick);
  } catch (error) {
    hideSpinner();
    console.error("No se pudo cargar la lista de proyectos: ", error);
  }
}

export async function loadMinimalProjects() {
  try {
    // Llama a la funcion que obtendra los proyectos
    const projects = await getProjects();

    showSpinner();

    const projectContainer = document.getElementById("listProject");
    projectContainer.innerHTML = "";

    hideSpinner();
    if (projects.length <= 0) {
      projectContainer.textContent = "No eres parte de ningun grupo.";
    } else {
      projects.forEach((project) => {
        let clone = renderMinimalProject(project);
        projectContainer.appendChild(clone);
      });
    }
  } catch (error) {
    hideSpinner();
    console.error("No se pudo cargar la lista de proyectos: ", error);
  }
}

// Función separada para manejar los clics
function handleProjectCardClick(event) {
  const target = event.target;
  const card = target.closest(".card");

  if (card && !target.closest(".view-project-btn")) {
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
        if (placeholder && placeholder.classList.contains("card-placeholder")) {
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
}

export async function createProjectAction(projectData, groupId) {
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
    return { success: false, detail: error.detail };
  }
}

export async function addUserToProjectAction(groupId, projectId, userId) {
  try {
    const response = await addUserToProject(groupId, projectId, userId);

    if (response.detail === "El usuario ha sido agregado al proyecto") {
      return { success: true, detail: response.detail };
    } else {
      return { success: false, detail: response.detail };
    }
  } catch (error) {
    showMessage(`Error: ${error}`, "error");
    return { success: false, detail: error.detail };
  }
}

export async function refreshCurrentProject(groupId, projectId) {
  // Actualizar la lista de usuarios en el modal de grupo
  const listUsers = await getUsersFromProject(groupId, projectId);
  const listTask = await getTasksFromProject(projectId);
  console.log(listTask);

  const projectData = {
    groupId: groupId,
    projectId: projectId,
    users: listUsers,
    tasks: listTask,
  };

  // Volver a renderizar la información del grupo
  const content = renderProjectInModal(projectData);
  updateModalContent(
    content.header,
    content.body,
    content.footer,
    content.addClass,
  );

  initializeTabListeners();

  showTab("members-tab");
}

export async function editPermissionAction(
  groupId,
  projectId,
  userId,
  permission,
) {
  try {
    const response = await editPermissionInProject(
      groupId,
      projectId,
      userId,
      permission,
    );

    if (
      response.detail ===
      "Se ha cambiado los permisos del usuario en el proyecto"
    ) {
      return { success: true, detail: response.detail };
    } else {
      return { success: false, detail: response.detail };
    }
  } catch (error) {
    showMessage(`Error: ${error}`, "error");
    return { success: false, detail: error.detail };
  }
}

export async function removeUserFromProjectAction(groupId, projectId, userId) {
  try {
    const response = await removeUserToProject(groupId, projectId, userId);

    if (response.detail === "El usuario ha sido eliminado del proyecto") {
      return { success: true, detail: response.detail };
    } else {
      return { success: false, detail: response.detail };
    }
  } catch (error) {
    showMessage(`Error: ${error}`, "error");
    return { success: false, detail: error.detail };
  }
}

export async function deleteProjectAction(groupId, projectId) {
  try {
    const response = await deleteProject(projectId, groupId);

    if (response.detail === "Se ha eliminado el proyecto") {
      return { success: true, detail: response.detail };
    } else {
      return { success: false, detail: response.detail };
    }
  } catch (error) {
    showMessage(`Error: ${error}`, "error");
    return { success: false, detail: error.detail };
  }
}
