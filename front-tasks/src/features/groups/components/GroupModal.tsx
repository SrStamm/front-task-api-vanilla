import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import type { ReadGroup } from "../schemas/Group";

interface groupModalProps {
  open: boolean;
  onClose: () => void;
  group: ReadGroup;
}

function GroupViewModal({ open, onClose, group }: groupModalProps) {
  const header = <h2>{group.name}</h2>;
  const body = <h3>Body</h3>;
  const actions = <Button className="btn-sm btn-primary" text="Eliminar" />;
  return (
    <Modal
      onClose={onClose}
      showModal={open}
      modalHeader={header}
      modalBody={body}
      modalActions={actions}
    />
  );
}

export default GroupViewModal;
