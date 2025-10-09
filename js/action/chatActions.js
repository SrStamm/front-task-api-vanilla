import { getMessages } from "../api.js";
import { utils } from "../utils/utils.js";
import { sendChatMessage } from "../websockets.js";
import { renderMessage } from "../render/chatRender.js";

// Variables para proyectos
let chatOffset = 0;
const chatLimit = 10;
let loadingChat = false;
let allMessagesLoaded = false;
let observer = false;

export const chatAction = {
  resetChat() {
    chatOffset = 0;
    allMessagesLoaded = false;
    if (observer) {
      observer.disconnect();
      observer = false;
    }
  },

  async showChatAction(projectId, containerClass, initial) {
    if (loadingChat || allMessagesLoaded) return;
    loadingChat = true;

    try {
      utils.showSpinner();

      const container = document.querySelector(containerClass);

      if (initial) {
        // Limpiar el contenedor y recrear la estructura
        container.innerHTML = `
          <ol class="list-message"></ol>
        `;
        chatAction.resetChat();
      }

      const listMessages = container.querySelector(".list-message");

      if (!listMessages) {
        console.error("No se encontró el elemento list-message");
        return;
      }

      const containerPrincipal = document.querySelector(".message-container");
      containerPrincipal.dataset.projectId = projectId;

      // Obtiene los mensajes
      const response = await getMessages(projectId, chatLimit, chatOffset);

      // Valida que haya mensajes
      if (
        (response.length === 0 && initial) ||
        response.detail == `Chat with project_id ${projectId} not found`
      ) {
        const message = `<li style="text-align: center; padding: 1rem;">No hay mensajes en este chat</li>`;
        listMessages.insertAdjacentHTML("beforeend", message);
        return;
      }

      const userId = utils.getCurrentUserId();

      // Encuentra o crea el sentinel
      let sentinel = document.querySelector(".chatSentinel");
      if (!sentinel) {
        sentinel = document.createElement("li");
        sentinel.classList.add("chatSentinel");
        listMessages.prepend(sentinel);
      }

      // Guardar posición del scroll antes de añadir mensajes

      const isAtBottom =
        listMessages.scrollHeight - listMessages.scrollTop <=
        listMessages.clientHeight + 5;

      // Renderiza los mensajes en orden Backend
      response.forEach((message) => {
        let content = renderMessage(message, userId);
        sentinel.insertAdjacentHTML("afterend", content);
      });

      // Actualiza el offset
      chatOffset += response.length;

      // Verifica si se cargaron todos los mensajes
      if (response.length < chatLimit) {
        allMessagesLoaded = true;
        sentinel.remove();
        if (observer) {
          observer.disconnect();
          observer = false;
        }
      }

      // Restaurar el scroll
      if (initial || isAtBottom) {
        setTimeout(() => {
          listMessages.scrollTop = listMessages.scrollHeight;
        }, 100);
      }

      // Configurar observer solo en carga inicial
      if (initial && !observer && !allMessagesLoaded) {
        observer = new IntersectionObserver(
          (entries) => {
            if (
              entries[0].isIntersecting &&
              !loadingChat &&
              !allMessagesLoaded
            ) {
              chatAction.showChatAction(projectId, containerClass, false);
            }
          },
          {
            root: listMessages,
            rootMargin: "100px ",
            threshold: 0.1,
          },
        );
        observer.observe(sentinel);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      utils.hideSpinner();
      loadingChat = false;
    }
  },

  async sendMessageToChatAction(
    content,
    projectId,
    inputElement,
    buttonElement,
  ) {
    if (!content || !projectId) {
      utils.showMessage("Información incompleta para enviar el mensaje");
      return;
    }

    sendChatMessage(content, projectId);

    inputElement.value = "";

    utils.setButtonState(buttonElement, false, "Enviar");
  },

  showNewMessage(payload, containerClass) {
    const container = document.querySelector(containerClass);
    const listMessages = container.querySelector(".list-message");

    if (!listMessages) {
      console.error("No se encontró list-message para mostrar nuevo mensaje");
      return;
    }

    const containerPrincipal = document.querySelector(".message-container");
    const projectId = Number(containerPrincipal.dataset.projectId);

    const userId = utils.getCurrentUserId();

    // Valida que el mensaje sea para el proyecto actual
    if (projectId === payload.project_id) {
      console.log("Nuevo mensaje en el chat: ", payload);
      const message = renderMessage(payload, userId);

      // Insertar al FINAL de la lista (mensaje más reciente)
      listMessages.insertAdjacentHTML("beforeend", message);

      // Auto-scroll al nuevo mensaje solo si el usuario está cerca del final
      const isNearBottom =
        listMessages.scrollHeight -
          listMessages.clientHeight -
          listMessages.scrollTop <=
        100;
      if (isNearBottom) {
        setTimeout(() => {
          listMessages.scrollTop = listMessages.scrollHeight;
        }, 50);
      }
    } else {
      utils.showMessage("Nuevo mensaje en otro chat");
    }
  },
};
