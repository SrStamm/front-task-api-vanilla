import type { ReadCommentInterface } from "../../schemas";
import CommentItem from "../CommentItem";
import "./ComentList.css";

interface commentListProps {
  comments: ReadCommentInterface[];
}

function CommentList({ comments }: commentListProps) {
  if (comments.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <p style={{ color: "#666" }}>No hay comentarios en esta tarea</p>
      </div>
    );
  }

  return (
    <ul className="coment-list">
      {comments.map((c) => (
        <CommentItem key={c.comment_id} comment={c} />
      ))}
    </ul>
  );
}

export default CommentList;
