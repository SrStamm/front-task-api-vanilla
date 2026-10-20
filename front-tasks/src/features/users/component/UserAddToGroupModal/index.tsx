import { useEffect, useState } from "react";
import Button from "../../../../components/common/Button";
import Modal from "../../../../components/common/Modal";
import type { ReadUser } from "../../../../types/User";
import { AddRemoveUserToGroupInterface } from "../../../groups/schemas/Group";
import UserList from "../UserList";
import ErrorContainer from "../../../../components/common/ErrorContainer";
import { getApiErrorMessage } from "../../../../utils/errors";

interface userAddModalProps {
  show: boolean;
  onClose: () => void;
  users: ReadUser[];
  groupId: number;
  onAdd: (data: AddRemoveUserToGroupInterface) => Promise<void>;
  loadError?: string | null;
}

function UserAddToGroupModal({
  show,
  onClose,
  users,
  groupId,
  onAdd,
  loadError,
}: userAddModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setError(null);
  }, [show]);

  const handleAddUserToGroup = async (userId: number) => {
    setError(null);
    setIsAdding(true);

    try {
      await onAdd({ group_id: groupId, user_id: userId });
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsAdding(false);
    }
  };

  const header = (
    <div>
      <h2 className="modal-title-center">Lista de usuarios</h2>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
  const body = loadError ? (
    <ErrorContainer
      advice="Error al cargar los usuarios"
      recommendation={loadError}
      isButton={false}
      isError={true}
    />
  ) : (
    <UserList
      users={users}
      onAdd={handleAddUserToGroup}
      isAdding={isAdding}
    />
  );
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
