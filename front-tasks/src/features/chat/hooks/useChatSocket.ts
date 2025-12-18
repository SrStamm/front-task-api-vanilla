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

    console.log("useChatSocket: Iniciando conexión WebSocket...");

    try {
      const url = new URL(ws_url);
      url.searchParams.set("token", token);

      const ws = new WebSocket(url.toString());
      socketRef.current = ws;

      ws.onopen = () => {
        console.log("useChatSocket: ✅ WebSocket CONECTADO");
        setIsConnected(true);
      };

      ws.onclose = (e) => {
        console.log("useChatSocket: ❌ WebSocket DESCONECTADO", {
          code: e.code,
          reason: e.reason,
          wasClean: e.wasClean,
        });
        setIsConnected(false);
      };

      ws.onerror = (error) => {
        console.error("useChatSocket: ⚠️ Error WebSocket:", error);
        setIsConnected(false);
      };

      ws.onmessage = (e) => {
        console.log("useChatSocket: 📨 Mensaje RAW recibido:", e.data);
        try {
          const data = JSON.parse(e.data);
          console.log("useChatSocket: 📦 Mensaje parseado:", data);
          // Distribuir a todos los listeners
          listeners.current.forEach((cb, index) => {
            console.log(`useChatSocket: Enviando a listener #${index}`);
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
        console.log("useChatSocket: 🧹 Limpiando WebSocket");
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
    console.log("useChatSocket: 📤 Intentando enviar:", data);

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const jsonData = JSON.stringify(data);
      console.log("useChatSocket: 📤 Enviando JSON:", jsonData);
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
    console.log(
      "useChatSocket: 👂 Agregando nuevo listener. Total antes:",
      listeners.current.length,
    );

    // Agregar el callback
    listeners.current.push(callback);
    console.log(
      "useChatSocket: 👂 Listeners después:",
      listeners.current.length,
    );

    return () => {
      console.log("useChatSocket: 🗑️ Removiendo listener");
      listeners.current = listeners.current.filter((cb) => cb !== callback);
      console.log(
        "useChatSocket: 🗑️ Listeners restantes:",
        listeners.current.length,
      );
    };
  }, []);

  return {
    send,
    onMessage,
    isConnected,
  };
}
