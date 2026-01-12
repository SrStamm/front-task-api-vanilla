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
      <div className="comment-header">
        <p className="comment-username">{comment.username}</p>
      </div>
      <div className="comment-info">
        <p className="comment-content">{comment.content}</p>
      </div>
      <div className="comment-meta">
        <p className="comment-date"> {formatedDate}</p>
      </div>
    </li>
  );
}

export default CommentItem;
