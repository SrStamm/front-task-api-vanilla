import { useContext, useEffect, useRef } from "react";
import type { ReadMessageInterface } from "../../schemas/messageSchema";
import MessageItem from "../MessageItem";
import "./MessageList.css";
import { AuthContext } from "../../../../providers/AuthProvider";
import ErrorContainer from "../../../../components/common/ErrorContainer";

interface MessageListProps {
  messages: ReadMessageInterface[];
}

function MessageList({ messages }: MessageListProps) {
  const userContext = useContext(AuthContext);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const scrollBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const distanceToBottom =
      list.scrollHeight - list.scrollTop - list.clientHeight;

    if (distanceToBottom < 150) {
      scrollBottom();
    }
  }, [messages]);

  return (
    <ul className="list-message" ref={listRef}>
      {messages.length === 0 ? (
        <ErrorContainer
          isButton={false}
          isError={false}
          advice="No hay mensajes en este chat"
          recommendation="Envía el primer mensaje"
        />
      ) : (
        messages.map((m) =>
          userContext.user.user_id == m.user_id || m.username == "Yo" ? (
            <MessageItem key={m.chat_id} message={m} isUser={true} />
          ) : (
            <MessageItem key={m.chat_id} message={m} isUser={false} />
          ),
        )
      )}

      <div ref={messageEndRef} />
    </ul>
  );
}

export default MessageList;
