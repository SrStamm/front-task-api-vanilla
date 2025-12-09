import { useEffect, useState } from "react";
import Button from "../../../../components/common/Button";
import Modal from "../../../../components/common/Modal";
import UserList from "../../../users/component/UserList";
import { useGroupProject } from "../../../../hooks/useGroupProject";
import { useProjects } from "../../../projects/hooks/useProject";
import type { ReadUser } from "../../../../types/User.ts";
import type { CreateTask } from "../../../../types/Task.ts";
import "./CreateTaskModal.css";

interface CreateTaskModalProps {
  showModal: boolean;
  onClose: () => void;
  onCreate: (payload: CreateTask) => Promise<void>;
  onSuccess: () => void;
}

function CreateTaskModal({
  showModal,
  onClose,
  onCreate,
  onSuccess,
}: CreateTaskModalProps) {
  const [usersSelected, setUsersSelected] = useState<ReadUser[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [userIds, setUserIds] = useState<number[]>([]);
  const { projects } = useProjects();
  const { projectId } = useGroupProject();

  useEffect(() => {
    if (projectId && projects) {
      const project = projects.find((p) => p.project_id == projectId);

      setUsersSelected(project ? project.users : []);
    }
  }, [projectId, projects]);

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const onDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
  };

  const handleUserSelect = (userId: number) => {
    setUserIds((prevUserIds) => [...prevUserIds, userId]);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateTask = {
      project_id: projectId,
      title: title,
      description: description,
      user_ids: userIds,
      date_exp: dueDate,
    };

    await onCreate(payload);

    onSuccess();
    onClose();
  };

  const header = <h2>Crear una nueva tarea</h2>;

  const body = (
    <form id="create-task-form" onSubmit={handleCreateTask}>
      <label>Titulo:</label>
      <input type="text" className="input-base" onChange={onTitleChange} />

      <label>Descripción:</label>
      <textarea
        rows={3}
        cols={3}
        className="input-base small-textarea"
        onChange={onDescriptionChange}
      ></textarea>

      <label>Fecha de vencimiento:</label>
      <input
        type="date"
        className="input-base"
        onChange={onDueDateChange}
        required
      />

      <div className="user-selection-container">
        <label> Asignar a usuarios: </label>
        <ul>
          <UserList users={usersSelected} onAdd={handleUserSelect} />
        </ul>
      </div>
    </form>
  );

  const actions = (
    <>
      <Button
        className="btn-primary btn-sm"
        text="Confirmar"
        type="submit"
        form="create-task-form"
      />
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
