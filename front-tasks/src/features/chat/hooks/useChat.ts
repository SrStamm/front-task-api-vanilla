// Domain -- historical load -- decides which event matters -- updates status -- exposes simple API to UI

import { useEffect, useState } from "react";
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
  const socket = useChatSocket(projectId);

  // 🔹 Cargar histórico (REST)
  useEffect(() => {
    if (projectId && typeof projectId === "number") {
      GetMessages(projectId).then(setMessages);
    } else {
      return setMessages([]);
    }
  }, [projectId]);

  // 🔹 Mensajes entrantes (WebSocket)
  useEffect(() => {
    const unsubscribe = socket.onMessage((data) => {
      if (data.type === "group_message") {
        setMessages((prev) => [...prev, data.payload]);
      }
    });

    return unsubscribe;
  }, [projectId, socket]);

  // 🔹 Enviar mensaje
  const sendMessage = async (content: string) => {
    socket.send({
      type: "group_message",
      payload: {
        project_id: projectId,
        content,
      },
    });
  };

  return {
    messages,
    sendMessage,
    isConnected: socket.isConnected,
  };
}
