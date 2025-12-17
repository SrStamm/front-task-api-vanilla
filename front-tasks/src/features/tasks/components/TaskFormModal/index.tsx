import { useEffect, useState } from "react";
import { useGroupProject } from "../../../../hooks/useGroupProject";
import { useProjects } from "../../../projects/hooks/useProject";
import Button from "../../../../components/common/Button";
import Modal from "../../../../components/common/Modal";
import UserList from "../../../users/component/UserList";
import type { ReadUser } from "../../../../types/User.ts";
import type { CreateTask, UpdateTask } from "../../../../types/Task.ts";
import type {
  ReadAllTaskFromProjectInterface,
  TaskStateEnum,
} from "../../schemas/Tasks.ts";
import "./TaskFormModal.css";

interface TaskFormModalProps {
  showModal: boolean;
  mode: "create" | "edit";
  initialData?: ReadAllTaskFromProjectInterface;
  onClose: () => void;
  onCreate: (data: CreateTask) => Promise<void>;
  onUpdate: (data: UpdateTask) => Promise<void>;
  isCreating?: boolean;
  isUpdating?: boolean;
  onSuccess: () => void;
}

function TaskFormModal({
  showModal,
  mode,
  initialData,
  onClose,
  onCreate,
  onUpdate,
  isCreating = false,
  isUpdating = false,
  onSuccess,
}: TaskFormModalProps) {
  const [usersSelected, setUsersSelected] = useState<ReadUser[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>();
  const [userIds, setUserIds] = useState<number[]>([]);
  const [selectedStatus, setSelectedStatus] =
    useState<TaskStateEnum>("sin empezar");
  const { projects } = useProjects();
  const { projectId } = useGroupProject();

  useEffect(() => {
    if (projectId && projects) {
      const project = projects.find((p) => p.project_id == projectId);
      setUsersSelected(project ? project.users : []);
    }

    if (mode === "edit" && initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      const datePart = initialData.date_exp?.substring(0, 10) || "";
      setDueDate(datePart);
      setUserIds(initialData.user_ids || []);
      setSelectedStatus(initialData.state || "sin empezar");
    } else {
      setTitle("");
      setDescription("");
      setDueDate("");
      setUserIds([]);
    }
  }, [projectId, projects, mode, initialData, showModal]);

  // Al cambiar algún dato de la tarea, se edita
  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const onDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
  };

  const onStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  const handleUserSelect = (userId: number) => {
    setUserIds((prevUserIds) =>
      prevUserIds.includes(userId)
        ? prevUserIds.filter((id) => id !== userId) // Toggle
        : [...prevUserIds, userId],
    );
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectId) {
      alert("No se ha podido obtener el proyecto.");
      return;
    }

    const payload: CreateTask = {
      project_id: projectId,
      title: title,
      description: description,
      user_ids: userIds,
      date_exp: dueDate,
    };

    if (onCreate) {
      try {
        await onCreate(payload);
        onSuccess();
        onClose();
      } catch (error) {
        console.error("Error al crear la tarea:", error);
      }
    }
  };

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectId || !initialData) {
      return;
    }

    const payload: UpdateTask = {
      project_id: projectId,
      task_id: initialData!.task_id,
      title: title,
      description: description,
      date_exp: dueDate,
      state: selectedStatus,
    };

    if (onUpdate) {
      try {
        await onUpdate(payload);
        onSuccess();
        onClose();
      } catch (error) {
        console.error("Error al actualizar la tarea:", error);
      }
    }
  };

  const isSubmitDisabled =
    mode === "create"
      ? isCreating || !title.trim()
      : isUpdating || !title.trim();

  const header =
    mode == "create" ? <h2>Crear una nueva tarea</h2> : <h2>Editar tarea</h2>;

  const body = (
    <form
      id={mode === "create" ? "create-task-form" : "edit-task-form"}
      onSubmit={mode === "create" ? handleCreateTask : handleEditTask}
    >
      <div>
        <label>Titulo:</label>
        <input
          type="text"
          className="input-base"
          value={title}
          onChange={onTitleChange}
          disabled={mode === "create" ? isCreating : isUpdating}
        />
      </div>

      <div>
        <label>Descripción:</label>
        <textarea
          rows={3}
          cols={3}
          className="input-base small-textarea"
          onChange={onDescriptionChange}
          value={description}
          disabled={mode === "create" ? isCreating : isUpdating}
        ></textarea>
      </div>

      <div>
        <label>Fecha de vencimiento:</label>
        <input
          type="date"
          className="input-base"
          onChange={onDueDateChange}
          value={dueDate}
          disabled={mode === "create" ? isCreating : isUpdating}
          required
        />
      </div>

      {mode === "edit" ? (
        <div className="">
          <label>Estado:</label>
          <select
            className="input-base status-select"
            value={selectedStatus}
            onChange={onStatusChange}
          >
            <option value="sin empezar">To Do</option>
            <option value="en proceso">In progress</option>
            <option value="completado">Completed</option>
          </select>
        </div>
      ) : (
        ""
      )}

      <div className="user-selection-container">
        <label>Asignar a usuarios:</label>
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
        text={
          mode === "create"
            ? isCreating
              ? "Creando..."
              : "Confirmar"
            : isUpdating
              ? "Actualizando..."
              : "Confirmar"
        }
        type="submit"
        form={mode === "create" ? "create-task-form" : "edit-task-form"}
        disabled={isSubmitDisabled}
        loading={mode === "create" ? isCreating : isUpdating}
      />
      <Button
        className="btn-error btn-sm"
        text="Cancelar"
        onClick={onClose}
        disabled={mode === "create" ? isCreating : isUpdating}
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
