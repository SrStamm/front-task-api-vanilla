import { useState } from "react";
import Button from "../../../../components/common/Button";
import "./MessageForm.css";

interface MessageFormProps {
  onSend: (content: string) => void;
  isConnected: boolean;
}

function MessageForm({ onSend, isConnected }: MessageFormProps) {
  const [message, setMessage] = useState("");

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSend(message);
  };

  return (
    <form id="form-message" className="form-message" onSubmit={handleSend}>
      <input
        type="text"
        name="newMessage"
        className="input-base"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        type="submit"
        className="btn btn-sm"
        text="Enviar"
        form="form-message"
      />
    </form>
  );
}

export default MessageForm;
