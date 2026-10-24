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

const PAGE_SIZE = 100;

export function useChat() {
  const [messages, setMessages] = useState<ReadMessageInterface[]>([]);
  const [usersInProject, setUsersInProject] = useState<
    UserInProject[] | undefined
  >();
  const [usersError, setUsersError] = useState<unknown>(null);
  const [messagesError, setMessagesError] = useState<unknown>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const { projectId, groupId } = useGroupProject();
  const { send, onMessage, isConnected } = useChatSocket();

  useEffect(() => {
    if (projectId && groupId) {
      setUsersError(null);
      fetchUsersProject(groupId, projectId)
        .then(setUsersInProject)
        .catch((err) => {
          console.error("Error obteniendo los usuarios del proyecto: ", err);
          setUsersError(err);
          setUsersInProject([]);
        });
    } else {
      setUsersError(null);
      setUsersInProject([]);
    }
  }, [groupId, projectId]);

  // 🔹 Cargar histórico (REST) - cargar los últimos mensajes
  useEffect(() => {
    if (projectId && typeof projectId === "number") {
      setMessagesError(null);
      setIsLoadingMessages(true);
      // Intentar cargar la última página: pedimos un límite grande o simplemente los últimos
      GetMessages(projectId, { limit: 200 })
        .then((data) => {
          // Si vienen ordenados asc por timestamp, mantenemos; si queremos asegurar últimos, invertimos si necesario
          setMessages(Array.isArray(data) ? data : []);
        })
        .catch((err: any) => {
          // Tratar "no encontrado" como chat vacío, no error
          const status = err?.response?.status;
          const message = err?.message || "";
          if (status === 404 || message.includes("ChatNotFoundError") || message.includes("not found")) {
            setMessages([]);
            setMessagesError(null);
            return;
          }
          console.error("useChat: ❌ Error cargando mensajes:", err);
          setMessagesError(err);
        })
        .finally(() => {
          setIsLoadingMessages(false);
        });
    } else {
      setMessages([]);
      setMessagesError(null);
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
        username: user?.username ?? (usersError ? "Usuario desconocido (error)" : "Usuario desconocido"),
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
    messagesError,
    usersError,
    isLoadingMessages,
  };
}
