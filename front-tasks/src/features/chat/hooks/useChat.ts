// Domain -- historical load -- decides which event matters -- updates status -- exposes simple API to UI

import { useCallback, useEffect, useState } from "react";
import { GetMessages } from "../services/chatService";
import { useChatSocket } from "./useChatSocket";
import type { ReadMessageInterface } from "../schemas/messageSchema";
import { useGroupProject } from "../../../hooks/useGroupProject";
import { UserInProject } from "../../projects/schemas/Project";
import { fetchUsersProject } from "../../projects/api/ProjectService";

export function useChat() {
  const [messages, setMessages] = useState<ReadMessageInterface[]>([]);
  const [usersInProject, setUsersInProject] = useState<
    UserInProject[] | undefined
  >();
  const { projectId, groupId } = useGroupProject();
  const socket = useChatSocket();

  useEffect(() => {
    if (projectId && groupId) {
      fetchUsersProject(groupId, projectId)
        .then(setUsersInProject)
        .catch((err) => {
          console.error("Error obteniendo los usuarios del proyecto: ", err);
        });
    } else {
      return setUsersInProject([]);
    }
  }, [groupId, projectId]);

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
      if (data.type === "group_message") {
        const user = usersInProject.find(
          (u) => u.user_id === data.payload.sender_id,
        );

        const mappedMessage = {
          chat_id: data.payload.id || data.payload.chat_id,
          project_id: data.payload.project_id,
          user_id: data.payload.sender_id || data.payload.user_id,
          username: user.username,
          message: data.payload.content || data.payload.message,
          timestamp: new Date(data.payload.timestamp),
        };

        // Verificar que sea para el proyecto actual
        if (mappedMessage.project_id === projectId) {
          setMessages((prev) => {
            const cleanIncoming = mappedMessage.message.trim();
            const sinOptimista = prev.filter(
              (m) => !(m.username === "Yo" && m.message === cleanIncoming),
            );

            const yaExiste = sinOptimista.some(
              (msg) => msg.chat_id === mappedMessage.chat_id,
            );

            if (yaExiste) return sinOptimista;

            return [...prev, mappedMessage];
          });
        } else {
          return;
        }
      } else {
        console.log("useChat: ℹ️ Tipo de mensaje no manejado:", data.type);
      }
    },
    [projectId, usersInProject],
  );

  useEffect(() => {
    const unsubscribe = socket.onMessage(handleIncomingMessage);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [projectId, handleIncomingMessage, socket]);

  // 🔹 Enviar mensaje
  const sendMessage = useCallback(
    async (content: string) => {
      if (!projectId) {
        console.error("useChat: ❌ No hay projectId");
        return;
      }

      if (!content || !content.trim()) {
        console.error("useChat: ❌ Contenido vacío");
        return;
      }

      const trimmedContent = content.trim();

      const messageData = {
        type: "group_message",
        payload: {
          project_id: projectId,
          content: trimmedContent,
          timestamp: new Date().toISOString(),
        },
      };

      const success = socket.send(messageData);

      // Mensaje optimista
      if (success) {
        const optimisticMessage: ReadMessageInterface = {
          chat_id: Math.random(),
          message: trimmedContent,
          project_id: projectId,
          user_id: Math.random(),
          username: "Yo",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, optimisticMessage]);
      }
    },
    [projectId, socket],
  );

  return {
    messages,
    sendMessage,
    isConnected: socket.isConnected,
  };
}
