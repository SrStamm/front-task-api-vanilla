// Infra: open/close WS --- keeps listeners ---- He doesn't know anything about chat

import { useEffect, useRef, useState } from "react";
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
    if (token) {
      const url = new URL(ws_url);
      url.searchParams.set("token", token);

      const ws = new WebSocket(url.toString());

      socketRef.current = ws;

      ws.onopen = () => setIsConnected(true);
      ws.onclose = () => setIsConnected(false);
      ws.onerror = () => setIsConnected(false);

      return () => ws.close();
    }
  }, [token]);

  // Envia el mensaje al servidor
  const send = (data: SocketMessage) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    }
  };

  // Mantiene un array de funciones callbacks para distribuir mensajes
  const listeners = useRef<((data: SocketMessage) => void)[]>([]);

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      listeners.current.forEach((cb) => cb(data));
    };
  }, []);

  // Permite suscribir callbacks para recibir mensajes
  const onMessage = (callback: (data: SocketMessage) => void) => {
    listeners.current.push(callback);
    console.log(callback);

    return () => {
      listeners.current = listeners.current.filter((cb) => cb !== callback);
    };
  };

  return {
    send,
    onMessage,
    isConnected,
  };
}
