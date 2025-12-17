import { useState } from "react";
import type {
  CreateCommentInterface,
  ReadCommentInterface,
} from "../../schemas";
import Button from "../../../../components/common/Button";
import "./CommentForm.css";

interface CommentFormProps {
  onSubmit: (payload: CreateCommentInterface) => Promise<ReadCommentInterface>;
}

function CommentForm({ onSubmit }: CommentFormProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;

    await onSubmit({ content: message });
    setMessage("");
  };

  return (
    <form className="form-comment" onSubmit={handleSubmit}>
      <input
        className="input-base"
        type="text"
        value={message}
        placeholder="Escribe un comentario..."
        onChange={(e) => setMessage(e.target.value)}
      />

      <Button className="btn btn-primary btn-sm" text="Enviar" type="submit" />
    </form>
  );
}

export default CommentForm;
