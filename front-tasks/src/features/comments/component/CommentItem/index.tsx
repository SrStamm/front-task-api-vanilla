import type { ReadCommentInterface } from "../../schemas";
import formatDate from "../../../../utils/formatedDate";
import "./CommentItem.css";

interface commentItemProps {
  comment: ReadCommentInterface;
}

function CommentItem({ comment }: commentItemProps) {
  const dueDate = new Date(comment.created_at);
  const formatedDate = formatDate(dueDate);

  return (
    <li className="comment-details">
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
