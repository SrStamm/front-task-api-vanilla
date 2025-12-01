import { useState } from "react";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import type { ReadGroup } from "../schemas/Group";
import "./GroupModal.css";
import UserListGroup from "../../users/component/UserListGroup";

interface groupModalProps {
  open: boolean;
  onClose: () => void;
  group: ReadGroup;
  deleteGroup: (group_id: number) => void;
  onEdit: (group: ReadGroup) => void;
  onAddUser: () => void;
  onCreateProject: () => void;
}

function GroupViewModal({
  open,
  onClose,
  group,
  deleteGroup,
  onEdit,
  onAddUser,
  onCreateProject,
}: groupModalProps) {
  const [tabSelected, setTabSelected] = useState("projects");

  const header = <h2 className="modal-title">{group.name}</h2>;

  const body = (
    <>
      <div className="modal-section">
        <p className="modal-description"> </p>
      </div>

      <div className="modal-tabs">
        <button
          className={`tab-btn ${tabSelected == "projects" ? "active" : ""}`}
          onClick={() => setTabSelected("projects")}
        >
          Proyectos
        </button>
        <button
          className={`tab-btn ${tabSelected == "members" ? "active" : ""}`}
          onClick={() => setTabSelected("members")}
        >
          Miembros
        </button>
      </div>

      <div
        className={`modal-section tab-content ${tabSelected == "projects" ? "active" : ""}`}
      >
        <div className="modal-section-header">
          <h4 className="modal-subtitle">Proyectos</h4>
          <Button
            className="btn-primary btn-vsm"
            text="Crear Proyecto"
            onClick={onCreateProject}
          />
        </div>
        <ol className="listProject">
          <li className="project-item">Test</li>
          <li className="project-item">Test</li>
          <li className="project-item">Test</li>
        </ol>
      </div>

      <div
        className={`modal-section tab-content ${tabSelected == "members" ? "active" : ""}`}
      >
        <div className="modal-section-header ">
          <h4 className="modal-subtitle">Miembros</h4>
          <Button
            className="btn-primary btn-vsm"
            text="Agregar Usuario"
            onClick={onAddUser}
          />
        </div>

        <UserListGroup users={group.users} addUser={false} />
      </div>
    </>
  );

  const actions = (
    <>
      <Button
        className="bt-sm btn-secondary btn-sm"
        text="Editar"
        onClick={() => onEdit(group)}
      />
      <Button
        className="btn-sm btn-error btn-sm"
        text="Eliminar"
        onClick={() => deleteGroup(group.group_id)}
      />
    </>
  );

  return (
    <Modal
      onClose={onClose}
      showModal={open}
      size="large"
      modalHeader={header}
      modalBody={body}
      modalActions={actions}
    />
  );
}

export default GroupViewModal;
