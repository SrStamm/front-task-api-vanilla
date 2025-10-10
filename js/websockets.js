import { chatAction } from "./action/chatActions.js";
import {
  ChatMessage,
  OutgoingGroupMessagePayload,
  WebSocketEvent,
} from "./chat/chatClass.js";
import { url } from "./config.js";
import { utils } from "./utils/utils.js";

const token = localStorage.getItem("authToken");

const socket = new WebSocket(`${url}/ws?token=${token}`);

// Escuchar cuando se abre la conexión
socket.onopen = () => {
  console.log("Conectado al servidor WebSocket");
};

// Escuchar mensajes que llegan desde el backend
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  console.log("Mensaje recibido:", data);

  // Aquí actualizaría el DOM
  switch (data.type) {
    case "group_message":
      const groupMessage = OutgoingGroupMessagePayload.parse(data.payload);

      chatAction.showNewMessage(groupMessage, ".list-message");

      break;

    case "personal_message":
      break;

    case "notification":
      console.log("Mensaje recibido:", data);
      showNotification(data.payload);
      break;

    default:
      console.warn("Evento desconocido: ", data);
  }
};

// Manejar cierre de conexión
socket.onclose = () => {
  console.log("Conexión cerrada");
};

// Manejar errores
socket.onerror = (error) => {
  console.error("Error en WebSocket:", error);
};

// Enviar mensaje en el chat
export function sendChatMessage(content, projectId) {
  const chatPayload = new ChatMessage(content, projectId);

  const eventToSend = WebSocketEvent.createAndSerialize(
    "group_message",
    chatPayload,
  );

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(eventToSend);
  } else {
    console.log("Conexión cerrada");
    return;
  }
}

function showNotification(payload) {
  const { notification_type, message } = payload;

  console.log(payload);
  console.log(notification_type, message);

  const successTypes = [
    "comment_mention",
    "assigned_task",
    "append_to_group",
    "update_role_to_group",
    "add_user_to_project",
    "permission_update",
  ];

  const failureTypes = [
    "not_assigned_task",
    "remove_user_to_group",
    "delete_user_from_project",
  ];

  if (successTypes.includes(notification_type)) {
    utils.showMessage(message, "info");
  }

  if (failureTypes.includes(notification_type)) {
    utils.showMessage(message, "advert");
  }
}
