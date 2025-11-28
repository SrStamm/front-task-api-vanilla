import { useState } from "react";
import Button from "../../../../components/common/Button";
import Modal from "../../../../components/common/Modal";
import type { ReadProject } from "../../../projects/schemas/Project";
import UserListProject from "../../../users/component/UserListProject";
import "./ProjectModal.css";

interface projectModalProps {
  open: boolean;
  onClose: () => void;
  project: ReadProject;
}

const users = [
  { user_id: 1, username: "test", permission: "admin" },
  { user_id: 2, username: "test", permission: "admin" },
  { user_id: 3, username: "test", permission: "admin" },
  { user_id: 4, username: "test", permission: "admin" },
  { user_id: 5, username: "test", permission: "admin" },
];

function ProjectModal({ open, onClose, project }: projectModalProps) {
  const [tabSelected, setTabSelected] = useState("members");

  const header = <h2 className="modal-title">{project.title}</h2>;

  const body = (
    <>
      <div className="modal-section">
        <p className="modal-description">{project.description}</p>
      </div>

      <div className="modal-tabs">
        <button
          className={`tab-btn ${tabSelected == "tasks" ? "active" : ""}`}
          onClick={() => setTabSelected("tasks")}
        >
          Tareas
        </button>
        <button
          className={`tab-btn ${tabSelected == "members" ? "active" : ""}`}
          onClick={() => setTabSelected("members")}
        >
          Miembros
        </button>
      </div>

      <div
        className={`modal-section tab-content ${tabSelected == "tasks" ? "active" : ""}`}
      >
        <div className="modal-section-header">
          <h4 className="modal-subtitle">Tareas</h4>
          <div className="modal-section-action ">
            <Button className="btn-primary btn-vsm" text="Crear Tarea" />
          </div>
        </div>

        <ul className="task-project-list">
          <li className="task-item task-card-project">Test</li>
          <li className="task-item task-card-project">Test</li>
          <li className="task-item task-card-project">Test</li>
        </ul>
      </div>

      <div
        className={`modal-section tab-content ${tabSelected == "members" ? "active" : ""}`}
      >
        <div className="modal-section-header ">
          <h4 className="modal-subtitle">Miembros</h4>
          <Button className="btn-primary btn-vsm" text="Agregar Usuario" />
        </div>

        <UserListProject users={users} />
      </div>
    </>
  );

  const actions = (
    <>
      <Button
        className="bt-sm btn-secondary btn-sm"
        text="Editar"
        // onClick={() => onEdit(project)}
      />
      <Button
        className="btn-sm btn-error btn-sm"
        text="Eliminar"
        // onClick={() => deleteGroup(project.project_id)}
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

export default ProjectModal;
