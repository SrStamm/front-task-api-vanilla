// Infra: open/close WS --- keeps listeners ---- He doesn't know anything about chat

import { useCallback, useEffect, useRef, useState } from "react";

const ws_url = import.meta.env.VITE_URL_WS;

interface SocketMessage {
  type: string;
  payload: any;
}

export function useChatSocket() {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const token = localStorage.getItem("token");

  // Crea la conexión WebSocket al montar el componente y la cierra al desmontar
  useEffect(() => {
    if (!token) {
      console.log("useChatSocket: No hay token disponible");
      return;
    }

    try {
      const url = new URL(ws_url);
      url.searchParams.set("token", token);

      const ws = new WebSocket(url.toString());
      socketRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onclose = () => {
        setIsConnected(false);
      };

      ws.onerror = (error) => {
        console.error("useChatSocket: ⚠️ Error WebSocket:", error);
        setIsConnected(false);
      };

      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          // Distribuir a todos los listeners
          listeners.current.forEach((cb, index) => {
            try {
              cb(data);
            } catch (err) {
              console.error(`useChatSocket: Error en listener #${index}:`, err);
            }
          });
        } catch (error) {
          console.error(
            "useChatSocket: ❌ Error parsing JSON:",
            error,
            "Data:",
            e.data,
          );
        }
      };
      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close(1000, "Component unmounted");
        }
      };
    } catch (error) {
      console.error("useChatSocket: ❌ Error creando WebSocket:", error);
    }
  }, [token]);

  // Envia el mensaje al servidor
  const send = useCallback((data: SocketMessage) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const jsonData = JSON.stringify(data);
      socketRef.current.send(jsonData);
      return true;
    } else {
      console.error(
        "useChatSocket: ❌ No se puede enviar - Estado:",
        socketRef.current?.readyState,
      );
      return false;
    }
  }, []);

  // Mantiene un array de funciones callbacks para distribuir mensajes
  const listeners = useRef<((data: SocketMessage) => void)[]>([]);

  // Permite suscribir callbacks para recibir mensajes
  const onMessage = useCallback((callback: (data: SocketMessage) => void) => {
    // Agregar el callback
    listeners.current.push(callback);

    return () => {
      listeners.current = listeners.current.filter((cb) => cb !== callback);
    };
  }, []);

  return {
    send,
    onMessage,
    isConnected,
  };
}
