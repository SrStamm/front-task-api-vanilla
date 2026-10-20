import type React from "react";
import "./Modal.css";
import { useCallback, useEffect, useId, useRef } from "react";

interface ModalProps {
  showModal: boolean;
  modalHeader: React.ReactNode;
  modalBody: React.ReactNode;
  modalActions?: React.ReactNode;
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
  const titleId = useId();

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
    if (!showModal) return;

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal, handleClickOutside]);

  useEffect(() => {
    if (!showModal) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    modalRef.current?.focus();

    return () => {
      previouslyFocused?.focus?.();
    };
  }, [showModal]);

  return (
    <div className={`modal-backdrop ${showModal ? "show" : "hidden"}`}>
      <div
        className={`modal ${size}`}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header className="modal-header" id={titleId}> {modalHeader} </header>
        <main className="modal-body">{modalBody}</main>
        {modalActions !== undefined && modalActions !== null && (
          <footer className="modal-footer">
            <div className="modal-actions">{modalActions}</div>
          </footer>
        )}
      </div>
    </div>
  );
}

export default Modal;
