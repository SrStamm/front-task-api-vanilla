import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "../hooks/useAuth";
import { SocketContext, SocketMessage } from "./socket-contexts";
import NotificationToasts from "../features/notifications/components/NotificationToasts";

const ws_url = import.meta.env.VITE_URL_WS;

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token } = useAuth();

  const MAX_ATTEMPTS = 5;

  // Crea la conexión WebSocket al montar el componente y la cierra al desmontar
  useEffect(() => {
    // Valida si se tiene un token
    if (!token) {
      return;
    }

    let attempts = 0;
    let timer: ReturnType<typeof setTimeout>;
    let closedByUs = false;

    const connect = () => {
      try {
        const url = new URL(ws_url);
        url.searchParams.set("token", token);

        const ws = new WebSocket(url.toString());
        socketRef.current = ws;

        ws.onopen = () => {
          if (socketRef.current !== ws) return; // ◀ punto 4
          attempts = 0;
          setIsConnected(true);
        };

        ws.onclose = () => {
          if (socketRef.current !== ws) return; // ◀ punto 4
          setIsConnected(false);
          if (closedByUs || attempts >= MAX_ATTEMPTS) return;
          attempts += 1;
          timer = setTimeout(
            connect,
            Math.min(1000 * 2 ** (attempts - 1), 15000),
          );
        };

        ws.onerror = () => {
          // El navegador dispara onclose apenas después; no toques estado acá
          // para no duplicar el ciclo de reconexión.
        };

        ws.onmessage = (e) => {
          if (socketRef.current !== ws) return; // ◀ punto 4
          try {
            const data = JSON.parse(e.data);
            listeners.current.forEach((cb, index) => {
              try {
                cb(data);
              } catch (err) {
                console.error(`listener #${index}:`, err);
              }
            });
          } catch {
            console.error("JSON inválido:", e.data);
          }
        };
      } catch (error) {
        console.error("Error creando WebSocket:", error);
      }
    };

    connect();

    return () => {
      closedByUs = true; // ◀ no reintentar al desmontar
      clearTimeout(timer);
      const ws = socketRef.current;
      if (!ws) return;
      ws.onopen = null;
      ws.onclose = null;
      ws.onerror = null;
      ws.onmessage = null;
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close(1000, "Component unmounted");
      }
      socketRef.current = null;
    };
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

  // Mantiene estable la referencia del objeto mientras sus propiedades no cambien
  const contextValue = useMemo(
    () => ({
      send,
      onMessage,
      isConnected,
    }),
    [send, onMessage, isConnected],
  );

  return (
    <SocketContext.Provider value={contextValue}>
      <NotificationToasts />
      {children}
    </SocketContext.Provider>
  );
};
