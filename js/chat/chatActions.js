export async function showChatAction(projectId, containerClass) {
  const container = document.querySelector(containerClass);
  container.innerHTML = "";

  const response = await getTasksFromProject(projectId);

  if (response.length === 0) {
    showMessage("No hay tareas en este proyecto", "info");
    return;
  }

  response.forEach((task) => {
    let content = renderTask(task, projectId);

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
