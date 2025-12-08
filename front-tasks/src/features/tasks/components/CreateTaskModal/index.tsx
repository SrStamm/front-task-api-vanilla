import { useEffect, useState } from "react";
import Button from "../../../../components/common/Button";
import Modal from "../../../../components/common/Modal";
import { useGroupProject } from "../../../../hooks/useGroupProject";
import { useProjects } from "../../../projects/hooks/useProject";
import UserList from "../../../users/component/UserList";
import type { ReadUser } from "../../../../types/User.ts";
import "./CreateTaskModal.css";

interface CreateTaskModalProps {
  showModal: boolean;
  onClose: () => void;
}

function CreateTaskModal({ showModal, onClose }: CreateTaskModalProps) {
  const [usersSelected, setUsersSelected] = useState<ReadUser[]>([]);
  const { projects } = useProjects();
  const { projectId } = useGroupProject();

  useEffect(() => {
    if (projectId && projects) {
      const project = projects.find((p) => p.project_id == projectId);

      setUsersSelected(project ? project.users : []);
    }
  }, [projectId, projects]);

  const header = <h2>Crear una nueva tarea</h2>;

  const body = (
    <form id="create-task-form">
      <label>Titulo:</label>
      <input type="text" className="input-base" />

      <label>Descripción:</label>
      <textarea
        rows={3}
        cols={3}
        className="input-base small-textarea"
      ></textarea>

      <label>Fecha de vencimiento:</label>
      <input type="date" className="input-base" required />

      <div className="user-selection-container">
        <label> Asignar a usuarios: </label>
        <ul>
          <UserList users={usersSelected} onAdd={() => console.log("hola")} />
        </ul>
      </div>
    </form>
  );

  const actions = (
    <>
      <Button className="btn-primary btn-sm" text="Confirmar" />
      <Button className="btn-error btn-sm" text="Cancelar" onClick={onClose} />
    </>
  );

  return (
    <Modal
      showModal={showModal}
      size="large"
      modalHeader={header}
      modalBody={body}
      modalActions={actions}
      onClose={onClose}
    />
  );
}

export default CreateTaskModal;
