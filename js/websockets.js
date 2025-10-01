import { showNewMessage } from "./chat/chatActions.js";
import {
  ChatMessage,
  OutgoingGroupMessagePayload,
  WebSocketEvent,
} from "./chat/chatClass.js";
import { url } from "./config.js";

const token = localStorage.getItem("authToken");

const socket = new WebSocket(`${url}/ws?token=${token}`);

// Escuchar cuando se abre la conexión
socket.onopen = () => {
  console.log("Conectado al servidor WebSocket");
};

// Escuchar mensajes que llegan desde el backend
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);

  // Aquí actualizaría el DOM
  switch (data.type) {
    case "group_message":
      const groupMessage = OutgoingGroupMessagePayload.parse(data.payload);
      console.log("Mensaje del grupo: ", groupMessage);

      showNewMessage(groupMessage, ".list-message");

      break;

    case "personal_message":
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
