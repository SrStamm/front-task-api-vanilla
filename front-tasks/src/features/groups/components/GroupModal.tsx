import { useState } from "react";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import type { ReadGroup } from "../schemas/Group";

interface groupModalProps {
  open: boolean;
  onClose: () => void;
  group: ReadGroup;
}

function GroupViewModal({ open, onClose, group }: groupModalProps) {
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
          <Button className="btn-primary btn-vsm" text="Crear Proyecto" />
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
          <Button className="btn-primary btn-vsm" text="Agregar Usuario" />
        </div>
        <ol className="listUser">
          <li>Test</li>
          <li>Test</li>
          <li>Test</li>
        </ol>
      </div>
    </>
  );

  const actions = (
    <>
      <Button className="bt-sm btn-secondary btn-sm" text="Editar" />
      <Button className="btn-sm btn-error btn-sm" text="Eliminar" />
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
