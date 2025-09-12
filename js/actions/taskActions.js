import { createTask, getTasksFromProject } from "../api.js";
import { renderTask } from "../render/taskRender.js";
import { showMessage } from "../utils/utils.js";

export async function createTaskAction(taskData, projectId) {
  try {
    const response = await createTask(taskData, projectId);

    if (
      response.detail ===
      "A new task has been created and users have been successusfully assigned"
    ) {
      return { success: true, detail: response.detail };
    } else {
      return { success: false, detail: response.detail };
    }
  } catch (error) {
    showMessage("Error al crear la tarea");
    return { success: false, detail: error };
  }
}

export async function showTasksFromProjectAction(projectId, containerClass) {
  const container = document.querySelector(containerClass);
  container.innerHTML = "";

  const response = await getTasksFromProject(projectId);

  if (response.length === 0) {
    container.innerHTML = "<p>No hay tareas en este proyecto.</p>";
    return;
  }

  response.forEach((task) => {
    let content = renderTask(task);

    container.insertAdjacentHTML("beforeend", content);
  });
}
