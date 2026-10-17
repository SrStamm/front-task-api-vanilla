import { useContext } from "react";
import { SocketContext } from "../../../providers/socket-contexts";

export function useChatSocket() {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useChatSocket debe utilizarse dentro de SocketProvider");
  }

  return context;
}
