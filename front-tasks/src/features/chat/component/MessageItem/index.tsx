import type { ReadMessageInterface } from "../../schemas/messageSchema";
import formatDate from "../../../../utils/formatedDate";
import "./MessageItem.css";

interface MessageItemProps {
  message: ReadMessageInterface;
  isUser: boolean;
}

function MessageItem({ message, isUser }: MessageItemProps) {
  const formatedDate = formatDate(message.timestamp);
  const initials = message.username.charAt(0).toUpperCase();

  return (
    <li className={`message-card ${isUser ? "active" : ""}`}>
      <div className="message-avatar">{initials}</div>
      <div className="message-details">
        <div className="message-info">
          <p className="message-content">{message.message}</p>
        </div>
        <div className="message-meta">
          <p>{message.username}</p>
          <p className="message-date">{formatedDate}</p>
        </div>
      </div>
    </li>
  );
}

export default MessageItem;
