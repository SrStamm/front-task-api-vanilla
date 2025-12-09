import { useEffect, useState } from "react";
import { useGroupProject } from "../../../../hooks/useGroupProject";
import { useProjects } from "../../../projects/hooks/useProject";
import Button from "../../../../components/common/Button";
import Modal from "../../../../components/common/Modal";
import UserList from "../../../users/component/UserList";
import type { ReadUser } from "../../../../types/User.ts";
import type { CreateTask } from "../../../../types/Task.ts";
import type { ReadAllTaskFromProjectInterface } from "../../schemas/Tasks.ts";
import "./TaskFormModal.css";

interface TaskFormModalProps {
  showModal: boolean;
  mode: "create" | "edit";
  initialData?: ReadAllTaskFromProjectInterface;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  onSuccess: () => void;
}

function TaskFormModal({
  showModal,
  mode,
  initialData,
  onClose,
  onSubmit,
  onSuccess,
}: TaskFormModalProps) {
  const [usersSelected, setUsersSelected] = useState<ReadUser[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>();
  const [userIds, setUserIds] = useState<number[]>([]);
  const { projects } = useProjects();
  const { projectId } = useGroupProject();

  useEffect(() => {
    if (projectId && projects) {
      const project = projects.find((p) => p.project_id == projectId);

      setUsersSelected(project ? project.users : []);
    }

    if (mode === "edit" && initialData) {
      console.log("Initial Data:", initialData);
      setTitle(initialData.title);
      setDescription(initialData.description);
      const datePart = initialData.date_exp.substring(0, 10);
      setDueDate(datePart);
    }
  }, [projectId, projects, mode, initialData]);

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

    await onSubmit(payload);

    onSuccess();
    onClose();
  };

  const header =
    mode == "create" ? <h2>Crear una nueva tarea</h2> : <h2>Editar tarea</h2>;

  const body =
    mode === "create" ? (
      <form id="create-task-form" onSubmit={handleCreateTask}>
        <label>Titulo:</label>
        <input
          type="text"
          className="input-base"
          value={title}
          onChange={onTitleChange}
        />

        <label>Descripción:</label>
        <textarea
          rows={3}
          cols={3}
          className="input-base small-textarea"
          onChange={onDescriptionChange}
          value={description}
        ></textarea>

        <label>Fecha de vencimiento:</label>
        <input
          type="date"
          className="input-base"
          onChange={onDueDateChange}
          value={dueDate}
          required
        />

        <div className="user-selection-container">
          <label> Asignar a usuarios: </label>
          <ul>
            <UserList users={usersSelected} onAdd={handleUserSelect} />
          </ul>
        </div>
      </form>
    ) : (
      <form id="edit-task-form">
        <label>Titulo:</label>
        <input
          type="text"
          className="input-base"
          onChange={onTitleChange}
          value={title}
        />

        <label>Descripción:</label>
        <textarea
          rows={3}
          cols={3}
          className="input-base small-textarea"
          value={description}
          onChange={onDescriptionChange}
        ></textarea>

        <label>Fecha de vencimiento:</label>
        <input
          type="date"
          className="input-base"
          onChange={onDueDateChange}
          value={dueDate}
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

  const actions =
    mode === "create" ? (
      <>
        <Button
          className="btn-primary btn-sm"
          text="Confirmar"
          type="submit"
          form="create-task-form"
        />
        <Button
          className="btn-error btn-sm"
          text="Cancelar"
          onClick={onClose}
        />
      </>
    ) : (
      <>
        <Button
          className="btn-primary btn-sm"
          text="Confirmar"
          type="submit"
          form="create-task-form"
        />
        <Button
          className="btn-error btn-sm"
          text="Cancelar"
          onClick={onClose}
        />
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

export default TaskFormModal;
