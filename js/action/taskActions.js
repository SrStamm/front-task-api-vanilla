import { createTask, editTask, getTasksFromProject } from "../api.js";
import { taskRender } from "../render/taskRender.js";
import { utils } from "../utils/utils.js";

export const taskAction = {
  async createTaskAction(taskData, projectId) {
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
      utils.showMessage("Error al crear la tarea");
      return { success: false, detail: error };
    }
  },

  async showTasksFromProjectAction(projectId, containerClass) {
    const container = document.querySelector(containerClass);
    container.innerHTML = "";

    const response = await getTasksFromProject(projectId);

    if (response.length === 0) {
      utils.showMessage("No hay tareas en este proyecto", "info");
      return;
    }

    response.forEach((task) => {
      let content = taskRender.renderTask(task, projectId);

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
  },

  async editTaskAction(projectId, taskId, taskData) {
    try {
      let response = await editTask(projectId, taskId, taskData);

      if (response.detail !== "A task has been successfully updated") {
        throw new Error(response.detail);
      }

      utils.showMessage("Tarea editada exitosamente", "success");

      const modalContainer = document.getElementById("genericModal");
      const currentTaskData = JSON.parse(
        modalContainer.dataset.taskData || "{}",
      );

      // Aca iría la obtención de los comentarios
      //
      //

      modalContainer.dataset.taskData = JSON.stringify(currentTaskData);

      return { success: true, taskData: currentTaskData };
    } catch (error) {
      utils.showMessage("Error al editar la tarea: ", error.message);
    }
  },
};
