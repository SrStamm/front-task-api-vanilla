import { url } from "./config.js";

const token = localStorage.getItem("authToken");

const socket = new WebSocket(`${url}/ws?token=${token}`);

class PersonalMessage {
  constructor(content, received_user_id) {
    this.content = content;
    this.received_user_id = received_user_id;
  }

  static parse(payload) {
    return new PersonalMessage(payload.content, payload.received_user_id);
  }
}

class ChatMessage {
  constructor(content, project_id) {
    this.content = content;
    this.project_id = project_id;
  }

  static parse(payload) {
    return new ChatMessage(payload.content, payload.received_user_id);
  }
}

class OutgoingGroupMessagePayload {
  constructor(id, content, project_id, sender_id, timestamp) {
    this.id = id;
    this.content = content;
    this.project_id = project_id;
    this.sender_id = sender_id;
    this.timestamp = timestamp;
  }

  static parse(payload) {
    return new OutgoingGroupMessagePayload(
      payload.id,
      payload.content,
      payload.project_id,
      payload.sender_id,
      payload.timestamp,
    );
  }
}

class WebSocketEvent {
  constructor(type, payload) {
    this.type = type;
    this.payload = payload;
  }

  static createAndSerialize(type, payloadInstance) {
    const event = new WebSocketEvent(type, payloadInstance);

    return JSON.stringify(event);
  }

  static parse(event) {
    const event_received = JSON.parse(event.data);

    const event_parsed = new WebSocketEvent(
      event_received.type,
      event_received.payload,
    );

    if (event_parsed.type === "personal_message") {
      return PersonalMessage.parse(event_parsed.payload);
    } else if (event_parsed.type === "group_message") {
      return OutgoingGroupMessagePayload.parse(event_parsed.payload);
    }
  }
}

// Escuchar cuando se abre la conexión
socket.onopen = () => {
  console.log("Conectado al servidor WebSocket");

  const initialPayload = new PersonalMessage("Hola desde el front!", "1");
  const initialEvent = WebSocketEvent.createAndSerialize(
    "personal_message",
    initialPayload,
  );
  socket.send(initialEvent);

  function sendChatMessage(content, project_id) {
    if (!content || !project_id) {
      console.log("Error! Información incompleta");
      return;
    }

    const chatPayload = new ChatMessage(content, project_id);

    const eventToSend = new WebSocketEvent.createAndSerialize(
      "group_message",
      chatPayload,
    );

    socket.send(eventToSend);
  }
};

// Escuchar mensajes que llegan desde el backend
socket.onmessage = (event) => {
  const data = WebSocketEvent.parse(event);
  console.log("Mensaje recibido:", data);
  // Aquí actualizaría el DOM
};

// Manejar cierre de conexión
socket.onclose = () => {
  console.log("Conexión cerrada");
};

// Manejar errores
socket.onerror = (error) => {
  console.error("Error en WebSocket:", error);
};
