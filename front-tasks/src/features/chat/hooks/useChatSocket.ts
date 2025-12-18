// Infra: open/close WS --- keeps listeners ---- He doesn't know anything about chat

import { useEffect, useRef, useState } from "react";

const ws_url = import.meta.env.VITE_URL_WS;

interface SocketMessage {
  type: string;
  payload: any;
}

export function useChatSocket(projectId: number) {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(ws_url);

    socketRef.current = ws;

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    ws.onerror = () => setIsConnected(false);

    return () => ws.close();
  }, [projectId]);

  const send = (data: SocketMessage) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    }
  };

  const listeners = useRef<((data: SocketMessage) => void)[]>([]);

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      listeners.current.forEach((cb) => cb(data));
    };
  }, []);

  const onMessage = (callback: (data: SocketMessage) => void) => {
    listeners.current.push(callback);

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
