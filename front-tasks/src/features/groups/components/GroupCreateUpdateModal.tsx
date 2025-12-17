import React, { useEffect, useState } from "react";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import "./GroupModal.css";
import type {
  CreateGroupInterface,
  ReadGroup,
  UpdateGroupInterface,
} from "../schemas/Group";

interface groupModalProps {
  type: string;
  open: boolean;
  onClose: () => void;
  group?: ReadGroup;
  createGroup: (payload: CreateGroupInterface) => Promise<any>;
  editGroupEvent: (id: number, payload: UpdateGroupInterface) => Promise<any>;
}

function GroupCreateUpdateModal({
  type,
  open,
  onClose,
  group,
  createGroup,
  editGroupEvent,
}: groupModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [groupId, setGroupId] = useState(0);

  useEffect(() => {
    if (type === "update" && group) {
      setTitle(group.name);
      setDescription(group.description ?? "");
      setGroupId(group.group_id);
    }

    if (type === "create") {
      setTitle("");
      setDescription("");
    }
  }, [type, group, open]);

  const titleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);

  const descriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setDescription(e.target.value);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newGroup: CreateGroupInterface = {
      name: title,
      description: description,
    };

    await createGroup(newGroup);

    onClose();
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const editGroup: UpdateGroupInterface = {
      name: title,
      description: description,
    };

    await editGroupEvent(groupId, editGroup);

    onClose();
  };

  const header =
    type == "create" ? (
      <h2 className="modal-title">Crear un nuevo grupo</h2>
    ) : (
      <h2 className="modal-title">Editar grupo</h2>
    );

  const body =
    type == "create" ? (
      <>
        <form id="create-group-form" onSubmit={handleCreate}>
          <label>Nombre del grupo:</label>
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
        <form id="edit-group-form" onSubmit={handleUpdate}>
          <label>Nombre del grupo:</label>
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
          form="create-group-form"
        />
      ) : (
        <Button
          className="btn-sm btn-primary btn-sm"
          text="Editar"
          type="submit"
          form="edit-group-form"
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

export default GroupCreateUpdateModal;
