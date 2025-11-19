import React, { useState } from "react";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import "./GroupModal.css";
import type { CreateGroupInterface } from "../schemas/Group";

interface groupModalProps {
  open: boolean;
  onClose: () => void;
  createGroup: (payload: CreateGroupInterface) => Promise<any>;
}

function GroupCreateModal({ open, onClose, createGroup }: groupModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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

  const header = <h2 className="modal-title">Crear un nuevo grupo"</h2>;

  const body = (
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
  );

  const actions = (
    <>
      <Button
        className="bt-sm btn-outline-error btn-sm"
        text="Cancelar"
        onClick={onClose}
      />
      <Button
        className="btn-sm btn-primary btn-sm"
        text="Crear"
        type="submit"
        form="create-group-form"
      />
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

export default GroupCreateModal;
