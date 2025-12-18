import type { ReadMessageInterface } from "../../schemas/messageSchema";
import "./MessageItem.css";

interface MessageItemProps {
  message: ReadMessageInterface;
}

function MessageItem({ message }: MessageItemProps) {
  const dueDate = new Date(message.timestamp);
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formatedDate = dueDate.toLocaleDateString("es-ES", options);

  return (
    <li className="message-card">
      <div className="message-details">
        <div className="message-info">
          <p className="message-content">{message.message}</p>
        </div>
        <div className="message-meta">
          <p className="message-date">{formatedDate}</p>
        </div>
      </div>
    </li>
  );
}

export default MessageItem;
