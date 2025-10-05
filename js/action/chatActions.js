import { getMessages } from "../api.js";
import { utils } from "../utils/utils.js";
import { sendChatMessage } from "../websockets.js";
import { renderMessage } from "../render/chatRender.js";

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

    const userData = localStorage.getItem("currentUser");
    const userDataParsed = JSON.parse(userData);

    // Renderiza los mensajes
    response.forEach((message) => {
      let content = renderMessage(message, userDataParsed.user_id);

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

    utils.setButtonState(buttonElement, false, "Enviar");
  },

  showNewMessage(payload, containerClass) {
    const container = document.querySelector(containerClass);

    const containerPrincipal = document.querySelector(".message-container");
    const projectId = Number(containerPrincipal.dataset.projectId);

    const userData = localStorage.getItem("currentUser");
    const userDataParsed = JSON.parse(userData);

    // Valida que haya mensajes
    if (projectId === payload.project_id) {
      console.log("Nuevo mensaje en el chat: ", payload);
      const message = renderMessage(payload, userDataParsed.user_id);
      container.insertAdjacentHTML("beforeend", message);
    } else {
      utils.showMessage("Nuevo mensaje en el chat");
    }
  },
};
