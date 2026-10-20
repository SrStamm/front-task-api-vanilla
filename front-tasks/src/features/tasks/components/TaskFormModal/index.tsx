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
import { TYPE_OF_LABELS } from "../../constants/labels.ts";

interface TaskFormModalProps {
  showModal: boolean;
  mode: "create" | "edit";
  initialData?: ReadAllTaskFromProjectInterface;
  onClose: () => void;
  onCreate: (data: CreateTask) => Promise<void>;
  onUpdate: (data: UpdateTask) => Promise<void>;
  isCreating?: boolean;
  isUpdating?: boolean;
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
}: TaskFormModalProps) {
  const [usersSelected, setUsersSelected] = useState<ReadUser[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [userIdSelected, setUserIdSelected] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] =
    useState<TaskStateEnum>("sin empezar");
  const [label, setLabel] = useState<string>("");
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
      const datePart = initialData.date_exp
        ? new Date(initialData.date_exp).toISOString().substring(0, 10)
        : "";
      setDueDate(datePart);
      setUserIdSelected(
        initialData.assigned_user ? initialData.assigned_user.user_id : null,
      );
      setSelectedStatus(initialData.state || "sin empezar");
      setLabel(initialData.task_label_links?.[0]?.label ?? "");
    } else {
      setTitle("");
      setDescription("");
      setDueDate("");
      setUserIdSelected(null);
      setLabel("");
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
    setSelectedStatus(e.target.value as TaskStateEnum);
  };

  const handleUserSelect = (userId: number) => {
    setUserIdSelected(userId);
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
      assigned_user_id: userIdSelected,
      date_exp: dueDate.trim().length === 0 ? null : dueDate,
      label: label ? [label] : [],
    };

    if (onCreate) {
      try {
        await onCreate(payload);
        onClose();
      } catch {
        //
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
      date_exp: dueDate.trim().length === 0 ? null : dueDate,
      state: selectedStatus,
      assigned_user_id: userIdSelected,
    };

    const currentLabel = initialData.task_label_links?.[0]?.label ?? "";
    if (label && label !== currentLabel) {
      payload.append_label = [label];
      if (currentLabel) payload.remove_label = [currentLabel];
    } else if (!label && currentLabel) {
      payload.remove_label = [currentLabel];
    }

    if (onUpdate) {
      try {
        await onUpdate(payload);
        onClose();
      } catch {
        //
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
        />
      </div>

      <div>
        <label>Labels:</label>
        <select
          className="input-base select-filter"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        >
          <option value="">Sin label</option>
          {TYPE_OF_LABELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
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
          <UserList
            users={usersSelected}
            onAdd={handleUserSelect}
            userIdAssigned={userIdSelected ?? undefined}
            text="Asignar"
            textAssigned="Asignado"
          />
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
