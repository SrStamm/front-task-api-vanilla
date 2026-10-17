import { createContext } from "react";

export interface SocketMessage {
  type: string;
  payload: unknown;
}

interface SocketContextType {
  send: (data: SocketMessage) => boolean;
  onMessage: (callback: (data: SocketMessage) => void) => () => void;
  isConnected: boolean;
}

export const SocketContext = createContext<SocketContextType | undefined>(
  undefined,
);
