import { url } from "./config.js";

const token = localStorage.getItem("authToken");

const socket = new WebSocket(`${url}/ws?token=${token}`);

// Escuchar cuando se abre la conexión
socket.onopen = () => {
  console.log("Conectado al servidor WebSocket");
  socket.send(
    JSON.stringify({
      type: "personal_message",
      payload: { content: "Hola desde el front!", received_user_id: "1" },
    }),
  );
};

// Escuchar mensajes que llegan desde el backend
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("Mensaje recibido:", data);
  // Aquí actualizarías el DOM o el estado en React
};

// Manejar cierre de conexión
socket.onclose = () => {
  console.log("Conexión cerrada");
};

// Manejar errores
socket.onerror = (error) => {
  console.error("Error en WebSocket:", error);
};
