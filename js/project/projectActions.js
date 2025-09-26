import {
  addUserToProject,
  createProject,
  deleteProject,
  editPermissionInProject,
  editProject,
  getProjects,
  getTasksFromProject,
  getUsersFromProject,
  removeUserToProject,
} from "../api.js";
import {
  renderMinimalProject,
  renderProject,
  renderProjectInModal,
} from "./projectRender.js";
import { updateModalContent } from "../utils/modal.js";
import {
  hideSpinner,
  initializeTabListeners,
  showMessage,
  showSpinner,
  showTab,
} from "../utils/utils.js";

// Variables para proyectos
let projectOffset = 0;
const projectLimit = 10;
let loadingProjects = false;
let allProjectsLoaded = false;
let observer = false;

export function resetProjects() {
  projectOffset = 0;
  allProjectsLoaded = false;
}

export function resetMiniProjects() {
  miniProjectOffset = 0;
  allMiniProjectsLoaded = false;
}

export async function loadProjects(initial = false) {
  if (loadingProjects || allProjectsLoaded) return;
  loadingProjects = true;

  try {
    showSpinner();

    // Llama a la funcion que obtendra los proyectos
    const projects = await getProjects(projectLimit, projectOffset);

    const projectContainer = document.getElementById("projectList");
    if (initial) {
      projectContainer.innerHTML = "";

      const sentinel = document.createElement("li");
      sentinel.id = "projectSentinel";
      projectContainer.appendChild(sentinel);
    }

    if (projects.length === 0 && initial) {
      projectContainer.textContent = "No eres parte de ningun proyecto.";
    } else {
      projects.forEach((project) => {
        let clone = renderProject("projectTemplate", project);
        projectContainer.appendChild(clone);
      });

      const oldSentinel = document.getElementById("projectSentinel");

      if (oldSentinel) {
        oldSentinel.remove();
      }

      const sentinel = document.createElement("li");
      sentinel.id = "projectSentinel";
      projectContainer.appendChild(sentinel);
    }

    projectOffset += projects.length;

    if (projects.lenght < projectLimit) {
      allProjectsLoaded = true;
    }

    projectContainer.addEventListener("click", handleProjectCardClick);

    // 👇 Solo se crea el observer la primera vez
    if (!observer) {
      const sentinel = document.getElementById("projectSentinel");

      if (sentinel) {
        observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              loadProjects(false);
            }
          },
          {
            root: null,
            rootMargin: "0px 0px 200px 0px",
            threshold: 1.0,
          },
        );

        observer.observe(sentinel);
      }
    }
  } catch (error) {
    console.error("No se pudo cargar la lista de proyectos: ", error);
  } finally {
    hideSpinner();
    loadingProjects = false;
  }
}

// Variables para mini proyectos
let miniProjectOffset = 0;
const miniProjectLimit = 10;
let loadingMiniProjects = false;
let allMiniProjectsLoaded = false;

let miniObserver = false;

export async function loadMinimalProjects(sectionId, initial = false) {
  if (loadingMiniProjects || allMiniProjectsLoaded) return;
  loadingMiniProjects = true;

  try {
    showSpinner();

    // Llama a la funcion que obtendra los proyectos
    const projects = await getProjects(miniProjectLimit, miniProjectOffset);

    const sectionContainer = document.getElementById(sectionId);
    const projectContainer = sectionContainer.querySelector(".list-project");

    if (initial) {
      projectContainer.innerHTML = "";

      const sentinel = document.createElement("li");
      sentinel.id = "miniProjectSentinel";
      projectContainer.appendChild(sentinel);
    }

    if (projects.lenght <= 0 && initial) {
      projectContainer.textContent = "No eres parte de ningun proyecto.";
    } else {
      projects.forEach((project) => {
        let clone = renderMinimalProject(project);
        projectContainer.appendChild(clone);
      });

      const oldSentinel = document.getElementById("miniProjectSentinel");

      if (oldSentinel) {
        oldSentinel.remove();
      }

      const sentinel = document.createElement("li");
      sentinel.id = "miniProjectSentinel";
      projectContainer.appendChild(sentinel);
    }

    miniProjectOffset += projects.length;

    if (projects.lenght < miniProjectLimit) {
      allMiniProjectsLoaded = true;
    }

    // 👇 Solo se crea el observer la primera vez
    if (!miniObserver) {
      const miniSentinel = document.getElementById("miniProjectSentinel");

      if (miniSentinel) {
        miniObserver = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              loadMinimalProjects("taskSection");
            }
          },
          {
            root: null,
            rootMargin: "0px 0px 200px 0px",
            threshold: 1.0,
          },
        );

        miniObserver.observe(miniSentinel);
      }
    }
  } catch (error) {
    console.error("No se pudo cargar la lista de proyectos: ", error);
  } finally {
    hideSpinner();
    loadingMiniProjects = false;
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

export async function refreshCurrentProject(
  groupId,
  projectId,
  title,
  description,
) {
  // Actualizar la lista de usuarios en el modal de grupo
  const listUsers = await getUsersFromProject(groupId, projectId);
  const listTask = await getTasksFromProject(projectId);

  const projectData = {
    title: title,
    description: description,
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

//
export async function editProjectAction(
  groupId,
  projectId,
  projectTitle,
  projectDescription,
) {
  try {
    let projectEditData = {
      title: projectTitle,
      description: projectDescription.trim(),
    };

    let response = await editProject(groupId, projectId, projectEditData);

    if (response.detail !== "Se ha actualizado la informacion del projecto") {
      throw new Error(response.detail);
    }

    showMessage("Proyecto editado exitosamente", "success");

    // Obtener los datos del grupo desde el dataset del modal
    const modalContainer = document.getElementById("genericModal");
    const projectData = JSON.parse(modalContainer.dataset.projectData || "{}");

    await refreshCurrentProject(
      groupId,
      projectId,
      projectTitle,
      projectDescription,
    );

    // Actualizar el dataset con los nuevos datos
    modalContainer.dataset.projectData = JSON.stringify(projectData);
  } catch (error) {
    showMessage("Error al editar el proyecto: ", error.message);
  }
}
