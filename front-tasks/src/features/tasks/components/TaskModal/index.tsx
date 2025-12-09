import Button from "../../../../components/common/Button";
import Modal from "../../../../components/common/Modal";
import "./TaskModal.css";

import type { ReadAllTaskFromProjectInterface } from "../../schemas/Tasks";

interface TaskModalProps {
  isShow: boolean;
  task: ReadAllTaskFromProjectInterface;
  onClose?: () => void;
  onEdit?: () => void;
}

function TaskModal({ isShow, task, onClose, onEdit }: TaskModalProps) {
  const dueDate = new Date(task.date_exp);
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formatedDate = dueDate.toLocaleDateString("es-ES", options);

  const header = <h3 className="modal-title">{task.title}</h3>;
  const body = (
    <>
      <div className="task-details">
        <div className="task-details-row">
          <div className="detail-label"> Estado: </div>
          <div className="detail-value">
            <span className="task-modal-state">{task.state}</span>
          </div>
        </div>
        <div className="task-details-row">
          <div className="detail-label"> Fecha limite: </div>
          <div className="detail-value">{formatedDate}</div>
        </div>
        <div className="task-details-row">
          <div className="detail-label"> Asignado a:</div>
          <div className="detail-value">
            {task.asigned.length === 0
              ? "Sin asignar"
              : task.asigned.map((u) => <span>{u.username}</span>)}
          </div>
        </div>
      </div>
      <div className="task-description-full">
        <h4 className="modal-subtitle-left ">Descripción</h4>
        <p>
          {task.description === null || task.description === ""
            ? "No hay descripción"
            : task.description}
        </p>
      </div>

      <div className="modal-tabs">
        <button className="tab-btn active">Comentarios</button>
      </div>

      <div className="section tab-content active">
        <div className="comment-container">
          <ol className="listComments"></ol>

          <div className="form-comment">
            <input
              className="input-base"
              type="text"
              id="newComment"
              placeholder="Escribe un comentario..."
            />

            <button className="btn btn-primary btn-sm" id="addComment">
              Enviar
            </button>
          </div>
        </div>
      </div>
    </>
  );

  const actions = (
    <Button className="btn-primary" text="Editar" onClick={onEdit} />
  );

  return (
    <Modal
      showModal={isShow}
      modalHeader={header}
      modalBody={body}
      modalActions={actions}
      onClose={onClose}
      size=""
    />
  );
}

export default TaskModal;
