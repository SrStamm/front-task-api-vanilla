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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!message.trim()) return;

    setIsSubmitting(true);

    try {
      await onSubmit({ content: message });
      setMessage("");
    } catch {
      // Toast se encarga del error global
    } finally {
      setIsSubmitting(false);
    }
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

      <Button
        className="btn btn-primary btn-sm"
        text="Enviar"
        type="submit"
        disabled={isSubmitting || !message.trim()}
      />
    </form>
  );
}

export default CommentForm;
