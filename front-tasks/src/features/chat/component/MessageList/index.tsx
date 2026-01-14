import { useContext } from "react";
import type { ReadMessageInterface } from "../../schemas/messageSchema";
import MessageItem from "../MessageItem";
import "./MessageList.css";
import { AuthContext } from "../../../../providers/AuthProvider";

interface MessageListProps {
  messages: ReadMessageInterface[];
}

function MessageList({ messages }: MessageListProps) {
  const userContext = useContext(AuthContext);

  if (messages.length === 0) {
    return (
      <ul className="list-message">
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ color: "black" }}>No hay mensajes en este chat</p>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>
            Envía el primer mensaje
          </p>
        </div>
      </ul>
    );
  }

  return (
    <ul className="list-message">
      {messages.map((m) =>
        userContext.user.user_id == m.user_id || m.username == "Yo" ? (
          <MessageItem key={m.chat_id} message={m} isUser={true} />
        ) : (
          <MessageItem key={m.chat_id} message={m} isUser={false} />
        ),
      )}
    </ul>
  );
}

export default MessageList;
