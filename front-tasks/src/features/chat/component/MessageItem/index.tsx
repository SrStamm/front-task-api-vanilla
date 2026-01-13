import type { ReadMessageInterface } from "../../schemas/messageSchema";
import formatDate from "../../../../utils/formatedDate";
import "./MessageItem.css";

interface MessageItemProps {
  message: ReadMessageInterface;
}

function MessageItem({ message }: MessageItemProps) {
  const formatedDate = formatDate(message.timestamp);

  return (
    <li className="message-card">
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
