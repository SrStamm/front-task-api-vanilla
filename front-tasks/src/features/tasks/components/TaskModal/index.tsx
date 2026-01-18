import Button from "../../../../components/common/Button";
import Modal from "../../../../components/common/Modal";
import "./TaskModal.css";

import type { ReadAllTaskFromProjectInterface } from "../../schemas/Tasks";
import CommentContainer from "../../../comments/component/CommentContainer";
import formatDate from "../../../../utils/formatedDate";
import { useGroupProject } from "../../../../hooks/useGroupProject";

interface TaskModalProps {
  isShow: boolean;
  task: ReadAllTaskFromProjectInterface;
  onClose?: () => void;
  onEdit: (t: ReadAllTaskFromProjectInterface) => void;
}

function TaskModal({ isShow, task, onClose, onEdit }: TaskModalProps) {
  const formatedDate = formatDate(task.date_exp);
  const { permission } = useGroupProject();

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
            {task.assigned_user ? (
              <p>{task.assigned_user.username}</p>
            ) : (
              "Sin asignar"
            )}
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
          <CommentContainer taskId={task.task_id} />
        </div>
      </div>
    </>
  );

  const actions =
    permission === "admin" || permission === "write" ? (
      <Button
        className="btn-primary"
        text="Editar"
        onClick={() => onEdit(task)}
      />
    ) : (
      ""
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
