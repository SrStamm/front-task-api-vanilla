import { useComment } from "../../useComment";
import CommentForm from "../CommentForm";
import CommentList from "../CommentList";

interface CommentContainerProps {
  taskId: number;
}

function CommentContainer({ taskId }: CommentContainerProps) {
  const { commentInTask, error, isLoading, create } = useComment(taskId);

  if (isLoading) return <p style={{ textAlign: "center" }}>Cargando...</p>;

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "red" }}>Error al cargar los comentarios</p>
        <button
          onClick={() => window.location.reload()}
          style={{ marginTop: "1rem" }}
        >
          Reintentar
        </button>
      </div>
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
