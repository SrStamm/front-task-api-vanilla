import ErrorContainer from "../../../../components/common/ErrorContainer";
import { getApiErrorMessage } from "../../../../utils/errors";
import { useComment } from "../../useComment";
import CommentForm from "../CommentForm";
import CommentList from "../CommentList";

interface CommentContainerProps {
  taskId: number;
}

function CommentContainer({ taskId }: CommentContainerProps) {
  const { loadCommentFromTask, commentInTask, error, isLoading, create } =
    useComment(taskId);

  if (isLoading) return <p style={{ textAlign: "center" }}>Cargando...</p>;

  if (error) {
    return (
      <ErrorContainer
        advice="Error al cargar los comentarios"
        recommendation={getApiErrorMessage(error)}
        isButton={true}
        isError={true}
        onRetry={loadCommentFromTask}
      />
    );
  }

  return (
    <div className="modal-section">
      <CommentList comments={commentInTask} />
      <CommentForm onSubmit={create.mutateAsync} />
    </div>
  );
}

export default CommentContainer;
