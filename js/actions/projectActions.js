import { getProjects } from "../api.js";
import { renderProject } from "../render/projectRender.js";
import { hideSpinner, showSpinner } from "../utils/utils.js";

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
    return { success: false, detail: response.detail };
  }
}
