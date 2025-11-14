import type React from "react";
import "./Modal.css";

interface ModalProps {
  showModal: boolean;
  modalHeader: React.ReactNode;
  modalBody: React.ReactNode;
  modalActions: React.ReactNode;
  onClose?: () => void;
}

function Modal({
  showModal,
  modalHeader,
  modalBody,
  modalActions,
  onClose,
}: ModalProps) {
  return (
    <div
      className={`modal-backdrop ${showModal ? "show" : ""}`}
      onClick={onClose}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header"> {modalHeader} </header>
        <main className="modal-body">{modalBody}</main>
        <footer className="modal-footer">
          <div className="modal-actions">{modalActions}</div>
        </footer>
      </div>
    </div>
  );
}

export default Modal;
