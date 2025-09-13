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
    showMessage("No hay tareas en este proyecto", "info");
    return;
  }

  response.forEach((task) => {
    let content = renderTask(task);

    if (task.state === "Done") {
      const completedTasksContainer = document.getElementById(
        "taskColumnCompleted",
      );

      const completedList =
        completedTasksContainer.querySelector("containerClass");

      completedList.insertAdjacentHTML("beforeend", content);
    } else if (task.state === "In Progress") {
      const inProgressTasksContainer = document.getElementById(
        "taskColumnInProgress",
      );

      const inProgressList =
        inProgressTasksContainer.querySelector(containerClass);
      inProgressList.insertAdjacentHTML("beforeend", content);
    } else if (task.state === "To Do") {
      const toDoTasksContainer = document.getElementById("taskColumnToDo");

      const toDoList = toDoTasksContainer.querySelector(containerClass);

      toDoList.insertAdjacentHTML("beforeend", content);
    } else {
      console.log("Estado de tarea desconocido", task);
    }
  });
}
