import Modal from "../../../../components/common/Modal";
import "./TaskModal.css";

import type { ReadAllTaskFromProjectInterface } from "../../schemas/Tasks";
import CommentContainer from "../../../comments/component/CommentContainer";
import formatDate from "../../../../utils/formatedDate";
import { useGroupProject } from "../../../../hooks/useGroupProject";
import KebabMenu from "../../../../components/common/KebabMenu";
import TaskStateBadge from "../TaskStateBadge";

interface TaskModalProps {
  isShow: boolean;
  task: ReadAllTaskFromProjectInterface;
  onClose?: () => void;
  onEdit: (t: ReadAllTaskFromProjectInterface) => void;
  onDelete: (t: ReadAllTaskFromProjectInterface) => void;
}

function TaskModal({
  isShow,
  task,
  onClose,
  onEdit,
  onDelete,
}: TaskModalProps) {
  const formatedDate = formatDate(task.date_exp);
  const { permission } = useGroupProject();

  const header = (
    <div className="modal-header-row">
      <h3 className="modal-title">{task.title}</h3>
      {permission === "write" ? (
        <KebabMenu
          items={[
            {
              label: "Editar",
              onClick: () => {
                onEdit(task);
              },
            },
          ]}
        />
      ) : permission === "admin" ? (
        <KebabMenu
          items={[
            {
              label: "Editar",
              onClick: () => {
                onEdit(task);
              },
            },
            {
              label: "Eliminar",
              danger: true,
              onClick: () => {
                onDelete(task);
              },
            },
          ]}
        />
      ) : (
        ""
      )}
    </div>
  );

  const body = (
    <>
      <div className="task-details">
        <div className="task-details-row">
          <div className="detail-label"> Estado: </div>
          <div className="detail-value">
            <TaskStateBadge state={task.state} />
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

  return (
    <Modal
      showModal={isShow}
      modalHeader={header}
      modalBody={body}
      onClose={onClose}
      size=""
    />
  );
}

export default TaskModal;
