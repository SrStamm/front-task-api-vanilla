import type { ReadCommentInterface } from "../../schemas";
import formatDate from "../../../../utils/formatedDate";
import "./CommentItem.css";

interface commentItemProps {
  comment: ReadCommentInterface;
}

function CommentItem({ comment }: commentItemProps) {
  const formatedDate = formatDate(comment.created_at);

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
