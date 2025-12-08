import type React from "react";
import "./Modal.css";
import { useCallback, useEffect, useRef } from "react";

interface ModalProps {
  showModal: boolean;
  modalHeader: React.ReactNode;
  modalBody: React.ReactNode;
  modalActions: React.ReactNode;
  onClose?: () => void;
  size: string;
}

function Modal({
  showModal,
  modalHeader,
  modalBody,
  modalActions,
  onClose,
  size,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        onClose
      ) {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className={`modal-backdrop ${showModal ? "show" : "hidden"}`}>
      <div className={`modal ${size}`} ref={modalRef}>
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
