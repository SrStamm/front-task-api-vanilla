import { createTask } from "../api.js";
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
