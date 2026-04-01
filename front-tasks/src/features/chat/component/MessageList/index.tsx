import { useContext, useEffect, useRef } from "react";
import type { ReadMessageInterface } from "../../schemas/messageSchema";
import MessageItem from "../MessageItem";
import "./MessageList.css";
import { AuthContext } from "../../../../providers/AuthProvider";
import ErrorContainer from "../../../../components/common/ErrorContainer";
import TypingIndicator from "../../../../components/common/TypingIndicator";

interface MessageListProps {
  messages: ReadMessageInterface[];
  typingUser?: string;
}

function MessageList({ messages, typingUser }: MessageListProps) {
  const userContext = useContext(AuthContext);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const isUserScrolledRef = useRef(false);
  const prevMessagesLengthRef = useRef(messages.length);

  const scrollBottom = (smooth = true) => {
    messageEndRef.current?.scrollIntoView({ 
      behavior: smooth ? "smooth" : "auto" 
    });
  };

  // Detectar si el usuario scrolleó manualmente
  const handleScroll = () => {
    const list = listRef.current;
    if (!list) return;
    
    const distanceToBottom = list.scrollHeight - list.scrollTop - list.clientHeight;
    isUserScrolledRef.current = distanceToBottom > 100;
  };

  // Scroll inicial al cargar y cuando llegan nuevos mensajes (si no está scrolleando)
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    // Si es la primera carga, scroll automático
    if (prevMessagesLengthRef.current === 0 && messages.length > 0) {
      scrollBottom(false);
      isUserScrolledRef.current = false;
    } 
    // Si llegaron nuevos mensajes y no está scrolleando
    else if (messages.length > prevMessagesLengthRef.current && !isUserScrolledRef.current) {
      scrollBottom(true);
    }
    
    prevMessagesLengthRef.current = messages.length;
  }, [messages.length]);

  return (
    <ul className="list-message" ref={listRef} onScroll={handleScroll}>
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
      {typingUser && <TypingIndicator username={typingUser} />}
      <div ref={messageEndRef} />
    </ul>
  );
}

export default MessageList;
