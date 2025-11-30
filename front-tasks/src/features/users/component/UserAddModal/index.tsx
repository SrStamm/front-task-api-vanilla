import Button from "../../../../components/common/Button";
import Modal from "../../../../components/common/Modal";
import type { UserInGroup } from "../../../groups/schemas/Group";
import UserListGroup from "../UserListGroup";

interface userAddModalProps {
  show: boolean;
  onClose: () => void;
  usersInGroup: UserInGroup[];
}

function UserAddModal({ show, onClose, usersInGroup }: userAddModalProps) {
  const header = <h2>Lista de usuarios</h2>;
  const body = <UserListGroup users={usersInGroup} addUser={true} />;
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
      size="med"
    />
  );
}

export default UserAddModal;
