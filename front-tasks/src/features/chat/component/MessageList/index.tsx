import type { ReadMessageInterface } from "../../schemas/messageSchema";
import MessageItem from "../MessageItem";

interface MessageListProps {
  messages: ReadMessageInterface[];
}

function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return <p>No hay mensajes</p>;
  }
  return (
    <>
      {messages.map((m) => (
        <MessageItem key={m.chat_id} message={m} />
      ))}
    </>
  );
}

export default MessageList;
