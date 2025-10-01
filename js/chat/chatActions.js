import { getMessages } from "../api.js";
import { setButtonState, showMessage } from "../utils/utils.js";
import { sendChatMessage } from "../websockets.js";
import { renderMessage } from "./chatRender.js";

export const chatAction = {
  async showChatAction(projectId, containerClass) {
    const container = document.querySelector(containerClass);
    container.innerHTML = "";

    const containerPrincipal = document.querySelector(".message-container");
    containerPrincipal.dataset.projectId = projectId;

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
  },

  async sendMessageToChatAction(
    content,
    projectId,
    inputElement,
    buttonElement,
  ) {
    if (!content || !projectId) {
      console.log("Error! Información incompleta");
      return;
    }

    sendChatMessage(content, projectId);

    inputElement.value = "";

    setButtonState(buttonElement, false, "Enviar");
  },

  showNewMessage(payload, containerClass) {
    const container = document.querySelector(containerClass);

    const containerPrincipal = document.querySelector(".message-container");
    const projectId = Number(containerPrincipal.dataset.projectId);

    console.log("projectId: ", projectId);
    console.log("payload: ", payload);

    // Valida que haya mensajes
    if (projectId === payload.project_id) {
      const message = renderMessage(payload);
      container.insertAdjacentHTML("beforeend", message);
    } else {
      showMessage("Nuevo mensaje en el chat");
    }
  },
};
