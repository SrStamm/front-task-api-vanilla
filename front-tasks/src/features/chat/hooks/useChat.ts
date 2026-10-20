// Domain -- historical load -- decides which event matters -- updates status -- exposes simple API to UI

import { useCallback, useEffect, useState } from "react";
import { GetMessages } from "../services/chatService";
import { useChatSocket } from "./useChatSocket";
import type { ReadMessageInterface } from "../schemas/messageSchema";
import { useGroupProject } from "../../../hooks/useGroupProject";
import { UserInProject } from "../../projects/schemas/Project";
import { fetchUsersProject } from "../../projects/api/ProjectService";

interface GroupMessagePayload {
  id?: number;
  chat_id?: number;
  project_id: number;
  sender_id?: number;
  user_id?: number;
  content?: string;
  message?: string;
  timestamp: string;
}

export function useChat() {
  const [messages, setMessages] = useState<ReadMessageInterface[]>([]);
  const [usersInProject, setUsersInProject] = useState<
    UserInProject[] | undefined
  >();
  const { projectId, groupId } = useGroupProject();
  const { send, onMessage, isConnected } = useChatSocket();

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
    (data: { type: string; payload: unknown }) => {
      if (data.type !== "group_message") {
        return;
      }

      const payload = data.payload as GroupMessagePayload;

      const user = usersInProject?.find((u) => u.user_id === payload.sender_id);

      const mappedMessage: ReadMessageInterface = {
        chat_id: payload.id ?? payload.chat_id ?? 0,
        project_id: payload.project_id,
        user_id: payload.sender_id ?? payload.user_id ?? 0,
        username: user?.username ?? "Usuario desconocido",
        message: payload.content ?? payload.message ?? "",
        timestamp: new Date(payload.timestamp),
      };

      if (mappedMessage.project_id !== projectId) {
        return;
      }

      setMessages((prev) => {
        const cleanIncoming = mappedMessage.message.trim();

        const sinOptimista = prev.filter(
          (m) => !(m.username === "Yo" && m.message === cleanIncoming),
        );

        const yaExiste = sinOptimista.some(
          (msg) => msg.chat_id === mappedMessage.chat_id,
        );

        if (yaExiste) return sinOptimista;

        return [...sinOptimista, mappedMessage];
      });
    },

    [projectId, usersInProject],
  );

  useEffect(() => {
    const unsubscribe = onMessage(handleIncomingMessage);

    return unsubscribe;
  }, [onMessage, handleIncomingMessage]);

  // 🔹 Enviar mensaje
  const sendMessage = useCallback(
    async (content: string) => {
      if (!projectId) {
        return;
      }

      if (!content || !content.trim()) {
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

      const success = send(messageData);

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
    [projectId, send],
  );

  return {
    messages,
    sendMessage,
    isConnected,
  };
}
