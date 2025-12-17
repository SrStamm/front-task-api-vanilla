import type { ReadMessageInterface } from "../../schemas/messageSchema";

interface MessageItemProps {
  message: ReadMessageInterface;
}

function MessageItem({ message }: MessageItemProps) {
  const dueDate = new Date(message.timestamp);
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formatedDate = dueDate.toLocaleDateString("es-ES", options);

  return (
    <>
      <p>{message.message}</p>
      <p>{formatedDate}</p>
    </>
  );
}

export default MessageItem;
