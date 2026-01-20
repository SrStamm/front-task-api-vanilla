import Button from "../../../../components/common/Button";
import Modal from "../../../../components/common/Modal";
import type { ReadUser } from "../../../../types/User";
import UserList from "../UserList";

interface userAddModalProps {
  show: boolean;
  onClose: () => void;
  users: ReadUser[];
  groupId: number;
  onAdd: (groupId: number, userId: number) => void;
}

function UserAddToGroupModal({
  show,
  onClose,
  users,
  groupId,
  onAdd,
}: userAddModalProps) {
  const handleAddUserToGroup = async (userId: number) => {
    onAdd(groupId, userId);
    onClose();
  };

  const header = <h2 className="modal-title-center">Lista de usuarios</h2>;
  const body = <UserList users={users} onAdd={handleAddUserToGroup} />;
  const actions = (
    <>
      <Button text="cancelar" className="btn-primary" onClick={onClose} />
    </>
  );

  return (
    <Modal
      showModal={show}
      modalHeader={header}
      modalBody={body}
      modalActions={actions}
      onClose={onClose}
      size="med"
    />
  );
}

export default UserAddToGroupModal;
