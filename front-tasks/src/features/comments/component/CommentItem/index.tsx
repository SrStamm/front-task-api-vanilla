import type { ReadCommentInterface } from "../../schemas";

interface commentItemProps {
  comment: ReadCommentInterface;
}

function CommentItem({ comment }: commentItemProps) {
  const dueDate = new Date(comment.created_at);
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formatedDate = dueDate.toLocaleDateString("es-ES", options);

  return (
    <li className="comment-details ">
      <div className="comment-info">
        <h3 className="comment-content">{comment.content}</h3>
      </div>
      <div className="comment-meta">
        <p className="comment-date"> {formatedDate}</p>
      </div>
    </li>
  );
}

export default CommentItem;
