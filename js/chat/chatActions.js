import { getMessages } from "../api.js";
import { renderMessage } from "./chatRender.js";

export async function showChatAction(projectId, containerClass) {
  const container = document.querySelector(containerClass);
  container.innerHTML = "";

  // Obtiene los mensajes
  const response = await getMessages(projectId);

  // Valida que haya mensajes
  if (
    response.length === 0 ||
    response.detail == `Chat with project_id ${projectId} not found`
  ) {
    const message = `<p style="text-align: center;">No hay mensajes en este chat</p>`;
    container.insertAdjacentHTML("beforeend", message);
    return;
  }

  // Renderiza los mensajes
  response.forEach((message) => {
    let content = renderMessage(message);

    container.insertAdjacentHTML("beforeend", content);
  });
}
