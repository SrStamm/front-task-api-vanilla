// Domain -- historical load -- decides which event matters -- updates status -- exposes simple API to UI

import { useCallback, useEffect, useState } from "react";
import { GetMessages } from "../services/chatService";
import { useChatSocket } from "./useChatSocket";
import type { ReadMessageInterface } from "../schemas/messageSchema";
import { useGroupProject } from "../../../hooks/useGroupProject";

interface ChatMessage {
  content: string;
  project_id: number;
}

export function useChat() {
  const [messages, setMessages] = useState<ReadMessageInterface[]>([]);
  const { projectId } = useGroupProject();
  const socket = useChatSocket();

  // 🔹 Cargar histórico (REST)
  useEffect(() => {
    if (projectId && typeof projectId === "number") {
      GetMessages(projectId)
        .then(setMessages)
        .catch((err) => {
          console.error("useChat: ❌ Error cargando mensajes:", err);
        });
    } else {
      return setMessages([]);
    }
  }, [projectId]);

  // 🔹 Mensajes entrantes (WebSocket) - CON useCallback para evitar re-creaciones
  const handleIncomingMessage = useCallback(
    (data: any) => {
      console.log("useChat: 📨 Handler ejecutado con data:", data);

      if (data.type === "group_message") {
        console.log("useChat: 📨 Es un group_message. payload:", data.payload);
        console.log(
          "useChat: 📨 Proyecto mensaje:",
          data.payload.project_id,
          "vs actual:",
          projectId,
        );

        // Verificar que sea para el proyecto actual
        if (data.payload.project_id === projectId) {
          console.log("useChat: ✅ Agregando mensaje:", data.payload.content);

          setMessages((prev) => {
            // EVITAR DUPLICADOS - verificar si el mensaje ya existe
            const exists = prev.some(
              (msg) =>
                msg.chat_id === data.payload.chat_id ||
                (msg.timestamp &&
                  data.payload.timestamp &&
                  msg.timestamp === data.payload.timestamp),
            );

            if (exists) {
              console.log("useChat: ⏭️ Mensaje duplicado, ignorando");
              return prev;
            }

            const newMessages = [...prev, data.payload];
            console.log(
              "useChat: 📊 Total mensajes ahora:",
              newMessages.length,
            );
            return newMessages;
          });
        } else {
          console.log("useChat: ⏭️ Ignorando mensaje de otro proyecto");
        }
      } else {
        console.log("useChat: ℹ️ Tipo de mensaje no manejado:", data.type);
      }
    },
    [projectId],
  );

  useEffect(() => {
    console.log("useChat: 🔄 useEffect WebSocket. projectId:", projectId);

    console.log("useChat: 👂 Registrando listener WebSocket");
    const unsubscribe = socket.onMessage(handleIncomingMessage);

    console.log("useChat: 🔄 useEffect WebSocket configurado");

    return () => {
      console.log("useChat: 🧹 Limpiando listener WebSocket");
      if (unsubscribe) unsubscribe();
    };
  }, [projectId, handleIncomingMessage, socket.onMessage]);

  // 🔹 Enviar mensaje
  const sendMessage = useCallback(
    async (content: string) => {
      console.log("useChat: 📤 sendMessage llamado con:", content);

      if (!projectId) {
        console.error("useChat: ❌ No hay projectId");
        return;
      }

      if (!content || !content.trim()) {
        console.error("useChat: ❌ Contenido vacío");
        return;
      }

      const trimmedContent = content.trim();
      console.log("useChat: 📤 Enviando mensaje:", {
        projectId,
        content: trimmedContent,
      });

      const messageData = {
        type: "group_message",
        payload: {
          project_id: projectId,
          content: trimmedContent,
          timestamp: new Date().toISOString(),
        },
      };

      const success = socket.send(messageData);
      console.log("useChat: 📤 Envío exitoso?", success);

      // Mensaje optimista
      if (success) {
        const optimisticMessage: ReadMessageInterface = {
          chat_id: Math.random(),
          message: trimmedContent,
          project_id: projectId,
          user_id: Math.random(),
          timestamp: new Date(),
        };

        console.log(
          "useChat: ⚡ Agregando mensaje optimista:",
          optimisticMessage,
        );
        setMessages((prev) => [...prev, optimisticMessage]);
      }
    },
    [projectId, socket.send],
  );

  return {
    messages,
    sendMessage,
    isConnected: socket.isConnected,
  };
}
