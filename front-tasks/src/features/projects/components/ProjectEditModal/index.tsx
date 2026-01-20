import React, { useEffect, useState } from "react";
import Button from "../../../../components/common/Button";
import Modal from "../../../../components/common/Modal";
import type {
  CreateProject,
  ReadProject,
  UpdateProject,
} from "../../schemas/Project";
import { useGroupProject } from "../../../../hooks/useGroupProject";

interface projectModalProps {
  type: string;
  open: boolean;
  onClose: () => void;
  project?: ReadProject;
  onCreate: (newProject: CreateProject) => void;
  onUpdate: (project: UpdateProject) => void;
  groupIdCharged?: number;
}

function ProjectCreateUpdateModal({
  type,
  open,
  onClose,
  project,
  groupIdCharged,
  onCreate,
  onUpdate,
}: projectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [groupId, setGroupId] = useState(0);
  const [projectId, setProjectId] = useState(0);

  const { groupId: selectedGroupId } = useGroupProject();

  useEffect(() => {
    if (type === "update" && project) {
      setTitle(project.title);
      setDescription(project.description ?? "");
      setGroupId(project.group_id);
      setProjectId(project.project_id);
    }

    if (type === "create") {
      setTitle("");
      setDescription("");
      groupIdCharged ? setGroupId(groupIdCharged) : setGroupId(selectedGroupId);
    }
  }, [type, project, open, selectedGroupId, groupIdCharged]);

  const titleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);

  const descriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setDescription(e.target.value);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newProject: CreateProject = {
      title: title,
      description: description,
      group_id: groupId,
    };

    onCreate(newProject);

    onClose();
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const editGroup: UpdateProject = {
      group_id: groupId,
      project_id: projectId,
      title: title,
      description: description,
    };

    onUpdate(editGroup);

    onClose();
  };

  const header =
    type == "create" ? (
      <h2 className="modal-title">Crear un nuevo proyecto</h2>
    ) : (
      <h2 className="modal-title">Editar Proyecto</h2>
    );

  const body =
    type == "create" ? (
      <>
        <form id="create-project-form" onSubmit={handleCreate}>
          <label>Nombre del proyecto:</label>
          <input
            type="text"
            className="input-base"
            value={title}
            onChange={titleChange}
          />
          <label>Descripción:</label>
          <textarea
            rows={3}
            cols={3}
            className="input-base small-textarea"
            value={description}
            onChange={descriptionChange}
          ></textarea>
        </form>
      </>
    ) : (
      <>
        <form id="edit-project-form" onSubmit={handleUpdate}>
          <label>Nombre del proyecto:</label>
          <input
            type="text"
            className="input-base"
            value={title}
            onChange={titleChange}
          />
          <label>Descripción:</label>
          <textarea
            rows={3}
            cols={3}
            className="input-base small-textarea"
            value={description}
            onChange={descriptionChange}
          ></textarea>
        </form>
      </>
    );

  const actions = (
    <>
      <Button
        className="bt-sm btn-outline-error btn-sm"
        text="Cancelar"
        onClick={onClose}
      />
      {type == "create" ? (
        <Button
          className="btn-sm btn-primary btn-sm"
          text="Crear"
          type="submit"
          form="create-project-form"
        />
      ) : (
        <Button
          className="btn-sm btn-primary btn-sm"
          text="Editar"
          type="submit"
          form="edit-project-form"
        />
      )}
    </>
  );

  return (
    <Modal
      onClose={onClose}
      showModal={open}
      size="med"
      modalHeader={header}
      modalBody={body}
      modalActions={actions}
    />
  );
}

export default ProjectCreateUpdateModal;
