import type { ReadMessageInterface } from "../../schemas/messageSchema";
import MessageItem from "../MessageItem";
import "./MessageList.css";

interface MessageListProps {
  messages: ReadMessageInterface[];
}

function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return <p>No hay mensajes</p>;
  }

  return (
    <ul className="list-message">
      {messages.map((m) => (
        <MessageItem key={m.chat_id} message={m} />
      ))}
    </ul>
  );
}

export default MessageList;
